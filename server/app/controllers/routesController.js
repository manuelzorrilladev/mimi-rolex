const fs = require('fs');
const path = require('path');

const db = require("../models");
const Routes = db.routes;
const Op = db.Sequelize.Op;
const rolexBaseData = require("./routeData/rolexBaseData.json")
const genericRoutesData = require("./routeData/genericRoutesData.json")

const baseRoute = process.env.HOME_ROUTE


exports.searchTags = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const searchParam = req.params.id


    Routes.Routes.findAll({
        attributes: [
            'title', 'brand'
        ],
        where: {
            title: { [Op.substring]: searchParam },

        },
        limit: 5
    })
        .then((data) => res.send(data))
        .catch((err) => res.send(err.message))
};


exports.searchResult = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const searchParam = req.params.id


    Routes.Routes.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.substring]: searchParam } },
                { watchSerial: { [Op.substring]: searchParam } }
            ],
        }
    })
        .then((data) => res.send(data))
        .catch((err) => res.send(err.message))
};

exports.searchValidate = (req, res) => {
    // Validate request
    res.send([])
};


// SEO ROUTES
exports.imgValidation = async (req, res) => {
    const imgResponse = []
    const carpetaStorage = path.join(__dirname, '../../storage/rolex-relojes-new/');
  
    try {
        const rolexRoutes = await db.rolex.RolexGetAllV2.findAll(
            {
                include: [
                   
                    {
                        model: db.rolex.RolexHeadersV2,
                        attributes: ['imagen1', 'imagen2', 'imagen3']
                    }
                ],
                attributes:['id','modelo']
            })

        for(let i = 0; i < rolexRoutes.length; i++) {

            const imgObject = {
                model:rolexRoutes[i].modelo,
                showcase:fs.existsSync(carpetaStorage + rolexRoutes[i].modelo + "-showcase.webp"),
                slider:[
                    fs.existsSync(carpetaStorage + rolexRoutes[i].modelo + "-slider-1.webp"),
                    fs.existsSync(carpetaStorage + rolexRoutes[i].modelo + "-slider-2.webp"),
                    fs.existsSync(carpetaStorage + rolexRoutes[i].modelo + "-slider-3.webp"),
                ],
                desktop:{
                    header:[
                        fs.existsSync(carpetaStorage + rolexRoutes[i]['rolex-headers-v2'].imagen1+".webp"),
                        fs.existsSync(carpetaStorage + rolexRoutes[i]['rolex-headers-v2'].imagen2+".webp"),
                        fs.existsSync(carpetaStorage + rolexRoutes[i]['rolex-headers-v2'].imagen3+".webp"),
                    ]
                },
                mobile:{
                    header:[
                        fs.existsSync(carpetaStorage + rolexRoutes[i]['rolex-headers-v2'].imagen1+"-mobile.webp"),
                        fs.existsSync(carpetaStorage + rolexRoutes[i]['rolex-headers-v2'].imagen2+"-mobile.webp"),
                        fs.existsSync(carpetaStorage + rolexRoutes[i]['rolex-headers-v2'].imagen3+"-mobile.webp"),
                    ]
                },
            }
            if(!imgObject.showcase || imgObject.slider.includes(false) || imgObject.desktop.header.includes(false) || imgObject.mobile.header.includes(false)) {

                imgResponse.push(imgObject)
            }
            
        }

        res.send(imgResponse)


    } catch (error) {
        res.status(500).send(error.message)
    }
}


exports.getMetaBreadcrumbs = async (req, res) => {
    const baseRoute = "https://mimijoyeria.com"
    const allRoutesResponse = []
    const rolexRoutes = await db.rolex.RolexGetAllV2.findAll(
        {
            include: db.rolex.RolexCollections
        }
    )

    rolexBaseData.forEach((obj, index) => {
        if (obj.route.includes("rolex")) {

            allRoutesResponse.push({
                "@type": "ListItem",
                "position": index,
                "name": obj.name,
                "item": `https://mimijoyeria.com${obj.route}`

            })
        }
    })

    rolexRoutes.forEach((obj, index) => {
        allRoutesResponse.push({
            "@type": "ListItem",
            "position": index + rolexBaseData.length,
            "name": obj.nombre,
            "item": `https://mimijoyeria.com/rolex/${obj['Rolex-collection'].idName}-${obj.modelo}`
        })
    })


    res.send(allRoutesResponse)
}

exports.generateSearchRoutes = async (req, res) => {

    const allRoutesInsert = []


    const rolexRoutesFromDB = await db.rolex.RolexGetAllV2.findAll({ include: db.rolex.RolexCollections })
    const rolexAccesoriesFromDB = await db.rolex.RolexAccesories.findAll()

    genericRoutesData.forEach((obj) => {
        allRoutesInsert.push(obj)
        allRoutesInsert[allRoutesInsert.length - 1].link = `https://mimijoyeria.com${obj.link}`
    })

    rolexRoutesFromDB.forEach((obj) => {
        allRoutesInsert.push({
            "title": obj.nombre,
            "watchSerial": obj.modelo,
            "description": obj.cajaDelModelo,
            "link": `https://mimijoyeria.com/rolex/${obj['Rolex-collection'].idName}-${obj.modelo}`,
            "thumbnail": `https://mimijoyeria.com/storage/rolex-relojes-new/${obj.modelo}-showcase.webp`,
            "type": "reloj",
            "brand": "rolex"
        })
    })
    rolexAccesoriesFromDB.forEach((obj) => {
        allRoutesInsert.push({
            "title": obj.nombre,
            "watchSerial": obj.modelo,
            "description": obj.sub,
            "link": `https://mimijoyeria.com/rolex/accesorios/${obj.modelo}`,
            "thumbnail": `https://mimijoyeria.com/storage/rolex-relojes-new/${obj.modelo}-packshot.webp`,
            "type": "accesorio",
            "brand": "rolex"
        })
    })


    const tudorRoutesFromDB = await db.store.Watchmaking.findAll({
        where: {
            coleccion: "Tudor",
            disponible: 1
        }
    })

    tudorRoutesFromDB.forEach((obj) => {
        allRoutesInsert.push({
            "title": obj.nombre,
            "watchSerial": obj.serie,
            "description": obj.descripcion,
            "link": `https://mimijoyeria.com/relojeria/tudor/${obj.serie}`,
            "thumbnail": `https://mimijoyeria.com/storage/store-products/${obj.serie}-1.webp`,
            "type": "reloj",
            "brand": "tudor"
        })
    })

    const jewelryRoutesFromDB = await db.store.Jeweler.findAll()

    jewelryRoutesFromDB.forEach((obj) => {
        allRoutesInsert.push({
            "title": obj.nombre,
            "watchSerial": obj.serie,
            "description": obj.titulo,
            "link": `https://mimijoyeria.com/joyeria/${obj.serie}`,
            "thumbnail": `https://mimijoyeria.com/storage/rolex-relojes-new/${obj.serie}-1.webp`,

            "type": "joyeria",
            "brand": "mimi"
        })
    })

    // delete all records from table
    Routes.Routes.destroy({
        truncate: true,
    }).then(() => {
        Routes.Routes.bulkCreate(allRoutesInsert, {
            validate: true
        }).then(() => {
            res.status(200).send("All routes inserted successfully")
        }).catch((err) => res.status(500).send(err.message))

    }).catch((err) => res.send(err.message))

}
