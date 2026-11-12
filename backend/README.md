# Backend inicial — IQ Commerce POS

PHP 8.2+, PDO MariaDB 10.6+. SOLO LECTURA por ahora. Sin checkout ni cambios reales.

## Estructura

- src/database.php — conector PDO con configuración privada obligatoria.
- public/api/index.php — enrutador JSON de consulta.
- public/api/.htaccess — rewrite de /api/v1/* en Apache.
- ../database/migrate.php — instalador CLI de esquema inicial.

IQ_APP_CONFIG debe apuntar a ruta absoluta de archivo PHP privado (ver database/config.example.php). Colocar src/ fuera de public_html y publicar solo front controller api tras ajustar rutas de despliegue al hosting. No copiar backend completo a la raíz web.

## Endpoints actualmente en código

- GET /api/v1/health
- GET /api/v1/store/config
- GET /api/v1/catalog/categories
- GET /api/v1/catalog/products (limit, page, category_id)

Aún no hay conexión con Hostinger, ni catálogo real cargado en la base, ni tests HTTP contra el servidor.

## Siguiente fase

1. Migrar y validar BD real de pruebas.
2. Login seguro, rol y permisos de dueño/administrador/operador.
3. CRUD catálogo y medios; pedidos con items y stock reservado.
4. Verificar transferencias y pasarelas sin falsas confirmaciones.
5. Devoluciones vinculadas a order_items y reembolsos auditables.
6. Integrar tienda y V40 preservando diseño.

Nada de esto representa aprobación para producción.
