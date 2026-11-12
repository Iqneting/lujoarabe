# LUJO ÁRABE · Maqueta HTML V1

> **ESTADO VERIFICADO:** MariaDB 10.11 temporal **35 tablas, 42 claves foráneas, migración idempotente y 4 endpoints GET probados**. [Resultado QA](docs/QA_BACKEND_MARIADB_V1.md) · [Continuidad técnica para próximos hilos](docs/CONTINUIDAD_BACKEND_MARIADB_V1.md) · [GitHub Actions PASS](https://github.com/Iqneting/lujoarabe/actions/runs/43133797840). No supone instalación en Hostinger ni integración con el frontend.

> **BASE DE DATOS / API EN PREPARACIÓN (11 nov 2026).** El nuevo modelo MariaDB de 35 tablas está en [database/migrations/001_initial.sql](database/migrations/001_initial.sql). [Arquitectura](docs/ARQUITECTURA_MARIADB_V1.md) · [Contratos de API](docs/CONTRATOS_API_V1.md) · [Instalación segura](database/README.md) · [Backend PHP de consulta](backend/README.md). **Todavía no hay conexión a Hostinger ni checkout real.** Se conserva V40, la tienda pública y main sin sustituirlos.

**Rama de desarrollo:** `lujoarabe` · **Estado:** maqueta interactiva, no producción.

Diseño de IQneting basado en la maqueta aprobada. Escritorio y móvil con apariencia de app nativa, navegación de categorías, carrusel, 20 productos del Excel, búsqueda, filtros, selección de producto, carrito flotante, checkout simulado, confirmaciones Motion y visualización administrativa.

## Estructura
- `index.html`: estructura, metadatos SEO/Open Graph y datos estructurados.
- `styles.css`: línea visual responsive y animaciones.
- `app.js`: navegación, filtros, carrito y simulación de compra (almacenamiento del navegador).
- `assets/`: **34 recursos extraídos de la maqueta autónoma V1**, incluidos hero, logotipo, productos y categorías vectoriales.
- `catalogo-demo.json`: 20 productos seleccionados del Excel; precios **ilustrativos**.
- `manifest.webmanifest`: aspecto de aplicación; la PWA instalable requiere service worker y HTTPS.
- `.github/workflows/deploy-hostinger.yml`: webhook opcional de despliegue, **desactivado por defecto**.

## Seguridad / límites de la maqueta
No hay pagos reales, pedidos almacenados en servidor, inventario en MariaDB, autenticación ni integración de envíos o videos reales. Nunca capturar datos de tarjeta reales mediante esta maqueta. No publicar precios como definitivos sin validación del cliente. Las imágenes generadas son reinterpretaciones visuales y se deben sustituir por fotografías oficiales o autorizadas antes de comercializar.

## Siguiente etapa
Revisar diseño V1, fijar dominio, validar productos/precios/fotos, conectar backend PHP + MariaDB, integrar pasarela certificada y logística; solo entonces habilitar robots/indexación y despliegue productivo.

Ver [HOSTINGER_DEPLOY.md](HOSTINGER_DEPLOY.md) y [SEO_SEM.md](SEO_SEM.md).
