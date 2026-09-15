require('dotenv').config();

const express = require("express");
const compression = require("compression");
const app = express();
const db = require("./app/models");
const path = require('path');
const fs = require('fs');
const isBot = require('./app/config/bots');

// 1. COMPRESIÓN GZIP (Reduce el tamaño de las respuestas de texto/JS/CSS hasta un 70% en HTTP/1.1)
app.use(compression());

const DIST_DIR = path.resolve(__dirname, 'app/views');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

let indexHtmlTemplate = '';
try {
  indexHtmlTemplate = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
} catch (e) {
  console.error('Error al cargar index.html de dist. Asegúrate de compilar la app Vue.', e);
}

// Sincronización de Base de Datos
db.sequelize.sync().then(() => {
  console.log("DB sincronizada correctamente.");
});

// 2. ARCHIVOS ESTÁTICOS DE /storage CON CACHÉ (1 semana para imágenes de usuario/productos)
app.use('/storage', express.static(path.join(__dirname, 'storage'), {
  maxAge: '7d',
  etag: true
}));

// Configuración de CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Access-Token, x-access-token");
  next();
});

// Require controllers
const headerController = require('./app/controllers/headerController');

// Configuración de vistas EJS
const viewsPath = path.join(__dirname, 'app/views/');
app.set('views', viewsPath);
app.set("view engine", "ejs");

var history = require('connect-history-api-fallback');

// 3. ARCHIVOS ESTÁTICOS DE LA APP VUE CON CACHÉ INMUTABLE (1 AÑO)
app.use(express.static(DIST_DIR, { 
  index: false,
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// RUTAS DE LA API
require('./app/api/admin.routes')(app);
require("./app/api/slider.routes")(app);
require("./app/api/store.routes")(app);
require("./app/api/rolexV2.routes")(app);

require('./app/api/auth.routes')(app);
require('./app/api/user.routes')(app);
require('./app/api/mail.routes')(app);
require('./app/api/payment.routes')(app);
require('./app/api/routes.routes')(app);
require('./app/api/tracking.routes')(app);
require('./app/api/metrics.routes')(app);

// METADATOS EN MEMORIA CACHEADOS (Evita concatenar strings en cada petición)
const DEFAULT_METADATA = {
  title: 'Mimi Joyería | Distribuidor Oficial de Rolex en Venezuela',
  description: 'Descubra la excelencia de Mimi Joyería, su destino de lujo en Venezuela. Orgullosos Distribuidores Oficiales Rolex, brindando piezas icónicas y mantenimiento experto.',
  image: 'https://mimijoyeria.com/storage/mimi-logo-gray.png',
  imageAlt: 'Logo en gris'
};

async function getSeoMetadata(urlPath) {
  const baseUrl = 'https://mimijoyeria.com';
  const fullUrl = `${baseUrl}${urlPath === '/' ? '' : urlPath}`;

  return {
    ...DEFAULT_METADATA,
    url: fullUrl
  };
}

// 4. MIDDLEWARE OPTIMIZADO PARA BOTS Y SERVICIO SPA
app.get('*', async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';

  if (!isBot(userAgent)) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(indexHtmlTemplate);
  }

  try {
    const metadata = await getSeoMetadata(req.path);

    const html = indexHtmlTemplate
      .replace(/<title>.*?<\/title>/i, `<title>${metadata.title}</title>`)
      .replace(
        '</head>',
        `
          <meta name="description" content="${metadata.description}">
          <link rel="canonical" href="${metadata.url}">

          <!-- OPEN GRAPH -->
          <meta property="og:type" content="website">
          <meta property="og:site_name" content="Mimi Joyería">
          <meta property="og:url" content="${metadata.url}">
          <meta property="og:title" content="${metadata.title}">
          <meta property="og:description" content="${metadata.description}">
          <meta property="og:image" content="${metadata.image}">
          <meta property="og:image:secure_url" content="${metadata.image}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:image:alt" content="${metadata.imageAlt}">
          <meta property="og:locale" content="es_ES">

          <!-- TWITTER CARDS -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${metadata.title}">
          <meta name="twitter:description" content="${metadata.description}">
          <meta name="twitter:image" content="${metadata.image}">
          </head>
        `
      );

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error al inyectar metadatos al bot:', error);
    return res.status(200).send(indexHtmlTemplate);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});