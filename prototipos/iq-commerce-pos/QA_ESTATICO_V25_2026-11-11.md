# Revisión estática de continuidad — IQ Commerce POS V25

**Fecha:** 2026-11-11  
**Repositorio:** `Iqneting/lujoarabe` · rama `lujoarabe`  
**Base revisada:** `prototipos/iq-commerce-pos/IQ_COMMERCE_POS_MAESTRO_V25.html` · blob `678507b5b3c687be897ed5b58ecb12bfda791911`

## Alcance y resultado

Revisión **estática del archivo existente** para preparar la validación visual pendiente. No se modificó el HTML ni se creó V26. No es un pase de QA visual ni prueba end-to-end.

| Comprobación | Resultado |
| --- | --- |
| Archivo V25 íntegro recuperado del blob de GitHub | Sí; 1,391,384 caracteres |
| Sintaxis de JavaScript embebido | Analizada con parser JS sin errores de sintaxis |
| Pestañas de Banners/Slider, Videos y Carruseles | Presentes en el código |
| Lista de elementos con posición, acciones y switch | Presente |
| Editor de contenido y guardado | Presentes |
| Manejo de arrastre mediante Pointer Events | `pointerdown`, `pointermove`, `pointerup` y `pointercancel` presentes |
| Persistencia del orden | Llamada a `save()` tras soltar un elemento |
| Orden de productos seleccionados | Gestión de lista dentro del editor |
| URL de video externa | `iq25VideoEmbed` acepta YouTube/Vimeo por HTTPS con host permitido |
| `<select>` nativos | 0 encontrados |
| `alert()`, `confirm()` o `prompt()` nativos | 0 llamadas encontradas |
| Calendario mediante `input type="date"` | 0 encontrados |
| CSS responsivo | Existen reglas `@media`; efectividad visual no verificada |

### Comportamientos para validar manualmente en Chrome

1. PC 1366×768: apertura de Contenido; tres pestañas; visualización de imágenes y texto explicativo; ausencia de scroll horizontal y solapes.
2. Móvil 390×844: asa accesible al tacto, orden 01→02, botones Ver/Editar/Eliminar/switch accesibles, modales sin recortes.
3. Soltar y recargar: posición persistida por tipo de contenido; no mezclar banners, videos y carruseles.
4. Dentro del carrusel: arrastrar productos, guardar, volver a editar y comprobar misma secuencia.
5. Caso límite: ocultar la posición 01 y verificar claridad de la vista previa del primer elemento **publicado** (puede ser la posición 02, por diseño).
6. Verificar al cargar imágenes que el borrador no se pierda y que el tamaño de localStorage no provoque fallo de guardado.
7. Confirmar que video externo funciona con las políticas de iframe en un navegador real.
8. Validar los modales en PC y móvil sin alterar el resto de las pantallas aprobadas.

## Reglas para el siguiente paso

- V25 queda como referencia congelada hasta aprobación visual explícita.
- Si hay hallazgos, corregir **solo** los confirmados en una copia `IQ_COMMERCE_POS_MAESTRO_V26.html`; no reescribir lo aprobado.
- No modificar `main`, `admin/`, `index.html` ni desplegar producción.
- No confundir maqueta local/localStorage con publicación real ni backend operativo.

**Estado:** inspección estática completada, validación visual/manual sigue pendiente; no se declara V25 aprobada.
