# CONTINUIDAD — IQ Commerce POS Panel Maestro V32

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe` — rama de prototipos `lujoarabe`  
**Archivo:** [IQ_COMMERCE_POS_MAESTRO_V32.html](./IQ_COMMERCE_POS_MAESTRO_V32.html)  
**Base:** `IQ_COMMERCE_POS_MAESTRO_V31.html` (copia local descargable de la última versión, sin reescribir V31).  
**Producción/main:** sin cambios.

## Solicitud y alcance exacto

El usuario señaló la tarjeta «Apariencia» al final de la cuadrícula del módulo Inicio y pidió **«Quitar botón apariencia»**, luego confirmó **«Sí»**. Solo retirar ese botón de acceso rápido de Inicio; **no modificar nada más**.

## Cambios realizados

Una sola sustitución en el HTML (conservando literalmente todo el resto del archivo):

```diff
- const TILESET=[['productos','Productos'],['categorias','Categorías'],['inventario','Inventario'],['cupones','Cupones'],['pedidos','Pedidos'],['pagos','Pagos'],['entregas','Entregas'],['reportes','Reportes'],['apariencia','Apariencia']];
+ const TILESET=[['productos','Productos'],['categorias','Categorías'],['inventario','Inventario'],['cupones','Cupones'],['pedidos','Pedidos'],['pagos','Pagos'],['entregas','Entregas'],['reportes','Reportes']];
```

Se conserva el resto del código sin cambios, incluso la función/pantalla interna de Apariencia, porque en esta instrucción **solo se autorizó quitar el botón**, no borrar otras rutas o módulos. La cuadrícula visible tiene ahora ocho tarjetas en vez de nueve.

## QA

- JavaScript embebido validado con `node --check`.
- Prueba de UI en Chromium a 360×800, 390×844, 430×932 y 1366×768: **8 tarjetas**, sin Apariencia; 3 indicadores compactos y 1 dona en Inicio; botones Día/Semana/Mes/Año; navegación móvil Inicio, Productos, Pedidos, Clientes, Cupones y Contenido.
- Sin desbordamiento horizontal ni errores JavaScript; navegación a Cupones validada.
- No se alteran ventas, pedidos, productos, servicios, configuraciones ni publicaciones.

## Regla de continuidad

**No rediseñar Inicio**. Respetar exactamente el esquema visual V31, con gráfica y tarjetas compactas arriba y ocho accesos inferiores. No modificar `main`, `admin/`, `index.html` o producción sin autorización expresa. Cambios futuros exclusivamente por instrucción del usuario.
