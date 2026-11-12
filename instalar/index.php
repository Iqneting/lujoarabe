<?php
declare(strict_types=1);
/**
 * Instalador web de UNA SOLA VEZ: solo BD MariaDB nueva y vacía de staging.
 * No crea usuarios de hosting, no habilita pagos ni importa datos demo.
 */
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

function iqEsc(string $v): string { return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function iqInput(string $k, int $max = 255): string {
    $v = $_POST[$k] ?? '';
    return is_string($v) && strlen($v) <= $max ? trim($v) : '';
}
function iqRunSql(PDO $db, string $file, int $minimum): void {
    $sql = file_get_contents($file);
    if ($sql === false || preg_match('/\bDROP\s+(TABLE|DATABASE)\b/i', $sql)) {
        throw new RuntimeException('Migración SQL inválida.');
    }
    $clean = preg_replace('/^\s*--[^\r\n]*$/m', '', $sql);
    $parts = preg_split('/;\s*(?:\r?\n|$)/', (string) $clean);
    if (!is_array($parts) || count($parts) < $minimum) {
        throw new RuntimeException('Migración SQL incompleta.');
    }
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part !== '') $db->exec($part);
    }
}
function iqVerify(PDO $db): bool {
    $tables = (int) $db->query("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE'")->fetchColumn();
    $fks = (int) $db->query('SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL')->fetchColumn();
    $versions = $db->query('SELECT version FROM schema_migrations')->fetchAll(PDO::FETCH_COLUMN);
    $shipping = (int) $db->query('SELECT COUNT(*) FROM shipping_methods')->fetchColumn();
    $settings = $db->query('SELECT iva_enabled, iva_rate, iva_price_mode FROM store_settings WHERE id=1')->fetch(PDO::FETCH_ASSOC);
    return $tables === 38 && $fks === 44 && $shipping >= 3
        && in_array('001_initial', $versions, true)
        && in_array('002_commerce_gaps', $versions, true)
        && is_array($settings)
        && (int) $settings['iva_enabled'] === 0
        && (string) $settings['iva_rate'] === '16.00'
        && $settings['iva_price_mode'] === null;
}
function iqPrivateWrite(string $path, string $value): void {
    $fp = @fopen($path, 'x');
    if ($fp === false) throw new RuntimeException('No fue posible crear archivo privado.');
    try {
        if (fwrite($fp, $value) !== strlen($value)) {
            throw new RuntimeException('No fue posible escribir archivo privado.');
        }
        fflush($fp);
        @chmod($path, 0600);
    } finally { fclose($fp); }
}

$docroot = realpath((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''));
$private = ($docroot !== false && $docroot !== DIRECTORY_SEPARATOR) ? dirname($docroot) . '/iqcommerce-private' : '';
$configFile = $private === '' ? '' : $private . '/iqcommerce-config.php';
$keyFile = $private === '' ? '' : $private . '/setup-key.txt';
$doneFile = $private === '' ? '' : $private . '/installed.lock';
$mutexFile = $private === '' ? '' : $private . '/setup.lock';
$completed = $configFile !== '' && (is_file($configFile) || is_file($doneFile));
$errors = [];
$installedNow = false;
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (int) ($_SERVER['SERVER_PORT'] ?? 0) === 443;
$isLocal = in_array((string) ($_SERVER['REMOTE_ADDR'] ?? ''), ['127.0.0.1', '::1'], true);
$ready = true;

