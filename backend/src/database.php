<?php
declare(strict_types=1);

/**
 * Conexión única de IQ Commerce POS. Requiere IQ_APP_CONFIG apuntando a
 * un PHP PRIVADO fuera de public_html que devuelva un array de configuración.
 * No guarda ni publica claves en el repositorio.
 */
function iqDatabase(): PDO
{
    $file = getenv('IQ_APP_CONFIG') ?: '';
    if ($file === '' || !str_starts_with($file, '/') || !is_readable($file)) {
        throw new RuntimeException('Missing private application config');
    }

    $config = require $file;
    if (!is_array($config)) {
        throw new RuntimeException('Invalid application config');
    }

    foreach (['host', 'database', 'username', 'password'] as $key) {
        if (!array_key_exists($key, $config) || !is_string($config[$key])) {
            throw new RuntimeException('Invalid database configuration');
        }
    }
    if ($config['host'] === '' || $config['database'] === '' || $config['username'] === '') {
        throw new RuntimeException('Incomplete database configuration');
    }

    $port = (int) ($config['port'] ?? 3306);
    if ($port < 1 || $port > 65535) {
        throw new RuntimeException('Invalid database port');
    }
    $dsn = 'mysql:host=' . $config['host']
        . ';port=' . $port
        . ';dbname=' . $config['database']
        . ';charset=utf8mb4';

    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_MULTI_STATEMENTS => false,
    ]);
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
}
