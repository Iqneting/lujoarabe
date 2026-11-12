# CONTINUIDAD — IQ Commerce POS Maestro V37

**Fecha:** 11 de noviembre de 2026  
**Repositorio:** Iqneting/lujoarabe · **rama:** `lujoarabe`  
**Base visual:** V36. **Archivo:** [IQ_COMMERCE_POS_MAESTRO_V37.html](./IQ_COMMERCE_POS_MAESTRO_V37.html)  
**Descarga ZIP para Android:** https://github.com/Iqneting/lujoarabe/archive/refs/heads/descarga-v37.zip

## Solicitud precisa del usuario

En el asistente **Solicitar devolución → paso 1 Producto → «Selecciona el pedido»**, el usuario mostró una captura y pidió: **agregar íconos de pedidos** para identificarlos visualmente y **un buscador dentro del bloque** para localizar fácilmente un pedido cuando existan muchos. No solicitó alterar otros módulos.

## Cambio V37 — solamente selector de pedidos

- Cada fila del selector usa el **ícono ilustrado de bolsa de compras**, la misma imagen que utiliza el Panel Maestro en Pedidos, en una tarjeta de contorno azul suave y bordes redondeados.
- Contenido de cada fila: etiqueta «PEDIDO» + folio, nombre del cliente, importe y fecha. Selección visual con radio/borde activo existentes.
- **Buscador interno con lupa** encima de la lista «Buscar por folio o cliente...», con conteo de resultados y estado sin coincidencias «No encontramos ese pedido». El control «Ver todos los pedidos» limpia la búsqueda.
- El filtro opera en tiempo real sin reconstruir la pantalla al escribir, manteniendo foco, posición del cursor y desplazamiento. Coincidencias parciales, sin distinguir mayúsculas o acentos.
- Lista limitada en altura **solo si hay muchos pedidos**; scroll interno vertical para evitar pantallas interminables.
- Si se llega desde **Pedidos → Ver → Devolver**, el pedido y el producto continúan preseleccionados; al tocar «Cambiar pedido» se muestra el selector con buscador.
- Los pasos **Motivo** y **Confirmar** conservan sus reglas y diseño V36. El botón de acceso Devoluciones permanece dentro del módulo Pedidos; ningún icono se agrega a la navegación inferior.

## QA local

- `node --check` para los 2 scripts JS: correcto.
- Playwright/Chromium a 360×800, 390×844, 430×932 y 1366×768: se muestran íconos en cada pedido, búsqueda por nombre, por folio, estado sin resultados, limpiar búsqueda, selección de pedido, selección de producto, recuperar la lista al tocar Cambiar pedido. **Sin errores JS ni desbordamiento horizontal.**
- Prueba adicional **Pedidos → Ver → Devolver**: pedido y producto preseleccionados; clic en Cambiar pedido muestra buscador, sin errores.
- Capturas: `V37_seleccionar_pedido_390.png` y correspondientes resoluciones.
- SHA Git verificado del HTML: `0ed5422d6a4eaca4c524df11ab2ff239dd9dfa74`.

## Invariantes / continuidad

- No se modifica Inicio, productos, cupones, clientes, contenido, ni los filtros POS de Devoluciones aprobados en V36.
- No se reubica el botón Devoluciones, ni se modifica el menú inferior.
- Es una **maqueta local** y no una operación de pagos real.
- No se modificó `main`, carpeta `admin/` ni producción. Mantener versiones anteriores como histórico.

