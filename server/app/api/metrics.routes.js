const uploadFiles = require("../middleware/store")
const express = require('express')


module.exports = app => {
    const controller = require('../controllers/metricsController')

    var router = require("express").Router()

    // Routes (/metrics)
    router.post("/metrics/ingest", express.json(), controller.ingest) 
    router.post("/metrics/track-event", express.json(), controller.trackEvent) 




    //Create and update single
    // router.post("/create/store-product", uploadFiles.array('imagenes'), update.createStoreProduct)

    app.use('/api', router)


}