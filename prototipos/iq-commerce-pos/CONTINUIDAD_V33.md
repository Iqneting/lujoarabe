# CONTINUIDAD — IQ Commerce POS Panel Maestro V33

**Fecha:** 2026-11-11
**Repositorio:** `Iqneting/lujoarabe`
**Rama de prototipos:** `lujoarabe`
**Archivo autónomo:** [IQ_COMMERCE_POS_MAESTRO_V33.html](./IQ_COMMERCE_POS_MAESTRO_V33.html)
**Base intacta:** [V32](./IQ_COMMERCE_POS_MAESTRO_V32.html)
**Producción:** sin cambios; no desplegar en `main` sin autorización.

## Instrucción del usuario

«Pon cerrar sesión».

## Cambio puntual

- Se agregó botón visible **Cerrar sesión** en **Ajustes → Sesión**, con icono de salida rojo y el estilo visual del panel aprobado.
- El botón abre un **modal propio** de confirmación, sin diálogos nativos.
- Al confirmar, la interfaz administrativa se sustituye por una pantalla **Panel cerrado / Sesión finalizada**, con opción **Volver al panel**.
- Conserva datos locales, configuraciones, historial y versiones anteriores.
- La salida se representa mediante una bandera de demostración en `sessionStorage`, cuando está disponible, sin borrar `localStorage`.
- **No existe backend de autenticación en esta maqueta:** este cierre es solo visual. La vuelta al panel no requiere contraseña y no constituye una barrera de seguridad. El inicio/cierre de sesión real requerirá backend, autenticación, expiración y revocación de sesión del servidor.

## Sin otros cambios

Las gráficas, ocho tarjetas de Inicio, filtros Día/Semana/Mes/Año, menús de escritorio y móvil, Contenido, Cupones, pedidos y demás módulos permanecen como V32. No modificar diseño, páginas ni flujos ajenos.

## Validación

- Sintaxis de JavaScript validada con `node --check`.
- Chromium a 360×800, 390×844, 430×932 y 1366×768: Inicio conservado, Ajustes visible, botón Cerrar sesión, confirmación, pantalla de salida y retorno al panel.
- Sin errores JavaScript ni desbordamiento horizontal detectados en esas pruebas de navegador local.
- No se hizo prueba de autenticación real ni despliegue en producción.

## Continuación

Mantener V33 como copia de referencia. La siguiente versión debe crearse con nombre nuevo, preservando V32/V33 y toda la línea visual aprobada. No asumir que la pantalla de cierre simulado brinda seguridad real.
