<?php
declare(strict_types=1);

/**
 * API V1 — LECTURA SOLAMENTE. No realizar pagos, checkout ni operaciones
 * de administración hasta implementar autenticación, CSRF y transacciones.
 * Desplegar únicamente con backend/src fuera de la raíz pública y config privada.
 */
require __DIR__ . '/../../src/database.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

function iqJson(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}
function iqLimit(string $name, int $default, int $maximum): int
{
    $raw = $_GET[$name] ?? (string) $default;
    if (!is_string($raw) || !preg_match('/^[0-9]{1,6}$/', $raw)) {
        iqJson(422, ['error' => 'invalid_pagination']);
    }
    return max(1, min((int) $raw, $maximum));
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
$path = rtrim((string) $path, '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$routes = [
    '/api/v1/health',
    '/api/v1/store/config',
    '/api/v1/catalog/categories',
    '/api/v1/catalog/products',
];
if (!in_array($path, $routes, true)) {
    iqJson(404, ['error' => 'not_found']);
}
if ($method !== 'GET') {
    header('Allow: GET');
    iqJson(405, ['error' => 'method_not_allowed']);
}

try {
    $db = iqDatabase();
    if ($path === '/api/v1/health') {
        $version = $db->query(
            "SELECT COUNT(*) FROM schema_migrations WHERE version = '001_initial'"
        )->fetchColumn();
        if ((int) $version !== 1) {
            iqJson(503, ['ok' => false, 'error' => 'migration_required']);
        }
        iqJson(200, ['ok' => true, 'service' => 'iq-commerce-api', 'schema' => '001_initial']);
    }

    if ($path === '/api/v1/store/config') {
        $row = $db->query(
            'SELECT store_name, currency, iva_enabled, iva_rate, iva_price_mode
             FROM store_settings WHERE id = 1'
        )->fetch();
        if (!$row) {
            iqJson(503, ['error' => 'store_not_configured']);
        }
        iqJson(200, [
            'data' => [
                'name' => $row['store_name'],
                'currency' => $row['currency'],
                'iva_enabled' => (bool) $row['iva_enabled'],
                'iva_rate' => (string) $row['iva_rate'],
                'iva_price_mode' => $row['iva_price_mode'],
                'pricing_ready' => !$row['iva_enabled'] || $row['iva_price_mode'] !== null,
            ],
        ]);
    }

    if ($path === '/api/v1/catalog/categories') {
        $rows = $db->query(
            'SELECT id, parent_id, slug, name, icon_storage_key
             FROM categories WHERE is_active = 1 ORDER BY sort_order, id LIMIT 150'
        )->fetchAll();
        iqJson(200, ['data' => $rows]);
    }

    $limit = iqLimit('limit', 24, 50);
    $page = iqLimit('page', 1, 100000);
    $offset = ($page - 1) * $limit;

    $category = $_GET['category_id'] ?? null;
    if ($category !== null && (!is_string($category) || !preg_match('/^[1-9][0-9]{0,17}$/', $category))) {
        iqJson(422, ['error' => 'invalid_category_id']);
    }

    $query =
        'SELECT p.id, p.slug, p.name, p.brand, p.description,
                p.category_id, v.id AS variant_id, v.sku, v.label,
                v.price, COALESCE(b.on_hand - b.reserved, 0) AS available_quantity,
                (SELECT pm.storage_key FROM product_media pm
                 WHERE pm.product_id = p.id AND pm.media_type = :media_type
                 ORDER BY pm.is_primary DESC, pm.sort_order ASC, pm.id ASC LIMIT 1)
                 AS primary_image_storage_key
         FROM products p
         INNER JOIN product_variants v ON v.product_id = p.id
            AND v.is_active = 1 AND v.is_default = 1
         LEFT JOIN inventory_balances b ON b.variant_id = v.id
         WHERE p.is_published = 1 AND p.archived_at IS NULL';
    if ($category !== null) {
        $query .= ' AND p.category_id = :category_id';
    }
    $query .= ' ORDER BY p.is_featured DESC, p.created_at DESC, p.id DESC
                LIMIT :limit OFFSET :offset';
    $stmt = $db->prepare($query);
    $stmt->bindValue(':media_type', 'image', PDO::PARAM_STR);
    if ($category !== null) {
        $stmt->bindValue(':category_id', $category, PDO::PARAM_STR);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    iqJson(200, [
        'data' => $stmt->fetchAll(),
        'pagination' => ['page' => $page, 'limit' => $limit],
    ]);
} catch (PDOException $e) {
    error_log('IQ Commerce database query failed: ' . $e->getCode());
    iqJson(503, ['error' => 'service_unavailable']);
} catch (Throwable $e) {
    error_log('IQ Commerce API error: ' . get_class($e));
    iqJson(500, ['error' => 'internal_error']);
}
