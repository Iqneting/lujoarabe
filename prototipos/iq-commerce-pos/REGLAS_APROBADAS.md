# Reglas aprobadas — IQ Commerce POS

## 1. Identidad visual obligatoria
- Respetar estrictamente las pantallas de referencia autorizadas. **No sustituir por diseños genéricos** ni cambiar el 90 % ya aprobado.
- Diseño de impacto, premium, legible, sencillo y gráfico, con blancos, azules y colores pastel definidos. Colores contrastados, no chillantes; sin saturar.
- Tarjetas redondeadas, contornos claros, iconos grandes reconocibles, información jerarquizada. Preferir bloques visuales tipo POS.
- La **tarjeta universal de pedido V10** (cajas y lista/paquetería) es referencia obligatoria: no poner ilustraciones diferentes por mercancía ni centrar el panel en perfumes.
- En cada tarjeta de pedido mostrar identificación, estado, cliente, cantidad/entrega cuando exista, total, avance de Pago → Preparación → Envío y acciones Ver / Editar / Eliminar.
- La etiqueta de estado es **informativa**, nunca un botón que salte etapas accidentalmente.

## 2. Prohibiciones y ergonomía
- **Prohibidos** `<select>` nativos para navegación o selección; emplear tarjetas/pestañas/controles personalizados.
- **Prohibidos** `alert()`, `confirm()`, `prompt()` y ventanas de confirmación nativas; modales propios.
- **Prohibidos** los calendarios nativos: construir calendario interno si se necesita escoger fecha.
- Evitar desplazamiento horizontal **siempre**; minimizar vertical y evitar modales gigantes o elementos encimados. Mantener acciones accesibles.
- PC y móvil deben compartir **las mismas capacidades**; responsive cambia disposición, no las funciones.
- Minimizar escritura: controles visuales, estados, botones, switches, iconos, pasos fáciles y filtros visibles.
- Aplicar animaciones sobrias y específicas al guardar/editar/eliminar y una animación recurrente **discreta** en el seguimiento del modal; respetar `prefers-reduced-motion`.

## 3. Coherencia y acciones únicas
- Mismo lateral, estilo y opciones principales al cambiar de módulos; nada de un menú oscuro distinto.
- Pestañas y filtros de tipo Día/Semana/Mes/Año, Todos/Activos/etc. homologados en toda la plataforma, con colores suaves y selección clara.
- **Un solo botón de creación por pantalla**. No repetir Crear producto / Nueva categoría / Añadir contenido, etc.
- No repetir «Cerrar» cuando la X ya cierra el mismo modal; conservar «Cancelar», «Volver», «Guardar» o confirmaciones si hacen algo distinto.
- **Excepción aprobada:** conservar los accesos rápidos de **Inicio** aunque también haya enlaces laterales.
- En las tarjetas de pedidos, solo **Ver, Editar y Eliminar**; el avance operativa del pedido debe estar dentro de detalle, con confirmación.

## 4. Integridad
- No romper funcionalidades existentes ni reemplazar estructura aprobada sin nueva autorización.
- Los cambios visuales deben verificarse en **PC y móvil**; revisar diferentes anchos antes de dar por terminada la corrección.
- Mantener la tienda LUJO ÁRABE y su rama principal intactas hasta decidir integración.
- Esta V10 es una **maqueta local**, no backend seguro ni producción. Servicios externos pueden simularse de forma explícita, preparados para integrarse más adelante.
- Documento y maqueta independientes del producto comercial específico: el objetivo es poder utilizar el panel en otras tiendas de IQneting.

## 5. Un solo seguimiento para pedidos (V12)
- Tanto la tarjeta externa de Pedidos como el detalle interno muestran **exactamente cinco etapas**: **Pedido → Pago → Preparación → Envío → Entrega**.
- Los cinco nombres, iconos y estados (completado/actual/pendiente) provienen de la **misma función** de progreso, con idénticos colores: completado verde, actual azul y pendiente gris.
- Al actualizar el estado de un pedido, la lista y el modal se derivan del mismo registro; no hay un segundo cálculo de avance.
- Un pedido cancelado mantiene sus cinco etapas visuales inactivas y conserva su etiqueta Cancelado; no debe representarse como entregado.
- En móvil, cinco etapas deben caber sin scroll horizontal ni textos encimados; no alterar el resto de la tarjeta universal V10 ni el modal V11.
