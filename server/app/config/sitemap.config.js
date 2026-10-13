// app/config/sitemap-routes.js

const staticRoutes = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/joyeria', priority: 0.8, changefreq: 'weekly' },
  { url: '/rolex/oyster-perpetual', priority: 0.9, changefreq: 'monthly' },
  { url: '/rolex/accesorios', priority: 0.7, changefreq: 'monthly' },
  { url: '/novedades/tudor', priority: 0.8, changefreq: 'weekly' },
];

// Mapeadores dinámicos 
const dynamicMappers = [
  // --- TABLAS DERIVADAS DE rolex.model.js ---
  {
    modelKey: 'RolexModel', 
    routePrefix: '/rolex',  // Genera rutas tipo: /rolex/:slug o /rolex/:id
    slugField: 'slug',       // Campo de la URL (si usas id en la ruta de Vue, cambia a 'id')
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    modelKey: 'RolexArticle', // Si rolex.model.js exporta artículos/World of Rolex
    routePrefix: '/world-of-rolex',
    slugField: 'slug',
    priority: 0.8,
    changefreq: 'monthly'
  },

  // --- TABLAS DERIVADAS DE store.model.js ---
  {
    modelKey: 'Product', // Nombre del modelo de productos en store.model.js (ej: 'products', 'storeItems')
    routePrefix: '/producto', // Genera rutas tipo: /producto/:slug
    slugField: 'slug',
    priority: 0.8,
    changefreq: 'daily'
  },
  {
    modelKey: 'Category', // Si store.model.js tiene categorías o colecciones de joyería
    routePrefix: '/categoria',
    slugField: 'slug',
    priority: 0.7,
    changefreq: 'weekly'
  }
];

module.exports = { staticRoutes, dynamicMappers };