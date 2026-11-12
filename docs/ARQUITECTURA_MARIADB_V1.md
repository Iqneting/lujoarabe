# IQ Commerce POS — Arquitectura de persistencia MariaDB V1

**Estado:** base técnica preparada; SIN conexión real ni producción. Rama lujoarabe; V40 visual intacta.

## Única fuente de verdad

Actualmente la tienda pública persiste lujo_cart_demo y lujo_orden_demo en localStorage, y Maestro V40 persiste iqcommerce_maestro_fiel_v1. No comparten pedidos, pagos ni inventario. El admin histórico también tiene otro almacén.

    Tienda pública  ------>  API PHP  <------  Panel Maestro V40
                                 |
                         PDO + MariaDB
                                 |
              catálogo, pedidos, stock, cobros, devoluciones

El servidor calcula importes y valida estados, autorización y existencias. No se confía en montos ni roles enviados por JS.

**Decisión conservadora inicial:** una instalación comercial por tienda con una BD propia. El diseño universal del panel se conserva para otras tiendas. Una futura infraestructura SaaS multitienda necesita acuerdo explícito y pruebas de aislamiento.

## Tablas agrupadas (35)

| Dominio | Tablas |
|---|---|
| Infraestructura | schema_migrations, store_settings, api_idempotency, outbox_events |
| Acceso y auditoría | users, roles, user_roles, audit_logs |
| Clientes | customers, customer_addresses |
| Catálogo | categories, products, product_variants, product_media |
| Inventario | inventory_balances, stock_reservations, stock_movements |
| Ventas | orders, order_addresses, order_items, order_status_history |
| Pagos | payments, payment_events, provider_webhook_events |
| Entregas | shipments, shipment_events |
| Promociones | coupons, coupon_redemptions, store_credits |
| Devoluciones | returns, return_items, return_events, refunds |
| Contenido | content_entries, content_entry_items |

## Relaciones y transacciones imprescindibles

1. **Productos:** products 1:N product_variants, con media ordenada y stock por variante. Producto vendido = historial con snapshot, aunque cambie después el catálogo.
2. **Pedidos:** customers 1:N orders (admitir invitado); orders 1:N order_items. Cada línea guarda SKU, nombre, cantidad, precio, descuento, tasa y total originales. No usar el nombre para identificar el artículo.
3. **Checkout:** usar idempotencia por intento, validación de carrito en servidor, filas inventory_balances bloqueadas en orden estable mediante SELECT ... FOR UPDATE, creación de orden, líneas, dirección, reservas y evento en una sola transacción.
4. **Inventario:** disponible = on_hand - reserved. Al crear pedido pendiente se reserva sin descontar físico. Al confirmar pago, consumir reserva descontando on_hand y reserved y registrar movimiento firmado. Al cancelar/expirar, liberar reserva. Jamás permitir negativos ni venta simultánea de la última pieza.
5. **Pagos:** comprobante bancario NO es pago. Queda en revisión hasta confirmación por usuario autorizado; la operación es atómica y auditable. Pasarela: verificar firma de webhook y deduplicar identificador de evento.
6. **Devoluciones:** returns 1:N return_items enlazadas al order_item exacto. Bloquear la línea comprada mientras se valida que solicitudes no rechazadas acumuladas <= cantidad comprada; registrar historial. Importes salen de snapshots de cada línea, no de dividir el total del pedido entre piezas.
7. **Resoluciones:** reembolso, cambio o crédito son eventos distintos al estado de la devolución. No transferir dinero ni reponer stock por marcar resuelta; requieren flujo explícito autorizado.
8. **IVA:** tax_enabled falso y tax_rate 16 por defecto, modo de precio NULL hasta decidir si está incluido o agregado. Si se activa sin definir modo, el servidor bloqueará checkout; guardar snapshots por línea y orden.
9. **Archivos:** evidencia bancaria y de devolución privada fuera de public_html con validación del servidor. La BD solo guarda clave de almacenamiento. No guardar claves SMTP/Stripe.
10. **Auditoría y notificación:** logs de actividad por actor; correo en outbox_events para entrega asíncrona y reintentos sin duplicar operación.

## Correspondencias de V40

| Maqueta V40 | BD |
|---|---|
| db.products / categories | products, product_variants, product_media, categories |
| Stock simple en producto | inventory_balances, stock_reservations, stock_movements |
| db.orders y arrays de productos por nombre | orders y order_items con snapshots e IDs |
| db.customers | customers, customer_addresses |
| db.returns | returns, return_items, return_events, refunds |
| db.coupons | coupons, coupon_redemptions |
| db.content | content_entries, content_entry_items |
| db.operators / activity | users, roles, user_roles, audit_logs |
| db.tax | store_settings + snapshots en transacciones |

**No importar pedidos, pagos, comprobantes ni devoluciones de demo como registros reales.**
No usar IDs del localStorage como claves de una base comercial.

## Decisiones aún pendientes

- IVA incluido en precio o agregado, y si la tienda necesita excepciones fiscales por producto.
- Regla exacta para vencimiento de reservas, envíos, cancelaciones y pagos parciales.
- Plazos, condiciones y autorizaciones para reembolso, cambios y devoluciones.
- Pasarela real, dominios, políticas comerciales, catálogo/precios/fotos definitivos.
- Modelo de permisos según roles y alcance de usuarios clientes.

**Alcance de esta fase:** esquema, ruta de migración y API pública inicial de lectura. No se han conectado pantallas ni creado operaciones reales.
