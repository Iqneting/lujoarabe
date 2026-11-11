# CONTINUIDAD — IQ Commerce POS Panel Maestro V31

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe` · **rama:** `lujoarabe`  
**HTML:** [IQ_COMMERCE_POS_MAESTRO_V31.html](./IQ_COMMERCE_POS_MAESTRO_V31.html)  
**Base:** [IQ_COMMERCE_POS_MAESTRO_V30.html](./IQ_COMMERCE_POS_MAESTRO_V30.html) (preservar).

## Instrucción del usuario, confirmada con captura

**Quitar solamente las tres tarjetas grandes duplicadas de Inicio** que aparecían debajo de la gráfica, con los rótulos:
- Ventas registradas
- Por preparar
- Stock bajo

Estas **NO** son las tres tarjetas compactas del encabezado V30: las compactas deben permanecer visibles. También permanecen la gráfica de dona semanal, los cuatro filtros Día/Semana/Mes/Año, la cuadrícula original de accesos, el engrane, la barra móvil con Contenido y los demás módulos.

## Implementación mínima

Único cambio funcional en `home()`: retirar la llamada de renderizado `${stats()}` **después** del bloque `iq30-new-top`. La función `stats()` sigue existiendo y no fue reescrita. No se añadieron módulos, no se quitaron rutas, no se modificaron tarjetas inferiores ni se cambió la lógica de datos. Cambios adicionales limitados al identificador V31 y comentario de código.

## Pruebas

- Sintaxis JavaScript embebida: válida.
- Chromium a 360×800, 390×844, 430×932 y 1366×768: 0 tarjetas KPI grandes en Inicio, 3 KPI compactos, 1 gráfica circular, 4 filtros, 9 accesos de Inicio, 6 botones de navegación móvil; sin desbordamiento horizontal ni errores JavaScript observados.
- Navegación a Cupones comprobada en móvil.

**Estado:** HTML autónomo de prototipo, no producción. Aguardar revisión del usuario. **No tocar `main`, `admin/`, tienda pública ni versiones previas.**
