# IQ Commerce POS V1 · Checklist y auditoría

## Pruebas automáticas realizadas en Chromium (maqueta)
- [x] Inicio sin errores JavaScript.
- [x] Crear producto.
- [x] Editar producto.
- [x] Duplicar producto.
- [x] Crear categoría.
- [x] Editar categoría.
- [x] Ajustar inventario con motivo.
- [x] Crear cupón.
- [x] Crear banner.
- [x] Rechazo de CLABE inválida.
- [x] Guardar CLABE válida de 18 dígitos.
- [x] Crear pedido con reserva de inventario de demostración.
- [x] Aprobar comprobante únicamente después de marcar verificación.
- [x] Abrir detalles e historial del pedido.
- [x] Registrar solicitud de devolución.
- [x] Reproducir animación de Motion Lab.
- [x] Renderizado responsive de escritorio 1440 px y móvil 390 px, sin errores JS ni desbordamiento horizontal inicial.

## Faltantes antes de etiquetar como tienda real
- [ ] Crear esquema y migraciones MariaDB.
- [ ] Login/roles y control de permisos en servidor.
- [ ] Servicios PHP CRUD y validaciones de backend.
- [ ] Seguridad de comprobantes bancarios y verificación en banco.
- [ ] Pago/estado/idempotencia mediante transacciones y bloqueos de inventario.
- [ ] Rutas compartibles seguras para rastreo del cliente.
- [ ] Conectar la tienda pública al mismo backend.
- [ ] Notificaciones por correo y reglas comerciales reales.
- [ ] Pruebas E2E reales con múltiples sesiones/dispositivos.
- [ ] Revisión de precios, fotografías y políticas con el cliente.

**Ninguna tarea marcada pendiente puede considerarse implementada.**