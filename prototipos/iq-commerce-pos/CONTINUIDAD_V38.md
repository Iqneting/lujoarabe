# CONTINUIDAD — IQ Commerce POS Maestro V38

**Fecha:** 11 de noviembre de 2026
**Repositorio:** `Iqneting/lujoarabe`
**Rama de trabajo:** `lujoarabe`
**Base:** V37, preservada sin cambios.
**HTML:** [IQ_COMMERCE_POS_MAESTRO_V38.html](./IQ_COMMERCE_POS_MAESTRO_V38.html)
**ZIP autónomo Android (un único HTML):** https://github.com/Iqneting/lujoarabe/archive/refs/heads/descarga-v38.zip

## Solicitud

Además del acceso existente **Pedidos → Ver pedido → Productos → Devolver** por producto, permitir iniciar la devolución **desde el propio detalle del pedido** sin seleccionar previamente un artículo.

## Cambio V38 (alcance limitado)

- Solo en el modal **Pedidos → Ver**, dentro de la sección Productos, se añade un botón **Iniciar devolución** que conserva la apariencia de tarjetas, contornos y azul suave.
- Se muestra únicamente cuando el pedido no está cancelado, el pago está confirmado y existe al menos un artículo con unidades todavía disponibles para devolver.
- El botón reutiliza la acción existente `v35-from-order` y pasa el folio del pedido con `data-value=""`; el asistente V37 abre **Producto → Motivo → Confirmar**, con el pedido preseleccionado y **sin preseleccionar producto**.
- Permanecen los botones **Devolver** junto a cada producto, que abren el flujo con pedido y producto preseleccionados.
- La tarjeta externa de Pedidos conserva exclusivamente Ver, Editar y Eliminar. El acceso Devoluciones sigue dentro de Pedidos, no en navegación inferior.
- No cambia el resto de los módulos ni la lógica de seguimiento, estados, filtros o búsquedas de V37.

## Integridad y validación

- Se partió de la versión V37 cuyo blob Git era `0ed5422d6a4eaca4c524df11ab2ff239dd9dfa74`.
- Se insertó el botón mediante un único reemplazo de estructura en el modal de detalle y una regla CSS aislada `.v38-order-return-btn`; se comprobó la unicidad del ancla y la conservación del selector V37.
- HTML V38 confirmado en GitHub con blob SHA: `77f03d77f6c8a45c758ea462c78b49e6584f8231`.
- **Pendiente QA de ejecución**: abrir navegador móvil y PC para comprobar botones, preselección, disponibilidad según pedidos pagados/cancelados y generación de solicitud; esta verificación no se considera realizada por la inspección estática.

## Política

**Maqueta simulada con almacenamiento local.** Sin reembolsos reales. No modificar `main` ni publicar en producción. Conservar V37 y anteriores.
