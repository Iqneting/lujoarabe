# CONTINUIDAD — IQ Commerce POS Maestro V40

**Fecha:** 11 de noviembre de 2026
**Repositorio:** `Iqneting/lujoarabe`, rama `lujoarabe`.
**Base congelada:** V39; no se modificaron V39, V38 ni anteriores.
**HTML:** [IQ_COMMERCE_POS_MAESTRO_V40.html](./IQ_COMMERCE_POS_MAESTRO_V40.html)
**ZIP Android:** https://github.com/Iqneting/lujoarabe/archive/refs/heads/descarga-v40.zip

## Solicitud precisa

> «Que te dé la opción de confirmar el porcentaje por default 16%».

## Cambio puntual V40

- En **Ajustes → Configuración → IVA**, la tarjeta existente ahora abre un modal pequeño propio, sin controles de selección nativos.
- Dentro: interruptor **Activar IVA**; porcentaje precargado de **16 %**; controles `−` / `+` para modificar de uno en uno, entrada numérica visual también editable y botón **Confirmar porcentaje**.
- La tasa se guarda en `db.tax.ivaRate`, con valor predeterminado **16** para instalaciones nuevas y datos antiguos que aún no tengan `ivaRate`. Se mantiene `db.tax.ivaEnabled`. Al confirmar se guardan ambos campos mediante `save()` y se refleja el porcentaje y el estado en la tarjeta.
- Porcentajes permitidos en este simulador: 0 a 100, máximo dos decimales; input con `inputmode=decimal` pero sin el `type=number` nativo ni spinners del navegador.
- **Cancelar** o cerrar el modal no guarda cambios. Cuando falla almacenamiento, la configuración en memoria se revierte.
- El porcentaje solo es un parámetro guardado; no recalcula precios, impuestos ni históricos. Se deja pendiente decidir si los precios incorporan IVA y las reglas fiscales antes de implementarlo.

## Restricciones preservadas

- No cambiar el diseño ni los flujos de otras pantallas.
- No tocar menú, tarjetas de Pedidos, Devoluciones V35–V38, demás tarjetas de Ajustes, ni tienda pública.
- No agregar cálculos fiscales supuestos, tasas al producto, facturas, tickets o servicios reales.
- Sin despliegue ni fusión a `main`.

## Verificación

- Sintaxis JavaScript evaluada: dos bloques válidos.
- Se comprobaron anclas de versión y conservación del código V38/V37; fuente V40 confirmada por blob SHA `2f44716bf3f50e8c17d62c3bbcb3fc76c3665e6e`.
- **Pendiente QA en navegador:** confirmar valor por defecto, edición +/−, entrada manual y validación, cancelar sin guardar, persistencia tras recarga, vista en 360/390/430/1366 px. No dar por ejecutadas pruebas visuales no realizadas.
- Todo funciona en almacenamiento local de maqueta, no hay servidor de producción.
