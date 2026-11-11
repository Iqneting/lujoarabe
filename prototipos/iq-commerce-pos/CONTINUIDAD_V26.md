# CONTINUIDAD — IQ Commerce POS Panel Maestro — V26

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe` · rama `lujoarabe`  
**HTML autónomo:** [IQ_COMMERCE_POS_MAESTRO_V26.html](./IQ_COMMERCE_POS_MAESTRO_V26.html)  
**Base intacta:** [V25](./IQ_COMMERCE_POS_MAESTRO_V25.html)  
**Estado:** versión de revisión visual; **no desplegada en producción**.

## Cambio solicitado a partir de la captura de móvil
El usuario solicitó que **se vea la tarjeta moverse al arrastrarla** desde el asa de puntos de Banners / Slider, sin modificar el diseño aprobado del módulo. Esta mejora también se aplica a Videos, Carruseles y al orden de productos dentro de cada carrusel.

## V26 — Interacción de arrastre animada
- Tarjeta flotante fiel a su contenido, con sombra y elevación leve; sigue el dedo o mouse.
- Etiqueta azul «MOVIENDO» en la tarjeta flotante.
- El hueco de destino se distingue con borde azul punteado y leyenda «SUELTA AQUÍ».
- Las tarjetas vecinas se desplazan suavemente al cambiar la posición.
- Al soltar, la tarjeta vuelve animada a su posición y se actualiza el orden.
- En móvil, si el dedo se mantiene cerca del borde inferior/superior, la lista se desplaza automáticamente para alcanzar tarjetas fuera de pantalla.
- Persiste el reordenamiento en el almacenamiento local de la maqueta; no hay publicación al escaparate real.
- Se conserva el reordenamiento por flechas de teclado para accesibilidad; respeta `prefers-reduced-motion`.

## Pruebas del archivo V26
- JavaScript de los scripts embebidos: comprobación con `node --check`, sin errores.
- Pruebas automatizadas en Chromium de contenido inyectado (`page.set_content`) con **dos banners de prueba solo en memoria**, en 390×844 y 1366×768.
- Se verificó que aparece la tarjeta flotante, que aparece el hueco de inserción, que cambia el orden, que desaparece la tarjeta flotante al soltar y que `save()` serializa el nuevo orden en un simulador de localStorage.
- Sin desbordamiento horizontal ni errores de JavaScript observados en dichas pruebas.
- **Limitación:** la navegación directa a `file://` y `localhost` desde el navegador de pruebas está restringida por `ERR_BLOCKED_BY_ADMINISTRATOR`; por tanto, falta revisión visual final en Chrome real de Android y Windows.
- No se probaron backend, pagos, SMTP o despliegue de tienda pública: esta versión sigue siendo una maqueta autónoma.

## Reglas que permanecen
Conservar todas las reglas en [CONTINUIDAD_V25.md](./CONTINUIDAD_V25.md), [REGLAS_APROBADAS.md](./REGLAS_APROBADAS.md) y [REGLAS_CONTENIDO_V25.md](./REGLAS_CONTENIDO_V25.md).
No tocar `main`, `admin/`, `index.html` ni producción sin instrucción expresa. No introducir formularios, diálogos o calendarios nativos. Mantener el panel universal multit ienda y la misma funcionalidad en PC y móvil.

## Próximo paso
El usuario debe revisar el efecto de arrastre en Android y PC. Ajustar solo observaciones concretas en una nueva copia V27 y mantener V25/V26 congeladas como referencias de continuidad.
