# Contratos de API — IQ Commerce POS V1

La tienda pública y el Maestro V40 deberán usar UNA API y UNA base MariaDB. Moneda MXN, importes en cadena decimal (ej. "1299.00") y fechas UTC. El cliente no dicta nunca totales, impuestos ni estado pagado.

## Operativos en código, pendientes de probar en servidor

| Método | Ruta | Función |
|---|---|---|
| GET | /api/v1/health | Conexión DB y migración 001_initial |
| GET | /api/v1/store/config | Nombre, moneda, IVA, pricing_ready |
| GET | /api/v1/catalog/categories | Categorías activas |
| GET | /api/v1/catalog/products?limit=24&page=1&category_id=123 | Publicados, variante predeterminada, disponible, paginación |

Sin CORS abierto, sin operaciones de escritura y sin credenciales en respuesta. Storage keys de imágenes son identificadores internos, no enlaces públicos listos para mostrar.

## Contratos a implementar después (NO existen aún)

| Método | Ruta | Condición |
|---|---|---|
| POST | /api/v1/auth/login | Limitación de intentos, sesión segura |
| POST | /api/v1/auth/logout | Sesión y CSRF |
| GET | /api/v1/auth/me | Sesión |
| POST | /api/v1/orders | Checkout público con antiabuso e idempotencia |
| GET | /api/v1/orders/{id} | Dueño del pedido o staff |
| GET | /api/v1/admin/orders | Rol permitido |
| PATCH | /api/v1/admin/orders/{id}/status | Rol + CSRF + estado válido |
| POST | /api/v1/admin/payments/{id}/verify | Rol + CSRF + pago verificado |
| POST/PATCH | /api/v1/admin/products | Rol + CSRF + validación |
| POST | /api/v1/admin/stock/adjustments | Rol + CSRF + historial |
| POST | /api/v1/returns | Propietario/staff + validar unidades |
| POST | /api/v1/admin/returns/{id}/resolve | Rol + CSRF |
| PATCH | /api/v1/admin/store/iva | Dueño/admin + CSRF |
| GET/POST | /api/v1/admin/content | Permiso; POST con CSRF |

Nunca conectar un botón de la UI a endpoints aún no implementados.

## Checkout propuesto

POST /api/v1/orders requiere encabezado Idempotency-Key aleatorio de al menos 128 bits. Ejemplo de intención:

~~~json
{
  "customer":{"name":"Cliente ejemplo","email":"cliente@example.test"},
  "shipping":{"recipient":"Cliente ejemplo","street":"Ejemplo","city":"CDMX","state":"CDMX","postal_code":"06000","country":"MX"},
  "items":[{"variant_id":123,"quantity":2}],
  "coupon_code":null,
  "shipping_method":"standard"
}
~~~

Servidor: validar cuerpo y disponibilidad, calcular precios y descuentos desde BD, bloquear filas, persistir todo junto, guardar snapshot fiscal y emitir folio y mecanismo privado de seguimiento. No aceptar del cliente grand_total, tax_total, price ni paid. Idempotency-Key reutilizada con cuerpo distinto -> 409; reintento idéntico -> misma respuesta.

**IVA:** configuración inicial 16%, desactivado. Si está activo pero falta definir included vs added, retornar 409 tax_pricing_mode_required. No reinterpretar precios históricos al cambiar tasa.

**Inventario:** hold para orden pendiente; expiración/cancelación libera reserved; cobro confirmado consume reserved y on_hand en transacción con movimiento. Nunca reservar > disponible.

**Pagos:** comprobante lleva a review, no verified. Confirmación administrativa verificada y auditada; webhook de tarjeta debe validar firma y deduplicarse. Pagos parciales dependen de regla comercial acordada.

**Devolución:** orden pagada; seleccionar order_item_id real, cantidad positiva y no repetida, monto desde snapshot, nunca desde total estimado del pedido. Secuencia requested→review→received→resolved→closed, rejected terminal. Resolución monetaria o cambio exige registro aparte.

**Seguridad:** cookie HttpOnly, Secure, SameSite, ID de sesión regenerado al login; contraseña con password_hash/password_verify; permisos servidores por acción, CSRF en mutaciones, rate limiting, registros auditables, archivo bancario privado. Nada de contraseñas en código JS.

Errores: 400 bad_request, 401 unauthenticated, 403 forbidden, 404 not_found, 409 conflict, 422 validation_failed, 429 rate_limited, 500 internal_error, 503 service_unavailable. No exponer trazas ni credenciales.

**Las rutas futuras son una especificación, NO servicios ya desarrollados.**
