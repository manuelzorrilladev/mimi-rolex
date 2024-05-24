const uploadFiles = require("../middleware/store")



module.exports = app =>{
    const payment = require('../controllers/paymentController')
    var router = require("express").Router()
    
    // Routes
    router.post("/payment/:id",uploadFiles.any() ,payment.paymentAuthenticationStep1)

    router.post("/enroll-payment/:id", uploadFiles.any(), payment.paymentAuthenticationStep2)
    router.post("/pay-with-data/:id", uploadFiles.any(), payment.paymentCheck)
    router.post("/validation-step/", uploadFiles.any(), payment.paymentAuthenticationStep4)
    router.post("/validate-auth/:id", uploadFiles.any(), payment.validationReturn)
    // router.get("/payment/:id/bill",payment.createBill)


    app.use('/api',router)
// 
}