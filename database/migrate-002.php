<?php
declare(strict_types=1);
/**
 * Instala 002_commerce_gaps SOLO DESPUÉS de 001_initial.
 * CLI: php database/migrate-002.php /ruta/privada/config.php
 * No ejecutar sobre producción sin respaldo y plan de reversión.
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
    $tables = $db->query(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()"
    )->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('schema_migrations', $tables, true)) {
        throw new RuntimeException('Primero instala 001_initial');
    }
    $has001 = (int) $db->query(
        "SELECT COUNT(*) FROM schema_migrations WHERE version='001_initial'"
    )->fetchColumn();
    if ($has001 !== 1) {
        throw new RuntimeException('Falta 001_initial');
    }
    $has002 = (int) $db->query(
        "SELECT COUNT(*) FROM schema_migrations WHERE version='002_commerce_gaps'"
    )->fetchColumn();
    if ($has002 === 1) {
        fwrite(STDOUT, "002_commerce_gaps: ya aplicada; sin cambios.\n");
        exit(0);
    }
    foreach (['bank_accounts', 'shipping_methods', 'exchanges'] as $newTable) {
        if (in_array($newTable, $tables, true)) {
            throw new RuntimeException("Existe tabla parcial {$newTable}; revisar y respaldar antes de reintentar");
        }
    }
    if (count($tables) !== 35) {
        throw new RuntimeException('Se esperan exactamente 35 tablas tras 001_initial');
    }
    $sql = file_get_contents(__DIR__ . '/migrations/002_commerce_gaps.sql');
    if ($sql === false) {
        throw new RuntimeException('Migración 002 no encontrada');
    }
    $clean = preg_replace('/^\s*--[^\r\n]*$/m', '', $sql);
    $parts = preg_split('/;\s*(?:\r?\n|$)/', (string) $clean);
    if (!is_array($parts) || count($parts) < 5) {
        throw new RuntimeException('Migración 002 incompleta');
    }
    $steps=0;
    foreach ($parts as $part) {
        $part=trim($part);
        if ($part==='') continue;
        $db->exec($part);
        $steps++;
    }
    if ((int) $db->query(
        "SELECT COUNT(*) FROM schema_migrations WHERE version='002_commerce_gaps'"
    )->fetchColumn() !== 1) {
        throw new RuntimeException('Versión 002 no registrada');
    }
    fwrite(STDOUT, "002_commerce_gaps: creada y verificada ({$steps} sentencias).\n");
} catch (Throwable $e) {
    fwrite(STDERR, "ERROR MIGRACIÓN 002: " . $e->getMessage() . "\n");
    fwrite(STDERR, "No reintentar si hay tablas parciales; investigar/recuperar primero.\n");
    exit(1);
}
