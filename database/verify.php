<?php
declare(strict_types=1);

/**
 * Verificación SOLO LECTURA de la instalación MariaDB V1.
 * php database/verify.php /ruta/absoluta/config-privada.php
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
if (!empty($argv[1])) {
    putenv('IQ_APP_CONFIG=' . $argv[1]);
}
require __DIR__ . '/../backend/src/database.php';

try {
    $db = iqDatabase();
    $version = $db->query(
        "SELECT COUNT(*) FROM schema_migrations WHERE version='001_initial'"
    )->fetchColumn();
    $tables = $db->query(
        "SELECT COUNT(*) FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE='BASE TABLE'"
    )->fetchColumn();
    $keys = $db->query(
        "SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA=DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL"
    )->fetchColumn();
    $store = $db->query(
        'SELECT iva_enabled, iva_rate, iva_price_mode
         FROM store_settings WHERE id=1'
    )->fetch();

    $ok = ((int) $version === 1)
        && ((int) $tables === 35)
        && ((int) $keys === 42)
        && is_array($store)
        && in_array((int) $store['iva_enabled'], [0, 1], true)
        && (float) $store['iva_rate'] >= 0
        && (float) $store['iva_rate'] <= 100;

    // El valor 16/0/NULL se verifica solo para instalación recién creada;
    // en una tienda configurada puede variar sin incumplir el esquema.
    echo json_encode([
        'ok' => $ok,
        'migration' => (int) $version,
        'tables' => (int) $tables,
        'foreign_keys' => (int) $keys,
        'iva_enabled' => $store ? (bool) $store['iva_enabled'] : null,
        'iva_rate' => $store['iva_rate'] ?? null,
        'iva_price_mode' => $store['iva_price_mode'] ?? null,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) . "\n";
    exit($ok ? 0 : 1);
} catch (Throwable $e) {
    fwrite(STDERR, "Verificación fallida: " . get_class($e) . "\n");
    exit(1);
}
