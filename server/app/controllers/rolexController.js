const db = require("../models");
const rolex = db.rolex;
const Op = db.Sequelize.Op

const storagePath = process.env.STORAGE_PATH

const collectionsArray = ["item", "cosmograph-daytona", "1908", "yacht-master", "sky-dweller", "gmt-master-ii", "explorer", "oyster-perpetual", "day-date", "datejust", "lady-datejust", "air-king", "submariner", "sea-dweller", "deepsea", "land-dweller"]


function contarGuiones(cadena) {
  let contador = 0;
  for (let i = 0; i < cadena.length; i++) {
    if (cadena[i] === '-') {
      contador++;
    }
  }
  return contador;
}


// Show display of all watches from a single collection

exports.getAllPaginatedRolexV2 = async (req, res) => {
  try {
    // 1. Pagination parameters for Infinite Scroll
    const limit = 20;
    const page = parseInt(req.query.page, 10) || 1; // Corrected radix to 10
    const offset = (page - 1) * limit;

    // 2. Extract tags string from query parameters
    const { tags } = req.query;

    // Define base includes that will always return, regardless of filters
    const detailsInclude = {
      model: rolex.RolexDetailsV2,
      where: {} // Dynamic where clause for prices
    };

    const includes = [detailsInclude];

    // 3. Handle filtering if tags parameter is present
    if (tags) {
      // Split positional string: [collection, size, material, color, minPrice, maxPrice]
      const tagsArray = typeof tags === 'string' ? tags.split(',') : [];

      // Clean empty string spaces sent by frontend
      const collectionFilter = tagsArray[0]?.trim();
      const sizeFilter = tagsArray[1]?.trim();
      const materialFilter = tagsArray[2]?.trim();
      const colorFilter = tagsArray[3]?.trim();

      // Parse numerical prices safely
      const minPrice = parseInt(tagsArray[4], 10) || 0;
      const maxPrice = parseInt(tagsArray[5], 10) || 0;

      // --- Filter 1: Collection (rolexCollections) ---
      if (collectionFilter && collectionFilter !== '') {
        includes.push({
          model: rolex.RolexCollections, // Adjusted to your mentioned model structure
          where: {
            // Assuming your table column matches your naming strategy, replace if it uses 'name' or 'collection'
            idName: collectionFilter
          },
          required: true // Force INNER JOIN to filter out records
        });
      } else {
        includes.push({
          model: rolex.RolexCollections,
        });
      }

      // --- Filter 2: Tags (RolexTags - Size, Material, Color) ---
      // We collect all active text tags into a single array to hit the DB efficiently
      const activeTags = [];
      if (sizeFilter && sizeFilter !== '') activeTags.push(sizeFilter);
      if (materialFilter && materialFilter !== '') activeTags.push(materialFilter);
      if (colorFilter && colorFilter !== '') activeTags.push(colorFilter);

      if (activeTags.length > 0) {
        includes.push({
          model: rolex.RolexTags,
          where: {
            tag: { [Op.in]: activeTags } // Evaluates matching keywords
          },
          through: { attributes: [] },
          required: true
        });
      } else {
        // If no text tags are applied, include it as optional to fetch current tags
        includes.push({
          model: rolex.RolexTags,
          through: { attributes: [] },
          required: false
        });
      }

      // --- Filter 3: Prices (RolexDetailsV2) ---
      if (minPrice > 0 && maxPrice > 0) {
        detailsInclude.where.precio = { [Op.between]: [minPrice, maxPrice] };
      } else if (minPrice > 0) {
        detailsInclude.where.precio = { [Op.gte]: minPrice };
      } else if (maxPrice > 0) {
        detailsInclude.where.precio = { [Op.lte]: maxPrice };
      }
    } else {
      // If no query parameters at all, just map baseline optional relation
      includes.push({
        model: rolex.RolexTags,
        through: { attributes: [] },
        required: false
      });


      includes.push({
        model: rolex.RolexCollections,
      });
    }

    // 4. Query DB using distinct to protect accurate total calculations
    const { count, rows: rolexes } = await rolex.RolexGetAllV2.findAndCountAll({
      include: includes,
      limit: limit,
      offset: offset,
      distinct: true,
      order: [['id', 'DESC']]
    });

    // 5. Structured response payload for Vue implementation
    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      hasMore: page * limit < count,
      data: rolexes
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving Rolex collection",
      error: error.message || error
    });
  }
};