if (!$completed) {
    if (PHP_VERSION_ID < 80200 || !extension_loaded('pdo_mysql')) {
        $errors[] = 'Necesitas PHP 8.2 o superior y la extensión pdo_mysql.';
        $ready = false;
    }
    if (!$isHttps && !$isLocal) {
        $errors[] = 'Activa HTTPS antes de introducir credenciales.';
        $ready = false;
    }
    if ($private === '' || !is_file(__DIR__ . '/../database/migrations/001_initial.sql')
        || !is_file(__DIR__ . '/../database/migrations/002_commerce_gaps.sql')) {
        $errors[] = 'Faltan archivos del proyecto o no se detectó la raíz web.';
        $ready = false;
    }
    if ($ready) {
        if (!is_dir($private) && !@mkdir($private, 0700, true) && !is_dir($private)) {
            $errors[] = 'No se puede crear una carpeta privada fuera de public_html.';
            $ready = false;
        } elseif (!is_writable($private)) {
            $errors[] = 'La carpeta privada no tiene permiso de escritura.';
            $ready = false;
        } elseif (!is_file($keyFile)) {
            try { iqPrivateWrite($keyFile, bin2hex(random_bytes(24)) . "\n"); }
            catch (Throwable $e) {
                $errors[] = 'No se pudo generar la clave inicial privada.';
                $ready = false;
            }
        }
    }
}
if (!$completed && $ready) {
    ini_set('session.use_strict_mode', '1');
    session_name('IQCommerceInstall');
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/instalar', 'secure' => $isHttps,
        'httponly' => true, 'samesite' => 'Strict',
    ]);
    session_start();
    if (empty($_SESSION['iq_csrf']) || !is_string($_SESSION['iq_csrf'])) {
        $_SESSION['iq_csrf'] = bin2hex(random_bytes(24));
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    if ($completed) {
        http_response_code(409);
    } elseif (!$ready) {
        http_response_code(503);
    } else {
        $csrf = iqInput('csrf', 128);
        $secret = @file_get_contents($keyFile);
        if ($csrf === '' || !hash_equals((string) $_SESSION['iq_csrf'], $csrf)) {
            $errors[] = 'Sesión caducada. Recarga esta página.';
            http_response_code(403);
        } elseif ($secret === false || !hash_equals(trim($secret), iqInput('setup_key', 128))) {
            $errors[] = 'Clave de instalación incorrecta.';
            http_response_code(403);
        } else {
            $host = iqInput('db_host', 254);
            $database = iqInput('db_name', 64);
            $user = iqInput('db_user', 128);
            $pass = $_POST['db_password'] ?? '';
            $portRaw = iqInput('db_port', 5);
            $port = ctype_digit($portRaw) ? (int) $portRaw : 0;
            if (!preg_match('/^[a-zA-Z0-9][a-zA-Z0-9.-]{0,252}$/D', $host)
                || !preg_match('/^[a-zA-Z0-9_]{1,64}$/D', $database)
                || $user === '' || !is_string($pass) || strlen($pass) > 512
                || $port < 1 || $port > 65535) {
                $errors[] = 'Revisa host, puerto, nombre de base, usuario y contraseña.';
                http_response_code(422);
            } else {
                $mutex = @fopen($mutexFile, 'c+');
                if ($mutex === false || !flock($mutex, LOCK_EX | LOCK_NB)) {
                    $errors[] = 'Instalación en curso o bloqueo no disponible.';
                    http_response_code(409);
                    if (is_resource($mutex)) fclose($mutex);
                } else {
                    try {
                        if (is_file($configFile) || is_file($doneFile)) {
                            throw new RuntimeException('El instalador ya está cerrado.');
                        }
                        $db = new PDO(
                            'mysql:host=' . $host . ';port=' . $port . ';dbname=' . $database . ';charset=utf8mb4',
                            $user, $pass,
                            [
                                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                                PDO::ATTR_EMULATE_PREPARES => false,
                                PDO::MYSQL_ATTR_MULTI_STATEMENTS => false,
                                PDO::ATTR_TIMEOUT => 8,
                            ]
                        );
                        $version = (string) $db->query('SELECT VERSION()')->fetchColumn();
                        if (stripos($version, 'MariaDB') === false
                            || !preg_match('/(?:^|-)10\.(\d+)\./', $version, $m)
                            || (int) $m[1] < 6) {
                            throw new RuntimeException('Se requiere MariaDB 10.6 o superior.');
                        }
                        $already = (int) $db->query('SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()')->fetchColumn();
                        if ($already !== 0) {
                            throw new RuntimeException('La base debe estar completamente VACÍA; no se modificó.');
                        }
                        iqRunSql($db, __DIR__ . '/../database/migrations/001_initial.sql', 35);
                        iqRunSql($db, __DIR__ . '/../database/migrations/002_commerce_gaps.sql', 5);
                        if (!iqVerify($db)) {
                            throw new RuntimeException('La verificación de 38 tablas y 44 relaciones no coincidió.');
                        }
                        $credentials = [
                            'host' => $host, 'port' => $port, 'database' => $database,
                            'username' => $user, 'password' => $pass,
                        ];
                        iqPrivateWrite($configFile, "<?php\nreturn " . var_export($credentials, true) . ";\n");
                        iqPrivateWrite($doneFile, 'installed ' . gmdate('c') . "\n");
                        @unlink($keyFile);
                        $installedNow = true;
                        $completed = true;
                        $_SESSION = [];
                        session_regenerate_id(true);
                    } catch (PDOException $e) {
                        error_log('IQ Commerce installer database error: ' . $e->getCode());
                        $errors[] = 'MariaDB rechazó la conexión o alguna sentencia. Revisa las credenciales. Si hubo migración parcial, crea otra base vacía.';
                        http_response_code(422);
                    } catch (Throwable $e) {
                        error_log('IQ Commerce installer stopped: ' . get_class($e));
                        $errors[] = $e instanceof RuntimeException ? $e->getMessage() : 'No se pudo completar; revisa permisos del servidor.';
                        http_response_code(422);
                    } finally {
                        flock($mutex, LOCK_UN);
                        fclose($mutex);
                    }
                }
            }
        }
    }
}
$showForm = !$completed && $ready;
?><!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Instalador | IQ Commerce POS</title>
<style>
:root{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#172847;background:#f5f7fc}
*{box-sizing:border-box}body{margin:0;min-height:100vh;padding:26px 16px}main{max-width:940px;margin:auto}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:22px}
.brand{display:flex;gap:12px;align-items:center;font-size:14px;font-weight:800;letter-spacing:.05em}
.mark{display:grid;place-items:center;width:44px;height:44px;background:#214ea0;color:white;border-radius:14px;font-size:22px}
.tag{border:1px solid #c7d5ec;padding:8px 12px;border-radius:99px;color:#234a83;background:white;font-size:12px;font-weight:750}
h1{font-size:clamp(27px,4vw,40px);line-height:1.14;letter-spacing:-.035em;margin:14px 0 10px}
p{color:#52627d;line-height:1.6;margin:0 0 14px}.lead{max-width:690px}
.layout{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);gap:18px;margin-top:25px}
.card{background:white;border:1px solid #d3deed;border-radius:21px;padding:23px;box-shadow:0 8px 22px rgba(27,58,107,.045)}
h2{font-size:18px;margin:0 0 15px}.formgrid{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.field{display:flex;flex-direction:column;gap:7px;min-width:0}.field.wide{grid-column:1/-1}
label{color:#314360;font-weight:700;font-size:12px}
input{height:46px;width:100%;min-width:0;background:#f8faff;border:1px solid #bacce3;border-radius:12px;padding:0 13px;color:#142747;font:inherit;font-size:14px;outline:none}
input:focus{border-color:#3666c4;box-shadow:0 0 0 3px #dce9ff}
button{width:100%;margin-top:18px;height:48px;border:0;border-radius:13px;color:white;background:#2354b1;font-weight:750;font-size:15px;cursor:pointer}
button:hover{background:#17438f}
.mini{font-size:12px;color:#718098;margin-top:11px}
.steps{padding:0;margin:0;list-style:none;display:grid;gap:16px}
.steps li{display:flex;align-items:start;gap:11px;color:#50617d;line-height:1.5;font-size:13px}
.num{display:grid;place-items:center;flex:none;width:27px;height:27px;border-radius:9px;background:#e8f0ff;color:#2755a0;font-weight:800}
strong{color:#223653}
.path{display:block;overflow-wrap:anywhere;font:12px ui-monospace,SFMono-Regular,Consolas,monospace;margin:6px 0;padding:10px;background:#f0f4fb;border-radius:9px;color:#244872}
.message{padding:15px 17px;border:1px solid #bad0ed;border-radius:14px;background:#eef5ff;margin:18px 0;color:#234978;line-height:1.6}
.error{background:#fff5f4;border-color:#e9b8b3;color:#9a3029}
.success{background:#eaf8f2;border-color:#a8d8c6;color:#145c3d}
footer{padding:20px 4px;color:#7e8b9d;font-size:12px}
@media(max-width:690px){body{padding:16px 12px}.layout{grid-template-columns:1fr}.formgrid{grid-template-columns:1fr}.card{padding:19px}header{align-items:start}.tag{font-size:10px}}
</style></head><body><main>
<header><div class="brand"><span class="mark">IQ</span><span>IQ COMMERCE POS<br><small>CONFIGURACIÓN INICIAL</small></span></div><span class="tag">Lujo Árabe · Pruebas</span></header>
<h1>Instalación de MariaDB</h1>
<p class="lead">Configura la base de datos de pruebas en un solo proceso. El instalador creará las tablas, comprobará sus relaciones y se bloqueará para evitar una segunda instalación.</p>
<?php foreach ($errors as $error): ?><div class="message error" role="alert"><?= iqEsc($error) ?></div><?php endforeach; ?>
<?php if ($completed): ?>
<section class="card"><h2><?= $installedNow ? '✓ Instalación verificada' : '✓ Instalador cerrado' ?></h2>
<p><?= $installedNow ? 'MariaDB preparada: 38 tablas, 44 relaciones y migraciones 001 y 002. La clave de instalación fue anulada.' : 'Ya existe una instalación privada en este servidor. No es posible ejecutarla de nuevo desde la web.' ?></p>
<div class="message success"><strong>Importante:</strong> esto prepara la base, pero todavía NO habilita ventas, acceso de operadores ni pagos reales. La integración de la API y la autenticación son la siguiente fase.</div></section>
<?php elseif ($showForm): ?>
<div class="layout"><section class="card"><h2>Datos para conectar</h2>
<form method="post" autocomplete="off">
<input type="hidden" name="csrf" value="<?= iqEsc((string) $_SESSION['iq_csrf']) ?>">
<div class="formgrid">
<div class="field wide"><label for="key">Clave privada de instalación</label><input id="key" name="setup_key" type="password" required minlength="48" maxlength="48" autocomplete="off" placeholder="Pega la clave privada"></div>
<div class="field"><label for="host">Host MariaDB</label><input id="host" name="db_host" required maxlength="254" value="<?= iqEsc(iqInput('db_host') ?: 'localhost') ?>"></div>
<div class="field"><label for="port">Puerto</label><input id="port" name="db_port" required maxlength="5" inputmode="numeric" value="<?= iqEsc(iqInput('db_port') ?: '3306') ?>"></div>
<div class="field wide"><label for="db">Nombre de la base VACÍA</label><input id="db" name="db_name" required maxlength="64" value="<?= iqEsc(iqInput('db_name', 64)) ?>" placeholder="u123456_lujoarabe"></div>
<div class="field wide"><label for="user">Usuario de MariaDB</label><input id="user" name="db_user" required maxlength="128" value="<?= iqEsc(iqInput('db_user', 128)) ?>" placeholder="u123456_usuario"></div>
<div class="field wide"><label for="pass">Contraseña de MariaDB</label><input id="pass" name="db_password" type="password" maxlength="512" autocomplete="new-password" placeholder="Contraseña de Hostinger"></div>
</div><button type="submit">Conectar, instalar y verificar</button>
<div class="mini">No modifica otras bases. Si detecta tablas existentes, detiene la instalación.</div>
</form></section>
<aside class="card"><h2>Antes de continuar</h2><ol class="steps">
<li><span class="num">1</span><span>En Hostinger crea una <strong>base MariaDB nueva y vacía</strong>, con usuario y contraseña propios.</span></li>
<li><span class="num">2</span><span>En el <strong>Administrador de archivos</strong> lee la clave privada:<code class="path"><?= iqEsc($keyFile) ?></code>La clave NO aparece en esta página.</span></li>
<li><span class="num">3</span><span>Copia los datos de MariaDB y la clave privada en el formulario.</span></li>
<li><span class="num">4</span><span>Instala. Se verifican automáticamente <strong>38 tablas y 44 relaciones</strong> y se bloquea el instalador.</span></li>
</ol></aside></div>
<?php endif; ?>
<footer>Entorno de pruebas · Sin datos demo ni pagos reales · Credenciales privadas fuera de la raíz pública.</footer>
</main></body></html>
