# LUJO ÁRABE · Despliegue futuro GitHub → Hostinger

**Estado actual:** código en GitHub, rama `lujoarabe`. **NO publicado en Hostinger**.

## Ruta recomendada (hPanel / GitHub OAuth de Hostinger, 2026)
1. Crear en Hostinger el dominio o subdominio de **LUJO ÁRABE** y su sitio estático/PHP. No usar una carpeta que contenga archivos de otra web; el despliegue puede sobreescribirlos.
2. Entrar a **Sitios web → Administrar → Git** (o **Deploy from GitHub** según el flujo de hPanel).
3. Autorizar Hostinger en GitHub y seleccionar repositorio **Iqneting/lujoarabe**, rama **lujoarabe**; confirmar que se use esa rama y **NO main**.
4. Establecer la ruta pública del sitio (raíz `public_html` o la carpeta de despliegue que corresponda). Para el despliegue Git clásico, Hostinger solicita un directorio vacío.
5. Conectar e iniciar un primer despliegue **solo cuando se apruebe publicar**. Activar *Auto Deployment / Auto Implementación* del sitio/ramal seleccionado en hPanel para despliegues posteriores tras cambios.
6. Verificar accesibilidad, HTTPS, rutas relativas, carruseles, imágenes, checkout DEMO, móviles y logs de Hostinger.
7. Cambiar **noindex,nofollow** y `robots.txt` únicamente cuando se trate de tienda real aprobada, con precios, inventario y medios de pago confirmados.

**Nota:** Hostinger introdujo integración OAuth con GitHub para despliegues Git (2026). Esta vía normalmente no requiere almacenar contraseñas de Hostinger en el repositorio. La activación precisa se hace desde hPanel en tu cuenta; no se puede concluir desde GitHub por sí solo.

## Alternativa opcional: Webhook de Hostinger mediante GitHub Actions
Archivo: `.github/workflows/deploy-hostinger.yml`. Está **desactivado** hasta establecer en GitHub:
- Repository variable `HOSTINGER_AUTO_DEPLOY_ENABLED=true`.
- Repository secret `HOSTINGER_DEPLOY_WEBHOOK`, proporcionado por Hostinger en la opción de Auto Implementación.

GitHub Actions invoca el webhook en push a `lujoarabe`. **Elige solo UN mecanismo** (integración nativa Hostinger o workflow webhook) para evitar despliegues duplicados. No copies el enlace del webhook a archivos públicos, mensajes ni commits.

## Checklist antes de producción
- [ ] Dominio/destino confirmados; respaldo del sitio existente.
- [ ] Carpeta destino correcta, aislada y libre de datos delicados.
- [ ] Imágenes comerciales definitivas y catálogo/prices validados.
- [ ] Pagos y pedidos conectados a backend real (la demo no debe cobrar).
- [ ] URL canónica, `og:url`, `og:image` y `twitter:image` con URLs absolutas HTTPS.
- [ ] `robots.txt` de producción y sitemap listos, indexación habilitada.
- [ ] Probar en móvil y PC, HTTPS, formularios, consentimientos y eventos de compra.

Fuentes Hostinger:
https://www.hostinger.com/es/support/1583302-como-implementar-un-repositorio-git-en-hostinger/
https://www.hostinger.com/changelog/github-oauth-setup-for-git-deployments
