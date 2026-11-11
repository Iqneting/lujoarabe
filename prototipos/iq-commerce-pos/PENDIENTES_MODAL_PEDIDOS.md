# Pendiente visual — Modal de pedido móvil

**Estado:** propuesta visual creada, **NO implementada ni aprobada como código** al 11-nov-2026.

## Evidencia del fallo
Captura compartida por el usuario del modal «Pedido LA-00121» en móvil:
- El bloque de **Total del pedido** invade el espacio de **Cliente**; «Andrea Martínez» y la fecha quedan cortados/angostos.
- El modal ocupa casi toda la pantalla y el contenido está demasiado espaciado; hay desplazamiento vertical excesivo.
- El footer con **Editar** / **Marcar enviado** queda pegado a la parte baja del teléfono, sobre la interfaz de navegación, con poco margen de seguridad.
- Los bloques de seguimiento, Productos y Pago pueden ganar claridad gráfica sin sacrificar legibilidad.

## Propuesta por validar
1. Encabezado azul universal de pedido (icono de paquete, número de orden y estado visual), sin imágenes de perfumes.
2. Bloque de cliente **sin truncamiento**. En móvil estrecho, colocar cliente y total **en filas separadas** o usar grid responsivo con anchuras que no colisionen; el total nunca debe tapar el nombre.
3. Seguimiento tipo línea visual en cinco etapas (Pedido, Pago, Preparación, Envío, Entrega), estado activo distinguible y animación sutil opcional; no permitir saltos de etapa desde la tarjeta de listado.
4. Productos y estado de pago en secciones compactas, con iconografía de alto contraste, no listas de texto extensas.
5. Acciones de pie visibles, con áreas táctiles suficientes y espacio de `safe-area-inset-bottom`; scroll solo dentro del cuerpo del modal si la altura no alcanza.
6. No crear selectores, modales ni calendarios nativos; conservar operaciones y confirmaciones.
7. No confundir propuesta visual con funcionalidades de backend real: pantalla basada en datos de demostración.

## Validación mínima pendiente
- Escritorio: 1440 × 900, 1366 × 768.
- Tableta: 768 × 1024.
- Móvil: 360 × 800, 390 × 844 y 430 × 932.
- Sin desplazamiento horizontal, ningún elemento encimado, encabezado y acciones accesibles; cliente y total completamente legibles.
- Verificar Ver, Editar, Eliminar, comprobante, avance por etapas y cierre sin pérdida de contexto.
- Comparar capturas HTML **contra la propuesta aprobada** antes de homologar a todos los modales.
