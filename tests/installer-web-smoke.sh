#!/usr/bin/env bash
set -euo pipefail

# Solo para CI: segunda base de datos temporal separada de la prueba CLI.
php <<'PHP'
<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306;charset=utf8mb4', 'root', 'ci-root-temporary-only');
$pdo->exec('CREATE DATABASE iqcommerce_installer_ci CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
$pdo->exec("GRANT ALL PRIVILEGES ON iqcommerce_installer_ci.* TO 'iqcommerce_ci'@'%'");
PHP

webroot="$(pwd)"
private="$(dirname "$webroot")/iqcommerce-private"
test ! -f "$private/iqcommerce-config.php"
php -S 127.0.0.1:18081 -t . > /tmp/iqcommerce-installer-web-ci.log 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true; rm -rf "$private" /tmp/iqcommerce-installer-web-ci.*' EXIT
sleep 1

curl -fsS -c /tmp/iqcommerce-installer-web-ci.cookies http://127.0.0.1:18081/instalar/ > /tmp/iqcommerce-installer-web-ci.page
test -f "$private/setup-key.txt"
key="$(tr -d '\r\n' < "$private/setup-key.txt")"
csrf="$(grep -oP 'name="csrf" value="\K[^"]+' /tmp/iqcommerce-installer-web-ci.page | head -1)"
test "$(printf '%s' "$key" | wc -c)" -eq 48
test "$(printf '%s' "$csrf" | wc -c)" -ge 32

status="$(curl -sS -o /tmp/iqcommerce-installer-web-ci.wrong -w '%{http_code}' \
  -b /tmp/iqcommerce-installer-web-ci.cookies \
  --data-urlencode "csrf=$csrf" --data-urlencode "setup_key=incorrect" \
  --data-urlencode "db_host=127.0.0.1" --data-urlencode "db_port=3306" \
  --data-urlencode "db_name=iqcommerce_installer_ci" --data-urlencode "db_user=iqcommerce_ci" \
  --data-urlencode "db_password=ci-temporary-only" http://127.0.0.1:18081/instalar/)"
test "$status" = 403
test ! -f "$private/iqcommerce-config.php"

status="$(curl -sS -o /tmp/iqcommerce-installer-web-ci.done -w '%{http_code}' \
  -b /tmp/iqcommerce-installer-web-ci.cookies \
  --data-urlencode "csrf=$csrf" --data-urlencode "setup_key=$key" \
  --data-urlencode "db_host=127.0.0.1" --data-urlencode "db_port=3306" \
  --data-urlencode "db_name=iqcommerce_installer_ci" --data-urlencode "db_user=iqcommerce_ci" \
  --data-urlencode "db_password=ci-temporary-only" http://127.0.0.1:18081/instalar/)"
test "$status" = 200
grep -q 'Instalación verificada' /tmp/iqcommerce-installer-web-ci.done
test -f "$private/iqcommerce-config.php"
test -f "$private/installed.lock"
test ! -f "$private/setup-key.txt"
php database/verify-002.php "$private/iqcommerce-config.php"
curl -fsS http://127.0.0.1:18081/instalar/ | grep -q 'Instalador cerrado'
echo 'Instalador web: rechazo 403, 38 tablas, 44 FKs y cierre verificados'
