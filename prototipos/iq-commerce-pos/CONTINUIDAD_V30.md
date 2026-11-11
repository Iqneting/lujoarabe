# CONTINUIDAD — IQ Commerce POS Panel Maestro V30

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe` · **rama:** `lujoarabe`  
**HTML autónomo:** [IQ_COMMERCE_POS_MAESTRO_V30.html](./IQ_COMMERCE_POS_MAESTRO_V30.html)  
**Base visual:** [V27](./IQ_COMMERCE_POS_MAESTRO_V27.html) **sin reconstruir sobre V28 ni V29**.  
**Estado:** prototipo local, no desplegado en producción.

## Instrucción confirmada por el usuario

Modificar **únicamente la parte alta de Inicio**, sustituyendo el encabezado extenso «Tu tienda, en un vistazo» por:
1. Encabezado compacto «Inicio» con los accesos existentes de campanita, IQ y engrane.
2. **Tres tarjetas compactas en horizontal** para ventas registradas, por preparar y stock bajo.
3. **Una gráfica circular y ancha** para ventas semanales y avance hacia meta, comprensible a primera vista.

**Dejar íntegramente debajo de esta zona el esquema V27**, sin rediseñar, mover ni eliminar:
- Las tres tarjetas originales GRANDES, apiladas en móvil, de Ventas registradas / Por preparar / Stock bajo.
- El selector existente Día / Semana / Mes / Año, sin cambiar su funcionamiento.
- La cuadrícula de tarjetas de accesos y la navegación inferior de seis módulos.
- El resto de las pantallas, modales, animaciones de arrastre y funciones de la aplicación.

No crear ni añadir bloque de «Producto estrella» en V30; fue descartado de la confirmación final. La antigua instrucción de eliminar «Apariencia» NO se ejecuta en esta rama de cambio, porque la orden más reciente pide conservar el resto de V27 intacto. No tocar otros elementos.

## Implementación

- El HTML V30 se creó como copia independiente de **V27**.
- La única función de vista sustituida fue `home()`; se añadieron `iq30WeekSales()`, `iq30UpperIndicators()` e `iq30SalesChart()` como auxiliares.
- `stats()`, `periodTabs()`, `tiles()` y demás módulos permanecen textualmente idénticos a los de V27.
- CSS nuevo aislado bajo prefijo `iq30-`; no cambia el CSS original de las tarjetas grandes ni de los filtros.
- La gráfica suma pedidos con pago registrado como `paid`, no cancelados, con fecha correspondiente a la semana actual.
- Si no existe `db.store.weeklyGoal` positivo, se muestra una **meta de ejemplo de $10,000** rotulada explícitamente como demostrativa. No se presenta como una meta real de la tienda.
- **Las tarjetas compactas no sustituyen a las originales**: ambas quedan visibles, según aprobación explícita del usuario.

## Verificación

- JavaScript embebido: verificación sintáctica por `node --check` satisfactoria.
- Chrome/Chromium local vía `page.set_content()` (el entorno no permite navegar directamente a archivos locales) probado a 360×800, 390×844, 430×932 y 1366×768.
- Sin errores JavaScript ni desbordamiento horizontal.
- Tres indicadores compactos, gráfica circular, **tres tarjetas originales grandes**, cuatro filtros y nueve accesos originales presentes.
- La barra de móvil conserva Inicio / Productos / Pedidos / Clientes / Cupones / Contenido.
- Cupones abre correctamente en los tamaños móviles probados.
- Falta aprobación visual final sobre Android físico y datos reales.

## Continuación

Tomar V30 como referencia para corregir solo observaciones de las gráficas superiores. Mantener V25–V29 congeladas. **No publicar en `main`, no modificar `admin/` ni tienda pública sin autorización explícita.**
