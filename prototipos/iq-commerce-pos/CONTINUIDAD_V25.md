# CONTINUIDAD — IQ Commerce POS Panel Maestro — V25

**Última actualización:** 2026-11-11
**Repositorio:** `Iqneting/lujoarabe`
**Rama de prototipos:** `lujoarabe` — **no modificar `main` ni producción sin instrucción explícita**
**Maqueta autónoma actual:** [IQ_COMMERCE_POS_MAESTRO_V25.html](./IQ_COMMERCE_POS_MAESTRO_V25.html)
**Estado:** implementación de V25 guardada en GitHub; pendiente de revisión visual final del usuario en PC y móvil. No publicar en producción.

## Cómo retomar en un nuevo hilo

Solicitud sugerida: **«Conéctate a IQ Commerce POS en GitHub, repositorio Iqneting/lujoarabe, rama lujoarabe. Lee prototipos/iq-commerce-pos/CONTINUIDAD_V25.md y continúa desde V25 respetando todas las reglas aprobadas.»**

Tomar **V25 como base de trabajo**, preservar el HTML anterior y generar V26 incremental. No reconstruir módulos ajenos al solicitado. El panel es un **template universal multi-tienda**; Lujo Árabe es solo la tienda de ejemplo, no el límite del producto.

## Decisiones visuales NO negociables

1. Conservar fielmente la línea visual de la V24/V25 aprobada: fondo claro, lateral claro, tarjetas redondeadas blancas con contorno contrastado, azul corporativo e iconos visuales, tipografía legible, botones verdes de guardado, rojos de eliminar/cancelación, azules de ver/editar.
2. No inventar diseños genéricos, elementos neón, formularios nativos, selectores o calendarios nativos; nada de 3D excesivo. NO mezclar estilos ni tocar visualmente pantallas no solicitadas.
3. Minimizar scroll innecesario a zoom 100%, sin desbordamiento horizontal; PC y móvil con la misma funcionalidad, pero composición adaptada.
4. Mantener navegación del Panel Maestro: Inicio, Productos (pestañas Catálogo / Inventario), Pedidos, Clientes, Cupones, Contenido. Ajustes como engrane junto a Mi Tienda. Móvil con sección Más. Retroceso coherente.
5. Separar diseños aprobados y datos reales: las vistas previas nunca deben fingir publicaciones ni operaciones confirmadas; las claves SMTP/Stripe jamás quedan almacenadas en el HTML/localStorage.
6. Respetar modales y tarjetas premium de Pedidos, Clientes, Cupones, Ajustes/SMTP ya construidos en V23–V24.

## V25 — módulo Contenido visual: implementado

Tres pestañas con explicación visual **«¿Qué controla?»** y una pequeña vista aproximada del escaparate:
- **Banners / Slider:** controla imágenes de portada. Crear/editar título, subir imagen JPG/PNG/WEBP, enlace de destino HTTPS opcional, publicación/ocultamiento, vista previa local. La primera posición (01) destaca con etiqueta «Primero en aparecer».
- **Videos:** material audiovisual de promociones y novedades. Puede usar video MP4/WEBM de muestra de hasta **650 KB** embebido en localStorage, o URL válida de YouTube/Vimeo mediante iframe de dominio permitido. Este límite aplica SOLO a la maqueta local.
- **Carruseles de productos:** grupos visuales seleccionados **desde los productos existentes del catálogo**, sin necesidad de inventar imágenes. Pueden elegir varios productos, quitarlos y **reordenarlos con drag & drop dentro del carrusel**.

### Reordenamiento global Drag & Drop

