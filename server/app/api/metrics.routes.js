const isAdmin = require("../middleware/isAdmin")
const express = require('express')


module.exports = app => {
    const controller = require('../controllers/metricsController')

    var router = require("express").Router()

    // Routes (/metrics)
    router.post("/metrics/ingest", express.json(), controller.ingest)
    router.post("/metrics/track-event", express.json(), controller.trackEvent)
    router.get('/admin/metrics/summary',isAdmin, controller.getDashboardStats);
    // router.get('/admin/metrics/chart',isAdmin, controller.getVisitsChart);
    router.get('/admin/metrics/events',isAdmin, controller.getEventStats);


    app.use('/api', router)


}