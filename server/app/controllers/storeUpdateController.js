const { where, literal } = require("sequelize");
const db = require("../models");
const Store = db.store;
const User = db.user.User;
const Role = db.user.Role
const Op = db.Sequelize.Op;

const fs = require("fs");
const storagePath = process.env.STORAGE_PATH



// GET WATCHES ANALYTICS
exports.getStoreAnalytics = async (req, res) => {
    try {
        const user = req.body.user
        if (!req.body) {
            return res.status(400).send({ message: "Faltan los datos para crear el producto" })
        }

     
        const valuesArray = req.body.values.map(item => item.toLowerCase());
        const search = await Store.Watchmaking.findAll({
            attributes: ['id', 'serie', 'disponible'],
            where: {
                serie: {
                    [Op.in]: valuesArray
                }
            }
        })

        const existingValues = search.map(item => item.serie)
        const nonExistingValues = valuesArray.filter(item => !existingValues.includes(item));

        return res.send({
            existing: existingValues,
            nonExisting: nonExistingValues
        })


    } catch (error) {

        res.status(500).send({
            message: error.message || "Ocurrio un error al chequear"
        })


    }


}


// UPDATE WATCHES AVAILABILITY
exports.updateStoreAvailability = async (req, res) => {

    try {
        const user = req.body.user
        if (!req.body) {
            return res.status(400).send({ message: "Faltan los datos para crear el producto" })
        }

        


        const valuesArray = req.body.values.map(item => item.toLowerCase());


        await Store.Watchmaking.update(
            { disponible: 0 },
            { where: { disponible: 1, coleccion: "Tudor" } }
        );


        await Store.Watchmaking.update(
            { disponible: 1 },
            {
                where: {
                    serie: {
                        [Op.in]: valuesArray
                    }
                }
            }
        );

        res.status(200).send("Disponibilidad actualizada correctamente");


    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió un error al actualizar la disponibilidad."
        });
    }


}



exports.updateStoreAvailabilitySingle = async (req, res) => {

    try {

        const user = req.body.user
        if (!req.body) {
            return res.status(400).send({ message: "Faltan los datos para crear el producto" })
        }

        


        const itemToSearch = req.body.id


        await Store.Watchmaking.update(
            { disponible: literal('1 - disponible') },
            { where: { id: itemToSearch } }
        );



        res.status(200).send("Disponibilidad actualizada correctamente");


    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió un error al actualizar la disponibilidad."
        });
    }


}
exports.updateStoreAvailabilitySingleCollection = async (req, res) => {

    try {

        const user = req.body.user
        if (!req.body) {
            return res.status(400).send({ message: "Faltan los datos para crear el producto" })
        }

        


        const itemToSearch = req.body.id
        const collectionToChange = req.body.collection == 'Tudor'? 'Novedades':'Tudor'


        await Store.Watchmaking.update(
            { coleccion:collectionToChange },
            { where: { id: itemToSearch } }
        );



        res.status(200).send("Disponibilidad actualizada correctamente");


    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió un error al actualizar la disponibilidad."
        });
    }


}

//TOGGLE SPECIFIC WATCH AVAILABILITY
exports.updateSingleAvailability = async (req, res) => {


    try {

        const user = req.body.user
        if (!req.body) {
            return res.status(400).send({ message: "Faltan los datos para crear el producto" })
        }

        



        const serial = req.body.serial
        const action = req.body.action

        await Store.Watchmaking.update(
            { disponible: action },
            {
                where: {
                    serie: serial
                }
            }
        );


        res.send("Disponibilidad actualizada correctamente");


    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió un error al actualizar la disponibilidad."
        });
    }


}


//UPDATE WATCH


//CREATE WATCH



exports.createStoreProduct = async (req, res) => {
    try {
        const user = JSON.parse(req.body.user)
        if (!req.body) {
            return res.status(400).send({ message: "Faltan los datos para crear el producto" })
        }

        

        const data = req.body


        const existingProduct = await Store.Watchmaking.findOne({
            where: {
                serie: data.serie // Busca un producto cuya serie coincida
            }
        });

        if (existingProduct) {
            // Si el producto ya existe, devuelve un error 409 Conflict
            return res.status(409).send({
                message: `El producto con la serie ${data.serie} ya existe en la base de datos.`
            });
        }


        const newProduct = await Store.Watchmaking.create({
            serie: data.serie,
            nombre: data.name,
            titulo: data.name,
            contenidoTabla: data.tableContent,
            coleccion: data.brand,
            precio: data.price,
            cantidadImagenes: data.imageCount,
            cantidad: 999,
            disponible: 1,
            tudorCollectionId: parseInt(data.tudorCollectionId),
            descripcion: data.description
        })

        if (newProduct) {
            return res.status(201).send({ message: "Producto Creado correctamente" })
        }






    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating the Store Product." })
    }
}


