const uploadFiles = require("../middleware/store")
const existenceMiddleware = require("../middleware/verifyExistence")
const express = require('express')
const isAdmin = require("../middleware/isAdmin")

module.exports = app => {
    const store = require('../controllers/adminController')
    const update = require('../controllers/storeUpdateController')
    var router = express.Router()

    
    router.post("/get-all",express.json(), isAdmin, store.findAllWatches)

    
    router.post("/messages/get-all",express.json(), isAdmin, store.findAllMessages)
    router.post("/messages/rolex-get-all",express.json(), isAdmin, store.findAllMessagesRolex)
    


   //update

    router.post("/update/store-analytics", express.json(), isAdmin, update.getStoreAnalytics)
    router.post("/update/store-single-availability", express.json(), isAdmin, update.updateSingleAvailability)
    router.post("/update/store-availability", express.json(), isAdmin, update.updateStoreAvailability)
    router.post("/update/store-availability-single", express.json(), isAdmin, update.updateStoreAvailabilitySingle) //funciona
    router.post("/update/store-availability-single-collection", express.json(), isAdmin, update.updateStoreAvailabilitySingleCollection) // da error de cors

    
 

    //Create and update single
    router.post("/create/store-product",isAdmin, uploadFiles.array('imagenes'), update.createStoreProduct)



    app.use('/api/admin', router)



}