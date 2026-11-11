# CONTINUIDAD — IQ Commerce POS Panel Maestro V29

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe` · **rama:** `lujoarabe`  
**Archivo de trabajo:** [IQ_COMMERCE_POS_MAESTRO_V29.html](./IQ_COMMERCE_POS_MAESTRO_V29.html)  
**Base visual conservada:** [IQ_COMMERCE_POS_MAESTRO_V27.html](./IQ_COMMERCE_POS_MAESTRO_V27.html), NO reconstruir sobre V28.  
**Estado:** maqueta autónoma HTML, revisión visual pendiente del usuario. **No desplegar ni modificar `main` / `admin/` / tienda pública.**

## Instrucción final y referencia aprobada

El usuario corrigió V28: **conservar el esquema completo de Inicio de V27** tal como aparece en su captura real de Android. Solo sustituir el encabezado alto («Tu tienda, en un vistazo» y subtítulo) por el título pequeño «Inicio» y **colocar ARRIBA** las dos visualizaciones ya autorizadas:
1. **Gráfica circular** de ventas semanales y avance de meta, ancha y legible.
2. **Producto estrella**, tarjeta horizontal con fotografía real del producto del catálogo, #1, unidades vendidas y una barra de participación.

**Debajo de ambas gráficas, preservar sin modificaciones de estructura/CSS original de V27**: tres tarjetas grandes apiladas en móvil («Ventas registradas», «Por preparar», «Stock bajo»), filtro Día/Semana/Mes/Año, cuadrícula de accesos, barra inferior Inicio/Productos/Pedidos/Clientes/Cupones/Contenido y engrane en esquina superior. No compactar ni reorganizar esas piezas.

Continúa vigente una instrucción anterior expresamente aprobada: eliminar tarjeta y pantalla «Apariencia» redundantes.

## Implementación V29

- Se partió **directamente del HTML autónomo V27** para evitar que las modificaciones no solicitadas de V28 afectaran el layout.
- Se reemplazó solo la función `home()` para insertar dos secciones visuales antes de `stats()`; las llamadas a `stats()`, `periodTabs()` y `tiles()` se conservan.
- Nuevas funciones `iq29WeekOrders`, `iq29VisualData`, `iq29SalesPanel` e `iq29StarPanel`.
- La dona mide ventas semanales de pedidos pagados no cancelados, excluyendo fechas inválidas.
- Si no está configurada una meta real positiva en `db.store.weeklyGoal`, muestra **$10,000 como meta de EJEMPLO**, visiblemente identificada como ilustrativa; **no confundir con una meta del cliente**.
- El producto #1 se calcula por **unidades vendidas**, a partir de items de pedidos pagados de la semana. La barra representa porcentaje de unidades; no se inventan ingresos atribuibles por producto. Ejemplo inicial: Khamrah Dukhan (2 unidades / 5 = 40%).
- Se usa fotografía asociada al producto existente. Estado vacío explícito cuando no hay ventas elegibles.
- No se cambiaron datos de ejemplo, operaciones, funciones de pago, navegación, Contenido, drag & drop, editor, modales, ni el resto de los módulos.
- Se eliminó Apariencia (tarjeta y ruta redundante) según instrucción anterior.
- Nuevos estilos solo para elementos `.iq29-*`, más selectores acotados a `.iq29-home`. Gráficas horizontales, adaptadas a PC/móvil.

## Comprobación realizada

- Sintaxis de JavaScript embebido: `node --check`, sin errores.
- Chromium con `set_content` (la navegación directa a `file://` está bloqueada en este entorno) a **360×800, 390×844, 430×932 y 1366×768**.
- Dos paneles presentes, sin desbordamiento horizontal ni errores JS; encabezado compacto; producto estrella derivado de órdenes.
- Las **tres etiquetas de KPI**, los **cuatro filtros** y las **seis entradas de la barra móvil** coinciden con V27. Cupones abrió correctamente en los tres anchos móviles.
- No se declara prueba de backend, operación real, publicación a producción ni validación definitiva en dispositivo físico.

## Siguiente paso

Descargar V29, abrirla en Chrome/Android, validar apariencia. Si hay ajustes, hacerlo como V30 incremental, preservando V27/V28/V29 y documentación.
