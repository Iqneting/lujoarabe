# Continuidad — Backend/MariaDB inicial para Lujo Árabe

**Fecha:** 11 nov 2026, CDMX. **Repo:** Iqneting/lujoarabe. **Rama:** lujoarabe.
**Punto anterior:** IQ Commerce POS Maestro V40 (IVA 16% confirmable).
**Objetivo:** pasar de maqueta local a modelo persistente, sin alterar diseños, y preparar una API compartida.

## Entrega efectuada

1. database/migrations/001_initial.sql: 35 tablas, 42 FKs, catálogo universal con variantes y snapshots, reservas e historial de stock, pedidos y líneas, clientes, pagos, comprobantes, envíos, devoluciones ligadas a order_items, reembolsos, cupones, contenido, usuarios/roles, auditoría, idempotencia y outbox.
2. database/config.example.php: plantilla de configuración que NO contiene contraseñas reales.
3. database/migrate.php: instalador CLI para BD nueva y vacía; reconoce instalación previa; no DROP.
4. database/verify.php: verificación solo lectura de tablas, FKs y configuración.
5. backend/src/database.php: PDO con parámetros y config externa privada.
6. backend/public/api/index.php: API inicial GET (health, store/config, categories, products), errores sanitizados, entrada validada.
7. backend/public/api/.htaccess: enrutado Apache de /api/v1/*.
8. docs/ARQUITECTURA_MARIADB_V1.md: modelo relacional, transacciones y correspondencia con V40.
9. docs/CONTRATOS_API_V1.md: contrato de checkout y permisos; marca explícitamente rutas futuras NO implementadas.
10. database/README.md y backend/README.md: pasos de instalación y límites.
11. .github/workflows/backend-ci.yml: PHP lint, migración real en MariaDB 10.11 temporal, verificación e HTTP smoke de cuatro GET.
12. .gitignore: permite versionar solo migraciones SQL y sigue bloqueando secretos/dumps.
13. docs/QA_BACKEND_MARIADB_V1.md: resultados y pendientes verificables.

## Estado

- **PASS:** [GitHub Actions #43133797840](https://github.com/Iqneting/lujoarabe/actions/runs/43133797840).
- **INTOCABLE:** V40 HTML y versiones anteriores; no hubo cambio al frontend ni a main.
- **SIN DEPLOY:** workflow de Hostinger se saltó; ver [run](https://github.com/Iqneting/lujoarabe/actions/runs/43133797806).
- **PENDIENTE:** base de datos de staging Hostinger, credenciales privadas, comprobación servidor real, autenticar operador, endpoints de escritura e integración frontend.
- **NOTA IMPORTANTE:** la tienda y V40 continúan utilizando localStorage y NO comparten pedidos todavía.

## Continuación recomendada, estrictamente en este orden

1. Provisionar BD MariaDB VACÍA de desarrollo en Hostinger y archivo config privado FUERA de public_html.
2. Ejecutar migración 001 y verify en el servidor usando CLI, sin entregar claves al chat ni al repo.
3. Preparar estructura PHP fuera de raíz web, endpoint /api/v1/health y pruebas HTTPS/HTTP contra staging.
4. Crear bootstrap de usuario dueño + autenticación segura y permisos en servidor.
5. CRUD de categorías/productos e imágenes; conectar catálogo público y Maestro V40 a misma API.
6. Implementar checkout transaccional idempotente con líneas originales, reservas y movimientos de stock.
7. Implementar pagos verificables, envío, seguimiento y devoluciones ligadas a order_items.
8. QA E2E con dos dispositivos/sesiones, concurrencia, fallas de pagos y restauración de respaldo.
9. Integración productiva solo tras autorización y validación comercial.

## Decisiones comerciales que no deben inventarse

- Al activar IVA, precio con impuesto incluido vs agregado. Mantener modo NULL y rechazar checkout fiscal hasta decisión.
- Políticas de reservas, métodos de pago, envío, cancelación, devoluciones, tasas especiales.
- Precios/fotos/productos oficiales y reglas de venta reales.

Si se retoma en otro hilo, comenzar con este documento, el reporte QA y V40, sin recrear interfaces genéricas.
