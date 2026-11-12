<?php
/**
 * EJEMPLO SIN SECRETOS. Copiar MANUALMENTE a una ruta privada fuera
 * de public_html, p. ej. /home/usuario/private/iqcommerce-config.php.
 * Establecer IQ_APP_CONFIG con la ruta absoluta del archivo privado.
 * Nunca subir ese archivo real a GitHub ni a la carpeta web.
 */
return [
    'host' => '127.0.0.1',
    'port' => 3306,
    'database' => 'NOMBRE_BD_PRIVADO',
    'username' => 'USUARIO_BD_PRIVADO',
    'password' => 'PONER_PASSWORD_SOLO_EN_ARCHIVO_PRIVADO',
];
