# CONTINUIDAD — IQ Commerce POS V36

Fecha: 11-nov-2026. Base: V35. Rama de prototipos: `lujoarabe`. No producción.

## Solicitud aprobada
El usuario compartió como referencia el filtro de **Productos**, con tarjetas/chips visuales, contorno claro, iconos y fondos contrastados. Aprobó la imagen visual de filtros Devoluciones y ordenó: **«Siii ese es el estándar muéstrame cómo no cambies más»**.

## Cambio exacto V36
- En **Devoluciones → Listado**, se reemplazó únicamente la fila de filtros nativos genéricos por **5 tarjetas POS**, con icono, título y contador dinámico: Todos, Pendientes, En proceso, Resueltas y Rechazadas.
- Las cinco tarjetas se distribuyen en 5 columnas en escritorio; en móvil se adaptan a una cuadrícula de **3 arriba y 2 abajo** sin desplazamiento horizontal.
- Los filtros mantienen exactamente la acción previa `data-action="v35-filter"`; siguen filtrando los mismos estados.
- Solo en el encabezado del **listado** se eliminó el icono grande de regalo duplicado; queda el icono pequeño junto al título, botón de regreso y ayuda. No afecta los encabezados del asistente ni del seguimiento.
- Se mantuvo intacta la base V35: tarjetas de resumen, botón **Nueva devolución**, barra de búsqueda, tarjetas de casos, estados, tres pasos del asistente, detalle, seguimiento, barra inferior móvil y acceso existente **Pedidos → Devoluciones**. Ningún otro módulo cambió.

## Archivo / descarga
- `prototipos/iq-commerce-pos/IQ_COMMERCE_POS_MAESTRO_V36.html`
- Descarga ZIP desde Chrome en Android: https://github.com/Iqneting/lujoarabe/archive/refs/heads/descarga-v36.zip ; rama aislada contiene sólo el archivo HTML V36.
- La V35 y todas las versiones anteriores permanecen disponibles.

## Pruebas
- `node --check` para los dos scripts JS del HTML: sin errores.
- Chromium vía Playwright: 390 px y 1366 px. Resultado: 5 pestañas, icono duplicado oculto, título correcto, filtros cambian a «En proceso» al tocar, sin errores de JS ni scroll horizontal.
- Capturas disponibles en los artefactos de conversación: `V36_devoluciones_390.png` y `V36_devoluciones_1366.png`.
- Git blob SHA del HTML: `a5b9a2db1450c1895dd440fad46e88d7708082e1`; verificado contra la copia local.

**Regla global:** seguir el estándar POS aprobado de Productos para pestañas futuras. No reacomodar otros elementos sin aprobación expresa. `main` y producción intactos.
