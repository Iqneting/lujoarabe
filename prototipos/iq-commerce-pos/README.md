# IQ Commerce POS — Panel Maestro universal

> **AVANCE ACTUAL — 11 nov 2026: V29 (prototipo).** [HTML V29](./IQ_COMMERCE_POS_MAESTRO_V29.html) · [Continuidad V29](./CONTINUIDAD_V29.md). Se retomó el diseño **V27** intacto para la zona de KPIs, filtros, tarjetas y navegación; se agregaron arriba la **dona de ventas** y el **Producto estrella**. Se retiró el encabezado alto y Apariencia según instrucciones previas. Meta semanal $10,000 **ilustrativa**, no real. V25–V28 preservadas. **No publicada en producción.**

> **AVANCE ACTUAL — 11 nov 2026: V28 (prototipo).** [Abrir V28](./IQ_COMMERCE_POS_MAESTRO_V28.html) · [Continuidad V28](./CONTINUIDAD_V28.md). Inicio con cabecera compacta, 3 indicadores, dona de ventas semanales y filtros de período; se elimina Apariencia. Conserva las demás pantallas V27 y no modifica producción. **La meta semanal por defecto es solo ilustrativa.**

> **AVANCE ACTUAL — 11 nov 2026: V27 (prototipo).** [Descargar V27](./IQ_COMMERCE_POS_MAESTRO_V27.html) · [Continuidad V27](./CONTINUIDAD_V27.md). En móvil, **Contenido** se muestra directamente en la barra inferior y **Ajustes** en el encabezado; se retiró «Más módulos». Cupones y el resto del diseño se conservaron. V26/V25 intactas. **No desplegada en producción.**

> **AVANCE ACTUAL — 11 nov 2026: V26 (prototipo).** [Descargar V26](./IQ_COMMERCE_POS_MAESTRO_V26.html) · [Continuidad V26](./CONTINUIDAD_V26.md). Animación visible de Drag & Drop, tarjeta flotante que sigue el dedo/mouse, hueco azul punteado, recolocación suave y desplazamiento automático en móvil. **V25 intacta. No publicada en producción.**

> **AVANCE ACTUAL — 11 nov 2026: V25 (prototipo)**. [Abrir maqueta autónoma V25](./IQ_COMMERCE_POS_MAESTRO_V25.html) · [Leer continuidad para siguiente hilo](./CONTINUIDAD_V25.md) · [Reglas de Contenido visual](./REGLAS_CONTENIDO_V25.md). Implementa Banners/Slider, Videos y Carruseles explicados visualmente, y ordenamiento Drag & Drop con 01 destacado. **No está desplegada en producción; validación de navegador pendiente.**


**Estado al 11 de noviembre de 2026:** versión autónoma **V13** con editor de productos optimizado (V10–V12 conservadas). Desarrollo visual iterativo; **no publicada en producción**.

## Archivos
- [IQ_COMMERCE_POS_MAESTRO_V10.html](./IQ_COMMERCE_POS_MAESTRO_V10.html): copia completa y autónoma del panel maestro V10, con recursos incrustados y datos de demostración locales.
- [IQ_COMMERCE_POS_MAESTRO_V11.html](./IQ_COMMERCE_POS_MAESTRO_V11.html): **maqueta de trabajo actual**, con el modal azul universal aprobado y ajustado para PC y móvil.
- [IQ_COMMERCE_POS_MAESTRO_V12.html](./IQ_COMMERCE_POS_MAESTRO_V12.html): maqueta actual; tarjetas externas y modal interno comparten **Pedido, Pago, Preparación, Envío y Entrega** con la misma fuente de datos, colores e iconos.
- [IQ_COMMERCE_POS_MAESTRO_V13.html](./IQ_COMMERCE_POS_MAESTRO_V13.html): versión actual, Crear/Editar producto visual con selección de categoría mediante iconos, fotografía explícita, carrusel y menos desplazamiento.
- [REGLAS_APROBADAS.md](./REGLAS_APROBADAS.md): restricciones UX/UI globales y decisiones autorizadas.
- [PENDIENTES_MODAL_PEDIDOS.md](./PENDIENTES_MODAL_PEDIDOS.md): historial del problema visual móvil, corrección V11 y pruebas.

## Alcance
Motor visual de administración **reutilizable para cualquier tipo de tienda**, no exclusivo de Lujo Árabe. La primera tienda de referencia es LUJO ÁRABE; productos y marcas dentro de la maqueta son ejemplos, no una restricción del software.

**Los pedidos, productos, pagos e inventario de esta copia son simulados.** LocalStorage no sustituye una base de datos real, autenticación ni integraciones de cobro. No se debe señalar esta copia como lista para operar ventas reales.

## Política de versiones
Conservar las pantallas aprobadas. Mantener V10, V11 y V12 como referencias y continuar desde V13, sin modificar la tienda en producción. No reemplazar `admin/` ni `index.html` de la tienda, ni fusionar a `main` ni desplegar sin autorización.

## Resumen de continuidad
- V1–V4: panel visual base, navegación lateral homogénea y pestañas de filtros contrastadas.
- V5–V6: tarjetas y detalle de pedidos con Ver / Editar / Eliminar; avance dentro del modal, animación sutil recurrente.
- V7–V9: mejoras de color en detalles; eliminación de botones de creación duplicados; conservación de accesos rápidos de Inicio.
- V10: **tarjeta universal de Pedidos** con ilustración general de cajas, cliente, total, progreso gráfico y acciones administrativas. No depende del tipo de mercancía.
- V11 (11-nov-2026): **modal de Pedido integrado en HTML**, con cabecera azul de cajas universales, estado visual, cliente y total separados en móvil, seguimiento compacto, Productos y Pago visibles, acciones de Editar y Marcar enviado, animación de estado discreta. No cambia el flujo de pedidos ni otras pantallas.
- V12 (11-nov-2026): la tarjeta externa antes mostraba 3 etapas y el modal 5. Ahora ambas muestran 5 etapas y derivan avance y completado de una misma función; `cancelled` muestra las etapas desactivadas. Validado con Chromium en 360×800, 390×844, 430×932, 768×1024 y 1366×768: misma secuencia y estado en tarjeta/modal, sin errores JS ni desbordamiento horizontal.
- V13 (11-nov-2026): Crear/Editar producto compacto, nombre genérico, sin imágenes de perfumes precargadas ni categoría asignada por defecto en productos nuevos, elección explícita de categoría con iconos, «Subir fotografías» y «Carrusel de imágenes» como dos controles visibles; descripción opcional plegable. En el modal de categorías se muestran todas las categorías activas en tarjetas de iconos. Probado en 360, 390 y 430 px, 768 y 1366 px: sin desbordamiento horizontal, seleccionar categoría y subir foto funcionales, guardar producto en almacenamiento de prueba.
- Validado con Chromium en 360×800, 390×844, 430×932, 768×1024 y 1366×768: sin desplazamiento horizontal ni colisión de cliente/total; cierre y entrada a Editar operativos. Pendiente la revisión final del usuario.

## Uso local
Abrir `IQ_COMMERCE_POS_MAESTRO_V13.html` en un navegador moderno. No requiere servidor para la demostración, pero el almacenamiento local depende del navegador y del origen utilizado.