exports.get10RandomRolex = (req, res) => {
  rolex.RolexGetAllV2.findAll({
    order: db.Sequelize.literal('rand()'),
    limit: 10,
    include: [
      {
        model: rolex.RolexDetailsV2,
        attributes: ['precio']
      },
      {
        model: rolex.RolexCollections,
        attributes: ['idName']
      },
      {
        model: rolex.RolexTags,
        where: {
          tag: 'Grande'
        },
        through: { attributes: [] },
        required: true
      }
    ]
  })
    .then((data) => { return res.send(data) })
    .catch((error) => { return res.status(500).send({ message: "Error retrieving random Rolex pieces", error }) })
}
exports.getAllRolexCollections = (req, res) => {
  rolex.RolexCollections.findAll({

  })
    .then((data) => { return res.send(data) })
    .catch((error) => { return res.status(500).send({ message: "Error retrieving accessory", error }) })
}

exports.getCollectionDetailsV2 = (req, res) => {


  const collectionId = collectionsArray.indexOf(req.params.id);
  if (collectionId === -1) {
    return res.status(400).send({ message: "Invalid collection id" })
  }

  rolex.RolexGetAllV2.findAll({
    where: {
      RolexCollectionId: collectionId
    },
    include: [
      {
        model: rolex.RolexDetailsV2,
        attributes: ['precio']
      }
    ]
  })
    .then((data) => { return res.send(data) })
    .catch((error) => { return res.status(500).send({ message: "Error retrieving collection", error }) })


}



exports.getRolexDetailsV2 = async (req, res) => {
  try {
    let rolexResponseObject = {}
    let modelName = req.params.id.toString()
    const numbers = contarGuiones(modelName)

    if (numbers > 1) {
      for (let i = 1; i < numbers; i++) {
        const position = modelName.indexOf("-") + 1
        modelName = modelName.substring(position, modelName.length)
      }
    }


    const findId = await rolex.RolexGetAllV2.findOne({
      where: {
        modelo: modelName
      }
    })

    let parsedName = findId


    parsedName.showcaseIMG = `${storagePath}/rolex-relojes-new/${parsedName.modelo}-showcase.webp`
    parsedName.boxIMG = `${storagePath}/rolex-relojes-new/${parsedName.modelo}_presentation-box.webp`
    parsedName.boxIMGMobile = `${storagePath}/rolex-relojes-new/${parsedName.modelo}_presentation-box-mobile.webp`


    rolexResponseObject.getAll = parsedName

    const rolexId = parsedName.id
    const collectionId = parsedName.RolexCollectionId

    let findDetails = await rolex.RolexDetailsV2.findByPk(rolexId)
    let detailsArray = []
    detailsArray.push(findDetails)
    detailsArray.push({})

    detailsArray[1].img = `${storagePath}/rolex-relojes-new/${rolexResponseObject.getAll.modelo}_cor-specs.webp`
    detailsArray[1].imgMobile = `${storagePath}/rolex-relojes-new/${rolexResponseObject.getAll.modelo}_cor-specs-mobile.webp`
    detailsArray[0].precio = detailsArray[0].precio.toString()

    rolexResponseObject.details = detailsArray


    let getHeaders = await rolex.RolexHeadersV2.findByPk(rolexId)

    let imgArray = []
    imgArray = []
    imgArray[0] = {}
    imgArray[1] = {}
    imgArray[2] = {}

    imgArray[0].imgDesktop = `${storagePath}/rolex-relojes-new/${getHeaders.imagen1}.webp`
    imgArray[0].imgMobile = `${storagePath}/rolex-relojes-new/${getHeaders.imagen1}-mobile.webp`

    imgArray[1].imgDesktop = `${storagePath}/rolex-relojes-new/${getHeaders.imagen2}.webp`
    imgArray[1].imgMobile = `${storagePath}/rolex-relojes-new/${getHeaders.imagen2}-mobile.webp`

    imgArray[2].imgDesktop = `${storagePath}/rolex-relojes-new/${getHeaders.imagen3}.webp`
    imgArray[2].imgMobile = `${storagePath}/rolex-relojes-new/${getHeaders.imagen3}-mobile.webp`

    getHeaders.img = imgArray

    rolexResponseObject.headers = getHeaders


    const getCollection = await rolex.RolexCollections.findByPk(collectionId)

    rolexResponseObject.collection = getCollection
    return res.send(rolexResponseObject)
  } catch (error) {
    return res.status(500).send({ message: "Error retrieving Rolex details", error })
  }


}


exports.getAllAccesories = async (req, res) => {
  rolex.RolexAccesories.findAll({
    where: {
      RolexCollectionId: { [Op.gte]: 16 }

    }
  })
    .then((data) => { return res.send(data) })
    .catch((error) => { return res.status(500).send({ message: "Error retrieving accessory", error }) })
}


exports.getAccesoriesById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: "ID is required" })
  }


  rolex.RolexAccesories.findAll({
    where: {
      modelo: req.params.id

    }
  }).then((data) => {
    if (data.length === 0) {
      return res.status(404).send({ message: "Accessory not found" })
    }
    return res.send(data)
  })
    .catch((error) => { return res.status(500).send({ message: "Error retrieving accessory", error }) })
}

