# LUJO ÁRABE · Maqueta HTML V1

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
