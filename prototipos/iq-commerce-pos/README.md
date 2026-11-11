# IQ Commerce POS — Panel Maestro universal

**Estado al 11 de noviembre de 2026:** versión autónoma **V12** con seguimiento de 5 etapas unificado en tarjeta y modal (V10 y V11 conservadas). Desarrollo visual iterativo; **no publicada en producción**.

## Archivos
- [IQ_COMMERCE_POS_MAESTRO_V10.html](./IQ_COMMERCE_POS_MAESTRO_V10.html): copia completa y autónoma del panel maestro V10, con recursos incrustados y datos de demostración locales.
- [IQ_COMMERCE_POS_MAESTRO_V11.html](./IQ_COMMERCE_POS_MAESTRO_V11.html): **maqueta de trabajo actual**, con el modal azul universal aprobado y ajustado para PC y móvil.
- [IQ_COMMERCE_POS_MAESTRO_V12.html](./IQ_COMMERCE_POS_MAESTRO_V12.html): maqueta actual; tarjetas externas y modal interno comparten **Pedido, Pago, Preparación, Envío y Entrega** con la misma fuente de datos, colores e iconos.
- [REGLAS_APROBADAS.md](./REGLAS_APROBADAS.md): restricciones UX/UI globales y decisiones autorizadas.
- [PENDIENTES_MODAL_PEDIDOS.md](./PENDIENTES_MODAL_PEDIDOS.md): historial del problema visual móvil, corrección V11 y pruebas.

## Alcance
Motor visual de administración **reutilizable para cualquier tipo de tienda**, no exclusivo de Lujo Árabe. La primera tienda de referencia es LUJO ÁRABE; productos y marcas dentro de la maqueta son ejemplos, no una restricción del software.

**Los pedidos, productos, pagos e inventario de esta copia son simulados.** LocalStorage no sustituye una base de datos real, autenticación ni integraciones de cobro. No se debe señalar esta copia como lista para operar ventas reales.

## Política de versiones
Conservar las pantallas aprobadas. Mantener V10 y V11 congeladas como referencia y continuar desde V12, sin modificar la tienda en producción. No reemplazar `admin/` ni `index.html` de la tienda, ni fusionar a `main` ni desplegar sin autorización.

## Resumen de continuidad
- V1–V4: panel visual base, navegación lateral homogénea y pestañas de filtros contrastadas.
- V5–V6: tarjetas y detalle de pedidos con Ver / Editar / Eliminar; avance dentro del modal, animación sutil recurrente.
- V7–V9: mejoras de color en detalles; eliminación de botones de creación duplicados; conservación de accesos rápidos de Inicio.
- V10: **tarjeta universal de Pedidos** con ilustración general de cajas, cliente, total, progreso gráfico y acciones administrativas. No depende del tipo de mercancía.
- V11 (11-nov-2026): **modal de Pedido integrado en HTML**, con cabecera azul de cajas universales, estado visual, cliente y total separados en móvil, seguimiento compacto, Productos y Pago visibles, acciones de Editar y Marcar enviado, animación de estado discreta. No cambia el flujo de pedidos ni otras pantallas.
- V12 (11-nov-2026): la tarjeta externa antes mostraba 3 etapas y el modal 5. Ahora ambas muestran 5 etapas y derivan avance y completado de una misma función; `cancelled` muestra las etapas desactivadas. Validado con Chromium en 360×800, 390×844, 430×932, 768×1024 y 1366×768: misma secuencia y estado en tarjeta/modal, sin errores JS ni desbordamiento horizontal.
- Validado con Chromium en 360×800, 390×844, 430×932, 768×1024 y 1366×768: sin desplazamiento horizontal ni colisión de cliente/total; cierre y entrada a Editar operativos. Pendiente la revisión final del usuario.

## Uso local
Abrir `IQ_COMMERCE_POS_MAESTRO_V12.html` en un navegador moderno. No requiere servidor para la demostración, pero el almacenamiento local depende del navegador y del origen utilizado.
