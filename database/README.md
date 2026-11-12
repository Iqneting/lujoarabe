# Instalación MariaDB de IQ Commerce POS

**NO ejecutado aún en un servidor MariaDB ni en Hostinger.** No hay credenciales reales en este repositorio.

## Preparación en Hostinger

1. Crear una BD de pruebas NUEVA Y VACÍA, separada de producción.
2. Crear usuario propio limitado a esa BD; jamás usar root en la aplicación.
3. Copiar database/config.example.php fuera de public_html y fuera de GitHub, por ejemplo /home/USUARIO/private/iqcommerce-config.php.
4. Completar la contraseña privada de base de datos dentro de ese archivo. No pegarla en el HTML, mensajes públicos ni archivos del repositorio.
5. PHP 8.2+ con PDO/pdo_mysql; MariaDB 10.6+.

## Aplicación CLI

~~~bash
php database/migrate.php /ruta/absoluta/iqcommerce-config.php
~~~

El instalador se niega a actuar sobre bases no vacías y reconoce 001_initial si está instalada. No contiene DROP. MariaDB hace autocommit en DDL; una interrupción puede dejar tablas parciales. Nunca reintentar ciegamente: revisar, y si la BD es de prueba vacía recrearla antes de un nuevo intento.

## Verificación en BD de desarrollo

~~~sql
SELECT version, applied_at FROM schema_migrations;
SELECT COUNT(*) AS tablas FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE';
SELECT id, store_name, iva_enabled, iva_rate, iva_price_mode
FROM store_settings WHERE id = 1;
~~~

Esperado: esquema 001_initial, 35 tablas, IVA desactivado, 16.00, precio-modo NULL. El esquema documenta 42 relaciones de clave foránea.

## Reglas de operación

- No importar órdenes, pagos, clientes o cupones ficticios de la V40.
- Fotos comerciales finales se cargan en almacenamiento validado y seguro; en DB solo la clave.
- Variables y claves privadas fuera de public_html. Prohibido exponer archivos de configuración.
- Copias de seguridad y verificación de restauración antes de migraciones posteriores.
- Nuevas migraciones numeradas 002, 003... sin editar 001_initial una vez ejecutada.
- Nunca migrar una base de producción sin QA, backup y plan de reversión.
