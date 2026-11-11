# IQ Commerce POS — Panel Maestro universal

**Estado al 11 de noviembre de 2026:** versión autónoma **V10** guardada como referencia de continuidad. Desarrollo visual iterativo; **no publicada en producción**.

## Archivos
- [IQ_COMMERCE_POS_MAESTRO_V10.html](./IQ_COMMERCE_POS_MAESTRO_V10.html): copia completa y autónoma del panel maestro V10, con recursos incrustados y datos de demostración locales.
- [REGLAS_APROBADAS.md](./REGLAS_APROBADAS.md): restricciones UX/UI globales y decisiones autorizadas.
- [PENDIENTES_MODAL_PEDIDOS.md](./PENDIENTES_MODAL_PEDIDOS.md): problema visual del modal en móvil y nueva propuesta pendiente de aprobación.

## Alcance
Motor visual de administración **reutilizable para cualquier tipo de tienda**, no exclusivo de Lujo Árabe. La primera tienda de referencia es LUJO ÁRABE; productos y marcas dentro de la maqueta son ejemplos, no una restricción del software.

**Los pedidos, productos, pagos e inventario de esta copia son simulados.** LocalStorage no sustituye una base de datos real, autenticación ni integraciones de cobro. No se debe señalar esta copia como lista para operar ventas reales.

## Política de versiones
Conservar las pantallas aprobadas. Trabajar sobre V10 mediante una V11 nueva tras validar una propuesta visual. No reemplazar `admin/` ni `index.html` de la tienda, ni fusionar a `main` ni desplegar sin autorización.

## Resumen de continuidad
- V1–V4: panel visual base, navegación lateral homogénea y pestañas de filtros contrastadas.
- V5–V6: tarjetas y detalle de pedidos con Ver / Editar / Eliminar; avance dentro del modal, animación sutil recurrente.
- V7–V9: mejoras de color en detalles; eliminación de botones de creación duplicados; conservación de accesos rápidos de Inicio.
- V10: **tarjeta universal de Pedidos** con ilustración general de cajas, cliente, total, progreso gráfico y acciones administrativas. No depende del tipo de mercancía.
- **Siguiente tarea visual pendiente:** corregir el modal móvil de pedido (nombre cortado, total encima del cliente y exceso de altura). La propuesta gráfica no constituye aún código aprobado.

## Uso local
Abrir `IQ_COMMERCE_POS_MAESTRO_V10.html` en un navegador moderno. No requiere servidor para la demostración, pero el almacenamiento local depende del navegador y del origen utilizado.
