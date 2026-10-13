const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

module.exports = function(app) {
  app.get('/sitemap.xml', async (req, res) => {
    try {
      res.header('Content-Type', 'application/xml');
      res.header('Content-Encoding', 'gzip'); // Si envías la respuesta comprimida con zlib (opcional)

      // 1. RUTAS ESTÁTICAS DE TU VUE ROUTER
      const staticRoutes = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/joyeria', changefreq: 'weekly', priority: 0.8 },
        { url: '/rolex/oyster-perpetual', changefreq: 'monthly', priority: 0.9 },
        { url: '/rolex/accesorios', changefreq: 'monthly', priority: 0.7 },
        { url: '/novedades/tudor', changefreq: 'weekly', priority: 0.8 },
      ];

      // 2. RUTAS DINÁMICAS DESDE LA BASE DE DATOS (Ejemplo con Sequelize)
      // Reemplaza estas consultas por tus modelos reales
      const relojes = await Reloj.findAll({ attributes: ['slug', 'updatedAt'] });
      const dynamicRelojesRoutes = relojes.map(reloj => ({
        url: `/reloj/${reloj.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: reloj.updatedAt
      }));

      /* Ejemplo para otra entidad:
      const categorias = await Categoria.findAll({ attributes: ['slug', 'updatedAt'] });
      const dynamicCategoriasRoutes = categorias.map(cat => ({
        url: `/coleccion/${cat.slug}`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: cat.updatedAt
      }));
      */

      // 3. UNIR TODAS LAS RUTAS
      const allRoutes = [
        ...staticRoutes,
        ...dynamicRelojesRoutes,
        // ...dynamicCategoriasRoutes
      ];

      // 4. CREAR EL STREAM DE SITEMAP
      const stream = new SitemapStream({ hostname: 'https://mimijoyeria.com' });
      const xmlBuffer = await streamToPromise(Readable.from(allRoutes).pipe(stream));

      // Guardar en caché del navegador/CDN por 1 día para no saturar la base de datos en cada visita
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(xmlBuffer.toString());

    } catch (error) {
      console.error('Error al generar el sitemap.xml:', error);
      return res.status(500).end();
    }
  });
};