<?php
declare(strict_types=1);

/**
 * CLI: php database/migrate.php /ruta/absoluta/config-privada.php
 * Solo instala la migración inicial sobre una BD VACÍA; no migra producción.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
if (isset($argv[1]) && $argv[1] !== '') {
    putenv('IQ_APP_CONFIG=' . $argv[1]);
}
require __DIR__ . '/../backend/src/database.php';

try {
    $db = iqDatabase();
    $tables = $db->query(
        'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()'
    )->fetchAll(PDO::FETCH_COLUMN);

    if (in_array('schema_migrations', $tables, true)) {
        $row = $db->query(
            "SELECT COUNT(*) FROM schema_migrations WHERE version = '001_initial'"
        )->fetchColumn();
        if ((int) $row > 0) {
            fwrite(STDOUT, "001_initial: ya aplicada; no se modificó la base de datos.\n");
            exit(0);
        }
    }
    if (count($tables) !== 0) {
        throw new RuntimeException(
            'La BD no está vacía o hay una instalación parcial. Revisar manualmente; no se realizan cambios.'
        );
    }

    $file = __DIR__ . '/migrations/001_initial.sql';
    $sql = file_get_contents($file);
    if ($sql === false) {
        throw new RuntimeException('No se pudo leer la migración');
    }
    // Script confiable del repositorio; comentarios completos por línea.
    $clean = preg_replace('/^\s*--[^\r\n]*$/m', '', $sql);
    $stmts = preg_split('/;\s*(?:\r?\n|$)/', (string) $clean);
    if (!is_array($stmts) || count($stmts) < 35) {
        throw new RuntimeException('Migración incompleta');
    }

    $executed = 0;
    foreach ($stmts as $stmt) {
        $stmt = trim($stmt);
        if ($stmt === '') {
            continue;
        }
        $db->exec($stmt);
        $executed++;
    }

    $version = $db->query(
        "SELECT COUNT(*) FROM schema_migrations WHERE version = '001_initial'"
    )->fetchColumn();
    if ((int) $version !== 1) {
        throw new RuntimeException('La versión de migración no se registró');
    }

    fwrite(STDOUT, "001_initial: creada y verificada ({$executed} sentencias).\n");
    exit(0);
} catch (Throwable $e) {
    // El diagnóstico técnico queda para CLI; no debe llegar a una respuesta web.
    fwrite(STDERR, "ERROR MIGRACIÓN: " . $e->getMessage() . "\n");
    fwrite(STDERR, "No reintentar sobre tablas parciales; restaurar BD de pruebas o revisar estado.\n");
    exit(1);
}
