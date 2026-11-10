# IQ Commerce POS · Panel de administración V1

**Fecha:** 10 de noviembre de 2026 · **Estado:** maqueta funcional (no producción)

## Diseño
- Identidad propia, independiente de la tienda LUJO ÁRABE.
- Fondo claro, tarjetas sólidas, iconos vectoriales, tipografía legible. Sin neones, degradados ni efectos 3D.
- En PC: centro de mando con menú lateral de cinco áreas.
- En móvil: misma funcionalidad con navegación inferior y modales adaptados.
- Motion Lab: confirmaciones breves y accesibles con `prefers-reduced-motion`.

## Áreas completas en esta maqueta
- **Inicio:** indicadores, ventas por día / semana / mes / año, alertas, accesos rápidos.
- **Catálogo:** crear, editar, duplicar, publicar/ocultar y eliminar o archivar productos; categorías con CRUD, orden; inventario, ajustes y mínimos.
- **Ventas:** crear pedido con selección visual, resumen y referencia; revisar comprobantes, aprobar/rechazar manualmente; estados y rastreo ilustrativo del cliente, guía, notas, cancelar; clientes y devoluciones por cupón; reportes y CSV.
- **Contenido:** crear, editar, publicar, ordenar y eliminar banners, videos, carruseles; cupones con límite y vigencia.
- **Ajustes:** banco, beneficiario, CLABE de 18 dígitos con dígito verificador, envío, límites, usuarios demo, actividad, Motion Lab.

## Cómo probar
1. Abrir `IQ_COMMERCE_POS_V1_AUTONOMO.html` directamente, o extraer el ZIP y abrir `admin/index.html`.
2. En **Catálogo → Productos** crear/editar/eliminar un producto.
3. En **Inventario** tocar +, − y Ajustar.
4. En **Ventas → Pedidos** crear pedido, subir comprobante de demostración, confirmar pago, preparar, registrar envío y comprobar seguimiento.
5. En **Ajustes → Banco** definir un banco y CLABE de prueba con dígito verificador (no uses datos reales).
6. En **Contenido** probar cupones, banners, videos y carruseles.
7. En **Motion Lab** probar los movimientos.
8. Repetir los pasos en PC y móvil.

## Advertencias (importante)
Esta versión es una **maqueta interactiva con almacenamiento local del navegador**, no una tienda real. No hay servidor, MariaDB, autenticación segura, webhook, inventario compartido ni procesamiento de dinero. La aprobación de pagos es una simulación, no una verificación bancaria. No subas comprobantes reales ni datos personales o bancarios auténticos.

Los datos iniciales, fotografías e importes son de demostración y no deben publicarse como catálogo comercial definitivo. Si limpias almacenamiento local, pierdes los cambios.

## Próxima fase tras aprobación de UX
- Modelo de datos MariaDB: productos, variantes, categorías, imágenes, inventario/movimientos, clientes, direcciones, pedidos/items, pagos/comprobantes, estados/historial, envíos, cupones, devoluciones, banners/videos/carruseles, usuarios/permisos/auditoría.
- API PHP protegida con sesiones, CSRF, validación, transacciones e idempotencia de pagos.
- Comprobantes de pago fuera de `public_html` con control de acceso, bitácora y respaldo.
- Rutas seguras para seguimiento del cliente.
- Conectar la tienda pública respetando la UI aprobada.
- Revisiones con pruebas en móvil/PC y despliegue controlado desde rama de desarrollo a Hostinger.

## Límites específicos de la maqueta
- No se crean cuentas reales: los roles son únicamente visuales.
- Video: puede vincularse por URL HTTPS o incorporar archivos pequeños de demostración; no sustituye la carga segura del backend.
- El enlace de seguimiento del comprador es una vista local, no un acceso público todavía.
- Algunos elementos del catálogo son visualizaciones conceptuales y requieren fotos comerciales verificadas.
- Stripe, pedidos por WhatsApp y skins están fuera de V1 por decisión del cliente.