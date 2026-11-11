# CONTINUIDAD — IQ Commerce POS Panel Maestro V28

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe`  
**Rama:** `lujoarabe` (sin cambios a `main` ni despliegue de producción)  
**Versión HTML autónoma:** [IQ_COMMERCE_POS_MAESTRO_V28.html](./IQ_COMMERCE_POS_MAESTRO_V28.html)  
**Base preservada:** [V27](./IQ_COMMERCE_POS_MAESTRO_V27.html) y [continuidad V27](./CONTINUIDAD_V27.md)

## Referencia aprobada por el usuario

La imagen autorizada muestra un **Inicio móvil vertical**, con cabecera pequeña «Inicio», campanita, perfil y engrane; tres indicadores compactos alineados horizontalmente; tarjeta ancha de **Ventas de la semana** con dona azul y leyenda sencilla; fila Día/Semana/Mes/Año + Total vendido; y accesos inferiores de la versión existente.

El usuario pidió también **retirar la tarjeta Apariencia de Inicio y su pantalla redundante**, manteniendo lo demás. La idea de un bloque adicional «Producto estrella» se propuso, pero **no forma parte de la imagen finalmente elegida**: no agregarlo sin nueva autorización.

## Implementación V28

- Sustituye solo el bloque de cabecera, indicadores y resumen de Inicio. No modifica el contenido ni los modales de Productos, Pedidos, Clientes, Cupones, Contenido, Ajustes, etc.
- Los tres indicadores muestran ventas registradas, pedidos por preparar y productos con stock bajo usando los registros de la maqueta.
- Tarjeta horizontal con dona azul y porcentaje de avance semanal, importe de ventas semanales y leyenda.
- Los datos de ventas se calculan a partir de órdenes pagadas no canceladas y sus fechas; no se inventan operaciones ni tendencias.
- **La meta semanal de $10,000 MXN es solo un ejemplo visual claramente rotulado como demostrativo**, porque la V27 no tiene meta comercial definida. Si en el futuro existe `db.store.weeklyGoal` positivo, se usa ese dato y desaparece la aclaración de ejemplo. No suponer que la meta de muestra pertenece a la tienda real.
- Los botones Día/Semana/Mes/Año cambian el indicador **Total vendido**, según los pedidos de cada período; la dona identifica expresamente su alcance semanal.
- Se elimina el acceso `Apariencia` de `TILESET`, su función de pantalla y su caso de navegación. No se modifica el comportamiento de otras páginas.
- Se conserva la barra móvil V27 con Contenido visible y el engrane de Ajustes en la cabecera.
- Se conservan iconografía, tarjetas inferiores y funcionalidad Drag & Drop de V26/V27.

## Pruebas

- JavaScript embebido: `node --check` sin errores.
- Pruebas automatizadas de navegador con HTML cargado en Chromium a 360×800, 390×844, 430×932 y 1366×768.
- Las tres tarjetas, dona, ocho accesos inferiores y navegación a Cupones estuvieron presentes; se verificó cambio de período y se observó ausencia de desbordamiento horizontal y errores JavaScript en dichas resoluciones.
- No implica validación de datos reales ni despliegue. Queda por validar la apariencia final en dispositivos físicos y la meta comercial antes de conectar backend.

## Siguiente paso

Revisar visualmente V28, conservar V25–V27, y corregir observaciones en una nueva copia V29, si hiciera falta. **No publicar `main`, `admin/` o la tienda pública sin orden explícita.**
