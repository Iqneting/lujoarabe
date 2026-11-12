# Lujo Árabe — Instalador web MariaDB (STAGING) V1

**Rama:** lujoarabe. Conserva las versiones V40/V41 y main. **NO usar para cobros reales.**

## Función

- Página /instalar/ accesible solo por HTTPS, salvo pruebas locales.
- Genera una clave aleatoria de 48 caracteres SOLO en el Administrador de archivos del hosting, fuera de public_html.
- Rechaza claves incorrectas, sesiones inválidas y bases de datos con tablas existentes.
- Ejecuta las migraciones 001_initial y 002_commerce_gaps sobre una **BD nueva y vacía**.
- Verifica 38 tablas, 44 claves foráneas, versiones, 3 métodos de envío y estado inicial IVA.
- Guarda conexión fuera de raíz web: carpeta iqcommerce-private al lado del document root; archivo iqcommerce-config.php (permisos 0600).
- Anula la clave y bloquea definitivamente la instalación después del primer éxito. No incluye ningún usuario administrador.

## Guía para Hostinger, sin consola

1. Crear SUBDOMINIO DE PRUEBAS con carpeta pública vacía y HTTPS. Conectar el repositorio Iqneting/lujoarabe, rama lujoarabe. No cambiar el sitio de producción ni main.
2. En Hostinger, Bases de datos → MySQL/MariaDB: crear BD nueva y vacía, junto con su usuario y contraseña. Asignar ese usuario a la BD. Registrar nombre completo, host, puerto, usuario y contraseña en un lugar seguro (NO enviarlos a ChatGPT ni GitHub).
3. Comprobar que el directorio público del subdominio contiene instalar/index.php y database/migrations/001_initial.sql.
4. Abrir https://SUBDOMINIO-DE-PRUEBAS/instalar/ para generar la clave. La página mostrará la ruta PRIVADA de setup-key.txt.
5. En Administrador de archivos de Hostinger, abrir el archivo privado setup-key.txt y copiar la clave. Nunca mover ese archivo a public_html. Si no puedes acceder a la carpeta padre de public_html desde el gestor, pide a Hostinger habilitar ese acceso; no abras permisos públicos.
6. En el navegador pegar la clave, host, puerto, nombre de BD, usuario y contraseña. Pulsar Conectar, instalar y verificar.
7. Confirmar la pantalla Instalación verificada. La clave queda invalidada. El instalador muestra Instalador cerrado en visitas siguientes.
8. Opcionalmente, retirar la carpeta instalar del servidor (no del histórico en GitHub) al terminar staging. Mantener la carpeta privada y el archivo de credenciales fuera del directorio servido por el web server.

## Errores y precauciones

- Es indispensable PHP 8.2+ con pdo_mysql; MariaDB 10.6+.
- No instala si la base ya tiene tablas. No hace DROP, DELETE ni edita bases preexistentes.
- Las migraciones MariaDB incluyen DDL con autocommit: si una instalación falla tras crear tablas, la BD puede quedar parcialmente creada. NO reintentar sobre ella; crear otra BD de pruebas o investigar la interrupción con respaldo.
- Si no puede escribir fuera de public_html, no autorizar ruta pública alternativa para contraseñas.
- Al instalar, los nuevos datos se guardan en servidor, pero el Panel Maestro V41 y tienda-integrada todavía siguen usando localStorage hasta construir la API de escritura y conectar ambas pantallas.
- El backend actual solo ofrece consultas GET. El instalador NO habilita login, roles, checkout, pagos, notificaciones o despachos reales.
- Para servir /api/v1 en Hostinger hace falta configurar el enrutado Apache/PHP del backend. No afirmar que la API ya está disponible públicamente por el mero hecho de instalar la BD.

## QA

GitHub Actions ejecuta lint de PHP e instala otra base temporal con prueba HTTP de /instalar/; verifica rechazo de clave incorrecta, aplicación 001+002, conteos, archivo privado y cierre posterior.
