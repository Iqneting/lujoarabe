# CONTINUIDAD — IQ Commerce POS Panel Maestro — V27

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe`  
**Rama de prototipos:** `lujoarabe`; **no modificar `main` ni producción sin autorización**  
**HTML autónomo:** [IQ_COMMERCE_POS_MAESTRO_V27.html](./IQ_COMMERCE_POS_MAESTRO_V27.html)  
**Base preservada:** [V26](./IQ_COMMERCE_POS_MAESTRO_V26.html) · [Continuidad V26](./CONTINUIDAD_V26.md)

## Cambio autorizado

Sobre la captura de móvil de Cupones, el usuario aprobó solamente cambiar **la navegación**, no el diseño de los módulos:

1. Mostrar **Contenido** directamente como sexto botón en la barra inferior móvil: **Inicio · Productos · Pedidos · Clientes · Cupones · Contenido**.
2. Mover **Ajustes** (engrane) al extremo superior derecho del encabezado móvil.
3. Quitar el botón **Más** y su modal **Más módulos**, que solo contenía Contenido y Ajustes.
4. Mantener las tarjetas, filtros, búsquedas, modales, animaciones y lógicas de Cupones y del resto de los módulos. Navegación escritorio intacta; engrane lateral escritorio preservado.

## Implementación acotada

- Se cambió `mobileBar()` para enlazar directamente los seis destinos, con icono de imagen para Contenido y estado activo correcto.
- Se añadió `iq27SettingsGear()` al encabezado de las vistas y al encabezado de Inicio; solo se presenta en móvil, con `data-route="ajustes"` y atributo accesible.
- Se retiró el manejador del modal `mobile-more` por estar obsoleto.
- Se incorporó CSS `iq27-mobile-settings` para el engrane y las seis entradas compactas; el CTA existente de cada pantalla se preserva.
- Se dejaron sin cambios las lógicas de drag & drop flotante de V26 y el contenido de las demás pantallas.

## Validación realizada

- `node --check` de JavaScript embebido: sin errores de sintaxis.
- Prueba automatizada con Chromium en **360×800**, **390×844** y **1366×768**.
- En móvil se comprobó la secuencia de seis opciones, ausencia de «Más», clic real al engrane para entrar en Ajustes, clic a Contenido, estado activo del botón y mantenimiento del acceso a Cupones.
- En móvil se comprobó que el engrane no se solapa con «Crear cupón»; sin desplazamiento horizontal ni errores JS observados.
- En escritorio, el engrane específico para móvil está oculto y la navegación principal permanece.
- **Alcance:** pruebas de navegación y presentación en entorno local, no certificación visual exhaustiva ni backend real. No publicar en producción.

## Próximo paso

Revisar V27 descargada en Chrome Android/PC. Recoger solo observaciones concretas y crear V28 si fuera necesaria. No sobrescribir V27 ni versiones previas sin autorización.
