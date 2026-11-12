# CONTINUIDAD — IQ Commerce POS Maestro V39

**Fecha:** 11 de noviembre de 2026
**Repositorio:** `Iqneting/lujoarabe` · **rama:** `lujoarabe`
**Base:** V38 (sin modificar).
**HTML:** [IQ_COMMERCE_POS_MAESTRO_V39.html](./IQ_COMMERCE_POS_MAESTRO_V39.html)
**Descarga autónoma Android:** https://github.com/Iqneting/lujoarabe/archive/refs/heads/descarga-v39.zip

## Solicitud del usuario

> En una sección de configuración solamente poner un apartado de IVA para activar o desactivar.

## V39: Cambio exacto

- En **Ajustes → Configuración**, se agrega **únicamente** la sexta tarjeta visual **IVA**, con icono de porcentaje, estado Activado/Desactivado y un solo interruptor.
- El control es un botón `role="switch"` con `aria-checked`, operable en PC y móvil sin controles nativos ni formularios.
- Al tocar la tarjeta, cambia el estado y lo persiste en `db.tax.ivaEnabled` mediante `save()` (localStorage). Los datos V38 y anteriores se adaptan sin migración: si no existe `tax`, se considera `false`. En un estado nuevo, `tax.ivaEnabled=false`.
- Se muestran confirmación discreta y estado actualizado. Si falla almacenamiento local, se revierte el valor.
- Misma línea visual y cuadrícula ya aprobadas de **Ajustes**. Se conserva el resto de tarjetas, la sesión y todos los módulos.
- **Fuera de alcance:** cálculos de IVA, tasa fiscal, facturación/CFDI, subtotal, precios, ajustes a pedidos históricos. No se altera ninguna cifra ni se muestra una tasa inventada.

## QA y límites

- Inspección estática: se conservan el asistente de Devoluciones V37 y el botón de Pedidos V38; los cambios se limitaron a `settings()`, una acción, un valor de configuración, un icono y estilos CSS aislados.
- **Pendiente:** prueba real en navegador de encendido, apagado, recarga con persistencia y adaptación de 360, 390, 430 y 1366 px. No declarar el QA visual como realizado.
- HTML V39 SHA: `73fb5532b0e18427bbe5645d56c5aa5b580cffc0`.
- Solo **maqueta local**, no backend, no impuestos calculados ni producción. No se modifican `main` ni versiones anteriores.

## Próximo paso recomendado, sujeto a aprobación del usuario

Definir si activar IVA debe afectar precios y totales, si los precios actuales ya lo incluyen y cómo se maneja a nivel de pedido/CFDI **antes de implementar cálculo fiscal**.
