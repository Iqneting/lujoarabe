# QA técnico — MariaDB / API inicial

**Fecha México:** 11 de noviembre de 2026.
**Rama:** lujoarabe.
**Resultado:** PASS en GitHub Actions sobre MariaDB temporal 10.11. NO es una validación de Hostinger ni de operaciones comerciales reales.

## Ejecución verificada

[GitHub Actions — ejecución satisfactoria #43133797840](https://github.com/Iqneting/lujoarabe/actions/runs/43133797840)

| Prueba | Resultado |
|---|---|
| PHP -l (database.php, migrate.php, verify.php, config.example.php, API index.php) | PASS, sin errores de sintaxis |
| Análisis SQL declarativo | PASS, 35 CREATE TABLE, 42 REFERENCES, sin DROP TABLE |
| Instalar 001_initial en MariaDB 10.11 vacía | PASS, 39 sentencias |
| Repetir migración | PASS, detectó versión ya aplicada sin cambiar tablas |
| Conteo real information_schema.TABLES | PASS, 35 tablas |
| Conteo real information_schema.KEY_COLUMN_USAGE | PASS, 42 FKs |
| Config inicial tienda | PASS, iva_enabled=false; iva_rate=16.00; iva_price_mode=NULL |
| GET /api/v1/health | PASS |
| GET /api/v1/store/config | PASS, IVA 16% y desactivado |
| GET /api/v1/catalog/categories | PASS, lista vacía válida |
| GET /api/v1/catalog/products?limit=12 | PASS, lista vacía y paginación |
| Categoría inválida en API | PASS, respuesta HTTP 422 |
| POST a endpoint de productos de solo lectura | PASS, respuesta HTTP 405 |

El primer intento de CI falló por un caracter de escape extra en la ruta de configuración temporal del workflow; se corrigió y la segunda y tercera ejecuciones finalizaron exitosamente. La falla no fue un error SQL ni PHP.

## Confirmaciones de seguridad

- No se introdujeron secretos reales ni usuarios reales.
- El acceso a DB requiere una ruta de configuración privada: IQ_APP_CONFIG.
- El instalador solo acepta CLI y BD inicialmente vacía.
- Todos los endpoints presentes son GET, sin escritura ni pagos.
- La automatización de despliegue Hostinger fue omitida, como confirma la ejecución:
  [Hostinger skipped #43133797806](https://github.com/Iqneting/lujoarabe/actions/runs/43133797806).
- La tienda pública, el Panel Maestro V40 y main no se modificaron.

## Fuera de las pruebas

- Instalar en MariaDB de Hostinger real (aún no existe conexión desde esta entrega).
- Cargar catálogo comercial y subir medios autorizados.
- CRUD autenticado, login, CSRF, pagos, stock transaccional y devoluciones reales.
- Rendimiento bajo concurrencia, respaldos y restauración, seguridad en staging, autorización por rol.
- Navegador de panel V40; esta fase no lo altera.

No usar el PASS de CI para afirmar que la tienda puede realizar ventas reales.
