module.exports = app =>{
    const rolex = require('../controllers/rolexController')
    var router = require("express").Router()
    
    // Routes
    router.get("/collection/:id/", rolex.getCollectionDetailsV2)

    router.get("/rolex/getAll/:page", rolex.getAllPaginatedRolexV2)
    router.get("/rolex/getAllCollections", rolex.getAllRolexCollections)
    router.get("/rolex/get10Random", rolex.get10RandomRolex)
    router.get("/rolex/:id", rolex.getRolexDetailsV2)

    router.get("/rolex-accesories/getAll",rolex.getAllAccesories)

    router.get("/rolex-accesories/get/:id",rolex.getAccesoriesById)
    app.use('/api/v2',router)
}