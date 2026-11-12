# Auditoría de integración local V41 — IQ Commerce POS / Lujo Árabe

**Fecha:** 11 de noviembre de 2026 (CDMX).
**Rama:** lujoarabe, NO main. **Referencia visual preservada:** V40.
**Dictamen:** integración local principal probada; apta para preparar migración al backend bajo el contrato aquí fijado, NO apta para producción directa ni garantiza ausencia universal de defectos.

## Pruebas verificadas

- Prueba E2E principal: https://github.com/Iqneting/lujoarabe/actions/runs/43143964457 — PASS.
- Prueba E2E ampliada, incluidos módulos de cupón/banco/contenido: https://github.com/Iqneting/lujoarabe/actions/runs/43147279942 — PASS.
- Tienda integrada /tienda-integrada/ y Panel Maestro V41 usan mismo origen HTTP(S), mismo almacenamiento iqcommerce_integracion_local_v1.
- La compra genera registro en Pedidos, con cliente, artículo exacto, cantidad, precio original, envío y total.
- La reserva disminuye stock DISPONIBLE sin alterar stock físico. Segunda compra sin disponibilidad se bloquea.
- Comprobante de ejemplo -> revisión -> aprobación manual -> movimiento de stock físico una sola vez; NO equivale a validar banco real.
- Envío exige pago, registra guía; entrega exige envío.
- Devolución enlazada a línea original con precio histórico, máximo de unidades y resolución documentada; NO transfiere dinero real.
- Pedido cancelado libera reserva; eliminación de pagados y devoluciones está protegida.
- Categorías, cupones, banco, contenido y ajustes se reflejan desde almacenamiento compartido.
- IVA activo sin especificar precio incluido/agregado bloquea nuevas compras para evitar cálculo fiscal inventado.
- Recarga y sincronización entre pestañas y revisión de 390 px sin desbordamiento horizontal.
- Prueba adicional: abrir primero el Panel Maestro y después la tienda; completa catálogo, crea pedido visible en ambos y reserva stock. PASS en GitHub Actions citado arriba.

## Fuente única de datos en el simulador

- Módulo de negocio: shared/iq-commerce-local-bridge.js
- Maestro V41: prototipos/iq-commerce-pos/IQ_COMMERCE_POS_MAESTRO_V41.html
- Tienda integrada: tienda-integrada/index.html y tienda-integrada/app.js
- Pruebas: tests/local-domain.test.cjs, tests/integrated-demo.e2e.cjs, tests/panel-first.e2e.cjs

La tienda raíz index.html sigue siendo la versión antigua y NO está conectada con V41. Solo la ruta /tienda-integrada/ usa el motor local compartido. El almacenamiento local NO garantiza transacciones atómicas multicliente, autenticación ni anticorrupción frente a pestañas simultáneas: eso requiere backend.

## Incidencias V40 abordadas en V41

| Inconsistencia | V41 |
|---|---|
| Tienda y panel tenían datos separados | Almacén compartido bajo el mismo origen |
| Catálogo y existencias diferentes | Catálogo de tienda derivado de productos compartidos |
| Pedido manual sin productos | Flujo POS con producto, cantidad, cliente y reserva |
| Inventario sin movimientos | Historial y reservas verificadas |
| Confirmaciones de pago incorrectas | Solo desde comprobante en revisión |
| Envío sin requisito de pago | Solo pedido pagado y preparado |
| Devolución por promedio del pedido | Precio original por línea, no incluir costo de envío |
| Eliminación de pedido pagado | Historial protegido |
| Cupones sin trazabilidad | Descuento y registro de uso por pedido |

## Límites y pendientes ANTES de producción

1. Los pedidos heredados de V40 pueden estar marcados como legacy porque carecen de SKU/precio original por línea: no importar como ventas reales ni inventar importes.
2. Los IDs de demostración deben mapearse a claves numéricas en MariaDB, preservando referencia pública, producto, línea y sus eventos.
3. Fotos y vídeos conceptuales no deben importarse como catálogo definitivo; los archivos reales se almacenarán con validación segura.
4. NO se ha auditado exhaustivamente cada modal ni toda combinación de resoluciones, cupones, impuestos y concurrencia entre múltiples clientes.
5. Autenticación real, CSRF, sesiones, roles, servidor de archivos privados, idempotencia, transacciones y validación de bancos/pasarelas aún NO están implementados para escritura.
6. La V41 por sí sola no es un sistema apto para cobrar ni multiusuario; los archivos HTML originales V40 permanecen congelados.
7. La tienda integrada es distinta de la tienda raíz; conectar producción requiere una decisión de despliegue posterior.

## Migración MariaDB

001_initial.sql contempla: usuarios/roles, clientes/direcciones, categorías/productos/variantes/media, inventario y reservas, pedidos y líneas, pagos y eventos, envíos, cupones, devoluciones, reembolsos, contenido, auditoría, idempotencia y outbox: 35 tablas/42 FKs.

002_commerce_gaps.sql añade las entidades que usa V41 y faltaban en 001:
- bank_accounts: CLABE, banco y beneficiario.
- shipping_methods: envío estándar, exprés o recoger, con costo.
- exchanges: cambio vinculado a devolución y variante de reemplazo.

**Meta de las dos migraciones: 38 tablas y 44 claves foráneas.**

| V41 | MariaDB |
|---|---|
| products, categories, images | products, product_variants, categories, product_media |
| inventoryMovements, stockReservations | inventory_balances, stock_movements, stock_reservations |
| orders, items y cambios de estado | orders, order_items, order_status_history, order_addresses |
| payments y comprobantes | payments, payment_events |
| coupons, couponRedemptions | coupons, coupon_redemptions |
| returns, refunds, storeCredits, exchanges | returns, return_items, return_events, refunds, store_credits, exchanges |
| bank y shipping | bank_accounts, shipping_methods, shipments |
| tax | store_settings + snapshots de órdenes |
| operators y activity | users, roles, user_roles, audit_logs |

Plan: base vacía de staging, ejecutar 001 y 002, verificar en MariaDB real, implementar login/roles, operaciones de escritura idempotentes, conectar UI y repetir E2E con dos clientes y stock concurrente. NO copiar localStorage como motor backend ni datos demo como reales.

## Semáforo

- Verde: integridad local probada para flujos comerciales cubiertos, modelo relacional inicial.
- Amarillo: pasar lógica al PHP y cerrar seguridad, operaciones transaccionales y QA real.
- Rojo: producción, cobros reales, importar pedidos históricos de demostración sin reconstruirlos.