- En cada pestaña se muestran filas con asa de puntos, miniatura, título, estado, acciones **Ver / Editar / Eliminar**, control visual de publicación y número **01, 02, 03**.
- **01**: insignia azul con corona y texto «Primero en aparecer» cuando esté activo.
- **PC:** arrastrar el asa con el mouse. **Móvil:** mantener presionada el asa con el dedo y arrastrar. Los números se actualizan al mover; el nuevo orden se guarda en localStorage al soltar (por tipo).
- En Carruseles también se puede ordenar por arrastre la secuencia de productos seleccionados en el editor.
- Controles de orden con flechas +/- anteriores fueron retirados del módulo Contenido. El asa también responde a flechas del teclado para accesibilidad.
- Activar/desactivar no elimina contenido y los elementos ocultos conservan su posición, aunque no aparecen en la primera vista publicada.
- Evitar *datos demostrativos falsos*: el estado inicial trae **un banner de ejemplo existente**; Videos y Carruseles parten vacíos hasta que se agreguen.

## Implementación / límites técnicos

- Un solo archivo HTML completo y autónomo, con activos embebidos (aprox. 1.39 MB). Se basa en **V24** sin afectar otras rutas.
- Datos simulados: localStorage `iqcommerce_maestro_fiel_v1`. Ningún backend ni tienda pública conectados. Las vistas previas son aproximadas y están etiquetadas como demo.
- Código V25 contiene funciones `iq25*`, `contentPage`, `contentEditor`, `contentEditorRender`, `iq25SaveContent` y eventos de Pointer Events. Modificación acotada a las acciones `content-*` del módulo y CSS `.iq25-*`.
- Al subir la imagen del banner se conserva el borrador y aparece vista previa inmediata. No se guardan claves Stripe/SMTP en localStorage (regla V24).
- Validación realizada al generar: `node --check` sin errores. **La prueba automatizada visual/funcional de navegador no pudo ejecutarse por la política del navegador de este entorno (ERR_BLOCKED_BY_ADMINISTRATOR).** No declarar validación visual final hasta probar en Chrome/Android y Windows.
- Los contenidos se reordenan solo en su categoría, no mezclados entre Banner, Video y Carrusel.
- El editor Video admite solamente URLs externas HTTPS de YouTube/Vimeo; no permitir iframe arbitrario.

## Cronología y versiones

- V10–V13 almacenadas en este repositorio; preservar congeladas.
- V14–V24 creadas de forma incremental durante el hilo de diseño. La **V24 fue base local de V25**. Este repositorio queda ahora actualizado con el **HTML autónomo íntegro V25**.
- V21: menú lateral y Productos/Inventario unificados.
- V22: tarjetas premium de Clientes y Cupones (Ver/Editar/Eliminar).
- V23: modales premium de Cliente y Cupón; Cliente con nombre + correo obligatorios y teléfono opcional.
- V24: Ajustes simplificados: nombre/logotipo; Transferencia; Stripe demo; SMTP estándar; IQ Motion; Operadores. Envío y pagos reales requieren backend.
- V25: Contenido visual explicado, tabs, editores por tipo, vista previa y ordenamiento Drag & Drop PC/móvil.

## Pendientes inmediatos

1. Abrir V25 desde el archivo descargado o GitHub y revisar las tres vistas de Contenido y sus modales en **PC 1366×768 / móvil 390×844**; comprobar si existe desbordamiento o un control difícil de tocar.
2. Validar con contenido creado por el usuario el orden 01 → 02, recarga/reingreso y permanencia del orden; comprobar que reordenar dentro de Carruseles preserva su secuencia.
3. Aprobación visual explícita del usuario antes de avanzar. Modificar únicamente hallazgos, nunca reinventar toda la maqueta.
4. Back-end de publicación real pendiente: API, almacenamiento de imagen/video, entidades banners/videos/carruseles, orden + estado, autenticación y vinculación a la tienda pública. No simular envío real o pagos realizados.
5. Mantener todos los demás módulos tal como están salvo orden explícita.

**Comandos:** abrir [IQ_COMMERCE_POS_MAESTRO_V25.html](./IQ_COMMERCE_POS_MAESTRO_V25.html) en navegador; al hacer V26 usarlo de fuente y subir otro archivo, no sobrescribir V25.
