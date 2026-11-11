# CONTINUIDAD — IQ Commerce POS V35

**Fecha:** 11 de noviembre de 2026  
**Repositorio:** `Iqneting/lujoarabe`  
**Rama de prototipos:** `lujoarabe`  
**HTML:** [IQ_COMMERCE_POS_MAESTRO_V35.html](./IQ_COMMERCE_POS_MAESTRO_V35.html)  
**ZIP directo Android:** https://github.com/Iqneting/lujoarabe/archive/refs/heads/descarga-v35.zip

## Motivo de V35

El usuario rechazó V34 porque la interfaz de devoluciones era **confusa** y **no se parecía al diseño de tres pantallas aprobado**: 1) lista de Devoluciones, 2) selección visual de producto/motivo, 3) seguimiento y resolución. Se reconstruyó **solo Devoluciones desde V33**, dejando los demás módulos y la cuadrícula de Inicio intactos.

## Reglas de navegación

- **No mover el botón «Devoluciones» que ya estaba en la barra de herramientas de Pedidos**. Se mantiene `data-route="devoluciones"` en el mismo lugar.
- **No agregar Devoluciones al menú inferior**. El menú móvil V33 con 6 accesos se conserva.
- En **Pedidos → Ver pedido → Productos**, junto a cada producto comprado con pago aprobado, botón discreto **«Devolver»**: abre el asistente con el pedido y producto preseleccionados.
- También se puede abrir el asistente con «Nueva devolución» desde la vista de Devoluciones.

## Pantallas V35

1. **Panel Devoluciones:** encabezado azul marino; 3 indicadores (pendientes, en proceso, resueltas), botón grande azul «Nueva devolución», búsqueda, filtros visibles, tarjetas horizontales con fotografía del producto, folio, pedido, estado y flecha. Tres casos de demostración iniciales, sembrados solo una vez por almacenamiento local.
2. **Solicitar devolución:** asistente visual **3 pasos** (Producto → Motivo → Confirmar), no formulario tradicional. Primero pedido pagado y producto de ese pedido; el selector de pedidos se compacta al elegir uno. Después motivo por tarjetas, cantidad +/- limitada a piezas disponibles y evidencia fotográfica opcional. Confirmación con resumen y **monto estimado**, no importe cobrado.
3. **Seguimiento:** tarjeta con producto/folio/estado; cinco etapas (Solicitada → En revisión → Recibida → Resolución → Cerrada), detalle, evidencia si la hay y selección visual de solución (Reembolso, Cambio, Crédito). Avance secuencial; rechazo conserva historial.

## Simulación y controles

- Los registros de devolución se guardan en la misma estructura `db.returns` / localStorage de la maqueta. Los casos de ejemplo no se regeneran cada vez que la lista queda vacía.
- No se permiten devoluciones de pedidos sin pago aprobado ni cantidades superiores a las compradas. Se descuentan las cantidades ya solicitadas en casos no rechazados.
- Resolver por crédito genera un cupón **de demostración** con el valor estimado; no envía dinero ni modifica inventario ni ejecuta cobros.
- Reembolso y cambio son estados administrativos simulados: **no están conectados a pagos ni logística real**.
- No se borra un caso rechazado: queda en su filtro e historial.
- Si se necesita procesar reembolsos reales, requerirá backend, métodos de pago, autorización, pruebas contables y política de devoluciones.

## Alcance / no tocar

- Base: V33 y su visual de Inicio procedente de V32. **No se copia la interfaz confusa V34.**
- Menú inferior, gráficas, Inicio, catálogo, contenido, cupones, clientes, ajustes, sesión demo y diseño global se mantienen.
- No modificar `main` ni publicar en producción sin instrucción del usuario.

## QA ejecutado

- `node --check` sobre JS principal: correcto.
- Chromium / Playwright: **360, 390, 430 y 1366 px**; Sin errores JS ni scroll horizontal.
- Validado: Inicio conserva 8 tarjetas + gráfica, botón de Devoluciones permanece en barra de Pedidos, 3 tarjetas de estado y 3 casos de ejemplo en vista, wizard de 3 pasos, selección de pedido/producto/motivo, alta de devolución, seguimiento con 5 etapas, avance hasta cerrar, selección crédito y generación de cupón simulado.
- La prueba usó un almacenamiento local de navegador simulado porque el sandbox de la herramienta restringe `localStorage` en `about:blank`. El código real sigue usando el `localStorage` del archivo, sin cambiar su contrato.

## Entrega sin problema de descarga interna

Para Android usar el ZIP de GitHub de la rama **descarga-v35**, que contiene **únicamente** el archivo HTML autónomo V35. Confirmado por árbol Git: exactamente un archivo, SHA blob `f2111b23c3b6eb68e320e02110a04e3713fa3295`, tamaño 1,446,253 bytes.

**Ruta de trabajo:** `prototipos/iq-commerce-pos/IQ_COMMERCE_POS_MAESTRO_V35.html`. No publicar prototipos al dominio principal salvo autorización explícita.
