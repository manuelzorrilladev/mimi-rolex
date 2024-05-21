const payment = require('../middleware/cybersource')
const config = require('../config/cybersource.config');
const cybersourceRestApi = require('cybersource-rest-client');
const { request } = require('express');

const db = require("../models");
const Store = db.store;



exports.paymentAuthenticationStep1 = async (req, res) => {
	if (!req.body) {
		res.status(500).send('Debes enviar el pago')
		return
	}
	// user info setup
	const userId = parseInt(req.params.id)


	let info = {
		"clientReferenceInformationCode": req.body.code,

		"paymentInformationCardNumber": req.body.cardNumber,
		"paymentInformationCardExpirationMonth": req.body.cardExpirationMonth,
		"paymentInformationCardExpirationYear": req.body.cardExpirationYear,

	}

	try {
		var configObject = new config();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.PayerAuthSetupRequest();

		var clientReferenceInformation = new cybersourceRestApi.Riskv1decisionsClientReferenceInformation();
		clientReferenceInformation.code = info.clientReferenceInformationCode;
		var clientReferenceInformationPartner = new cybersourceRestApi.Riskv1decisionsClientReferenceInformationPartner();
		clientReferenceInformationPartner.developerId = '7891234';
		clientReferenceInformationPartner.solutionId = '89012345';
		clientReferenceInformation.partner = clientReferenceInformationPartner;

		requestObj.clientReferenceInformation = clientReferenceInformation;

		var paymentInformation = new cybersourceRestApi.Riskv1authenticationsetupsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Riskv1authenticationsetupsPaymentInformationCard();
		paymentInformationCard.number = info.paymentInformationCardNumber;
		paymentInformationCard.expirationMonth = info.paymentInformationCardExpirationMonth;
		paymentInformationCard.expirationYear = info.paymentInformationCardExpirationYear;
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;


		var instance = new cybersourceRestApi.PayerAuthenticationApi(configObject, apiClient);

		instance.payerAuthSetup(requestObj, function (error, data, response) {
			if (error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Setup Payer Auth : ' + JSON.stringify(response['status']));
			var responseData = JSON.parse(response['text'])
			res.send(responseData)
		});
	}
	catch (error) {
		console.log('\nException on calling the API : ' + error);
	}

}

exports.paymentAuthenticationStep2 = (req, res) => {
	if (!req.body) {
		res.status(500).send('Debes enviar el pago')
		return
	}
	// user info setup
	const userId = parseInt(req.params.id)


	let info = {
		"clientReferenceInformationCode": req.body.code,
		"orderInformationAmountTotal": req.body.total,
		"orderInformationAmountCurrency": 'USD',
		"orderInformationBillToFirstName": req.body.firstName,
		"orderInformationBillToLastName": req.body.lastName,
		"orderInformationBillToAddress": req.body.address,
		"orderInformationBillToCountry": req.body.country,
		"orderInformationBillToEmail": req.body.email,
		"orderInformationBillToPhoneNumber": req.body.phone,
		"paymentInformationCardNumber": req.body.cardNumber,
		"paymentInformationCardExpirationMonth": req.body.cardExpirationMonth,
		"paymentInformationCardExpirationYear": req.body.cardExpirationYear,
		"orderInformationBillToLocality": req.body.region,
		"documentId": req.body.documentId,
		"userId": userId,
		"fingerprintSessionId": req.body.deviceFingerPrintID,
		"ipAddress": req.body.ip,
		"authenticationTransactionId": req.body.authenticationTransactionId,
		"referenceId": req.body.referenceId,

	}


	if (req.body.country == 'US' || req.body.country == 'CA') {
		info.orderInformationBillToAdministrativeArea = req.body.region
		info.orderInformationBillToPostalCode = req.body.zip
		info.orderInformationBillToDistrict = req.body.region
		info.orderInformationBillToBuildingNumber = req.body.buildingNumber
	}

	try {
		// Create Config Object
		var configObject = new config();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CheckPayerAuthEnrollmentRequest();


		// Code reference 
		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = info.clientReferenceInformationCode;
		requestObj.clientReferenceInformation = clientReferenceInformation;

		// order amount setup
		var orderInformation = new cybersourceRestApi.Riskv1authenticationsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Riskv1authenticationsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = info.orderInformationAmountTotal;
		orderInformationAmountDetails.currency = info.orderInformationAmountCurrency;
		orderInformation.amountDetails = orderInformationAmountDetails;

		// Billing personal info setup
		var orderInformationBillTo = new cybersourceRestApi.Riskv1authenticationsOrderInformationBillTo();
		orderInformationBillTo.firstName = info.orderInformationBillToFirstName;
		orderInformationBillTo.lastName = info.orderInformationBillToLastName;
		orderInformationBillTo.address1 = info.orderInformationBillToAddress;
		orderInformationBillTo.country = info.orderInformationBillToCountry;
		orderInformationBillTo.email = info.orderInformationBillToEmail;
		orderInformationBillTo.phoneNumber = info.orderInformationBillToPhoneNumber;
		orderInformationBillTo.locality = info.orderInformationBillToLocality;
		if (req.body.country == 'US' || req.body.country == 'CA') {
			orderInformationBillTo.administrativeArea = info.orderInformationBillToAdministrativeArea;
			orderInformationBillTo.postalCode = info.orderInformationBillToPostalCode;
			orderInformationBillTo.district = info.orderInformationBillToDistrict;
			orderInformationBillTo.buildingNumber = info.orderInformationBillToBuildingNumber;
		}
		orderInformation.billTo = orderInformationBillTo;
		requestObj.orderInformation = orderInformation;

		// Card information setup
		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();

		paymentInformationCard.number = info.paymentInformationCardNumber;
		paymentInformationCard.expirationMonth = info.paymentInformationCardExpirationMonth;
		paymentInformationCard.expirationYear = info.paymentInformationCardExpirationYear;
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;

		var consumerAuthenticationInformation = new cybersourceRestApi.Riskv1decisionsConsumerAuthenticationInformation();
		consumerAuthenticationInformation.transactionMode = 'MOTO';
		consumerAuthenticationInformation.referenceId = info.referenceId;

		requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;


		var instance = new cybersourceRestApi.PayerAuthenticationApi(configObject, apiClient);

		instance.checkPayerAuthEnrollment(requestObj, function (error, data, response) {
			if (error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Check Payer Auth Enrollment : ' + JSON.stringify(response['status']));
			var responseData = JSON.parse(response['text'])
			console.log(responseData);
			res.send(responseData)

		});
	}
	catch (error) {
		console.log('\nException on calling the API : ' + error);
	}

}



exports.paymentCheck = async (req, res) => {
	// Check if request has body
	if (!req.body) {
		res.status(500).send('Debes enviar el pago')
		return
	}
	// user info setup
	const userId = parseInt(req.params.id)

	let info = {
		"clientReferenceInformationCode": req.body.code,
		"orderInformationAmountTotal": req.body.total,
		"orderInformationAmountCurrency": 'USD',
		"orderInformationBillToFirstName": req.body.firstName,
		"orderInformationBillToLastName": req.body.lastName,
		"orderInformationBillToAddress": req.body.address,
		"orderInformationBillToCountry": req.body.country,
		"orderInformationBillToEmail": req.body.email,
		"orderInformationBillToPhoneNumber": req.body.phone,
		"paymentInformationCardNumber": req.body.cardNumber,
		"paymentInformationCardExpirationMonth": req.body.cardExpirationMonth,
		"paymentInformationCardExpirationYear": req.body.cardExpirationYear,
		"orderInformationBillToLocality": req.body.region,
		"documentId": req.body.documentId,
		"transactionId": req.body.transactionId,
		"referenceId": req.body.referenceId,
		"signedPares": req.body.signedPares,
		"cavv": req.body.cavv,
		"xid": req.body.xid,
		"ecommerceIndicator": req.body.ecommerceIndicator,
		"ucafCollectionIndicator": req.body.ucafCollectionIndicator,
		"ucafAuthenticationData": req.body.ucafAuthenticationData,
		"veresEnrolled": req.body.veresEnrolled,
		"directoryServerTransactionId": req.body.directoryServerTransactionId,
	}

	

	if (req.body.country == 'US' || req.body.country == 'CA') {
		info.orderInformationBillToAdministrativeArea = req.body.region
		info.orderInformationBillToPostalCode = req.body.zip
		info.orderInformationBillToDistrict = req.body.region
		info.orderInformationBillToBuildingNumber = req.body.buildingNumber
	}



	try {
		// Create Config Object
		var configObject = new config();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();


		// Code reference 
		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = info.clientReferenceInformationCode;
		requestObj.clientReferenceInformation = clientReferenceInformation;


		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();

		processingInformation.ecommerceIndicator = info.ecommerceIndicator

		requestObj.processingInformation = processingInformation;


		// Card information setup
		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
		paymentInformationCard.number = info.paymentInformationCardNumber;
		paymentInformationCard.expirationMonth = info.paymentInformationCardExpirationMonth;
		paymentInformationCard.expirationYear = info.paymentInformationCardExpirationYear;
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;



		// order amount setup
		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = info.orderInformationAmountTotal;
		orderInformationAmountDetails.currency = info.orderInformationAmountCurrency;
		orderInformation.amountDetails = orderInformationAmountDetails;




		// Billing personal info setup
		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
		orderInformationBillTo.firstName = info.orderInformationBillToFirstName;
		orderInformationBillTo.lastName = info.orderInformationBillToLastName;
		orderInformationBillTo.address1 = info.orderInformationBillToAddress;
		orderInformationBillTo.country = info.orderInformationBillToCountry;
		orderInformationBillTo.email = info.orderInformationBillToEmail;
		orderInformationBillTo.phoneNumber = info.orderInformationBillToPhoneNumber;
		orderInformationBillTo.locality = info.orderInformationBillToLocality;
		if (req.body.country == 'US' || req.body.country == 'CA') {
			orderInformationBillTo.administrativeArea = info.orderInformationBillToAdministrativeArea;
			orderInformationBillTo.postalCode = info.orderInformationBillToPostalCode;
			orderInformationBillTo.district = info.orderInformationBillToDistrict;
			orderInformationBillTo.buildingNumber = info.orderInformationBillToBuildingNumber;
		}
		orderInformation.billTo = orderInformationBillTo;
		requestObj.orderInformation = orderInformation;



		// Device fingerprint information, required by cybersource
		var deviceInformation = new cybersourceRestApi.Riskv1decisionsDeviceInformation();
		deviceInformation.fingerprintSessionId = req.body.deviceFingerPrintID
		deviceInformation.ipAddress = req.body.ip;
		requestObj.deviceInformation = deviceInformation;


		// Merchant Defined Data (MDD) information, required by cybersource

		var merchantDefinedInformation = new Array();
		var merchantDefinedInformation1 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation1.key = '1';
		merchantDefinedInformation1.value = 'bc_5808459559';
		merchantDefinedInformation.push(merchantDefinedInformation1);

		var merchantDefinedInformation2 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation2.key = '2';
		merchantDefinedInformation2.value = 'WEB';
		merchantDefinedInformation.push(merchantDefinedInformation2);

		var merchantDefinedInformation3 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation3.key = '3';
		merchantDefinedInformation3.value = info.clientReferenceInformationCode;
		merchantDefinedInformation.push(merchantDefinedInformation3);


		var merchantDefinedInformation4 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation4.key = '4';
		merchantDefinedInformation4.value = 'P-3DS Joyeria';
		merchantDefinedInformation.push(merchantDefinedInformation4);

		var merchantDefinedInformation5 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation5.key = '5';
		merchantDefinedInformation5.value = 'INVERSIONES MIMI, C.A.';
		merchantDefinedInformation.push(merchantDefinedInformation5);


		var merchantDefinedInformation6 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation6.key = '6';
		merchantDefinedInformation6.value = '5094 Precious Stones/Metals/Jewe';
		merchantDefinedInformation.push(merchantDefinedInformation6);


		var merchantDefinedInformation7 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation7.key = '7';
		merchantDefinedInformation7.value = req.body.documentId;
		merchantDefinedInformation.push(merchantDefinedInformation7);


		var merchantDefinedInformation8 = new cybersourceRestApi.Riskv1decisionsMerchantDefinedInformation();
		merchantDefinedInformation8.key = '8';
		merchantDefinedInformation8.value = 'NO';
		merchantDefinedInformation.push(merchantDefinedInformation8);

		requestObj.merchantDefinedInformation = merchantDefinedInformation;

		var consumerAuthenticationInformation = new cybersourceRestApi.Ptsv2paymentsConsumerAuthenticationInformation();
		consumerAuthenticationInformation.transactionId = info.transactionId;
		// consumerAuthenticationInformation.signedPares = info.signedPares;
		consumerAuthenticationInformation.cavv = info.cavv
		consumerAuthenticationInformation.xid = info.xid
		consumerAuthenticationInformation.ecommerceIndicator= req.body.ecommerceIndicator,
		consumerAuthenticationInformation.ucafCollectionIndicator= req.body.ucafCollectionIndicator,
		consumerAuthenticationInformation.ucafAuthenticationData= req.body.ucafAuthenticationData,
		consumerAuthenticationInformation.veresEnrolled= req.body.veresEnrolled,
		consumerAuthenticationInformation.directoryServerTransactionId= req.body.directoryServerTransactionId,
		requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;

		var tokenInformation = new cybersourceRestApi.Ptsv2paymentsTokenInformation();
		tokenInformation.transientTokenJwt = process.env.SECRET_KEY;
		requestObj.tokenInformation = tokenInformation;
		var instance = new cybersourceRestApi.PayerAuthenticationApi(configObject, apiClient);
		var instance2 = new cybersourceRestApi.PaymentsApi(configObject, apiClient);


		console.log("//////////////////////////////");
		console.log(requestObj);
		console.log("//////////////////////////////");
	
		
		instance2.createPayment(requestObj, async function (error, data, response) {
			console.log('++++++++++++++++++++++');
			payStatus = JSON.parse(response['text'])
			console.log('++++++++++++++++++++++');
			console.log(payStatus);
			console.log('++++++++++++++++++++++');
			console.log(JSON.parse(response["text"]));
			res.send(payStatus)


			// if (payStatus.status == 'AUTHORIZED') {
			// 	console.log('+++++++++++++++++++++++');


			// 	const cartId = await Store.Cart.findAll({
			// 		where: {
			// 			ownerId: userId,
			// 		},
			// 		attributes: ['id']
			// 	})

			// 	console.log('1+++++++++++++++++++++++');

			// 	Store.CartProduct.findAll({
			// 		where: {
			// 			cartId: cartId[0].dataValues.id
			// 		}
			// 	})
			// 		.then(async (d) => {
			// 			console.log('2++++++++++++++++++++++');

			// 			const products = d


			// 			const createBill = await Store.Bill.create({
			// 				codigo: info.clientReferenceInformationCode,
			// 				direccion: info.orderInformationBillToAddress,
			// 				pais: info.orderInformationBillToCountry,
			// 				ciudad: info.orderInformationBillToLocality,
			// 				total: `${info.orderInformationAmountTotal}`,
			// 				ownerId: userId
			// 			})
			// 			const data = []
			// 			for (let item = 0; item < products.length; item++) {
			// 				data.push({})
			// 				for (const key in products[item].dataValues) {

			// 					if (key !== "cartId") {
			// 						data[data.length - 1][key] = products[item].dataValues[key]
			// 					} else {
			// 						data[data.length - 1]["billId"] = createBill.dataValues.id
			// 					}
			// 				}
			// 			}

			// 			return data
			// 		})

			// 		.then((d) => {

			// 			console.log('6++++++++++++++++++++++');
			// 			Store.BillProduct.bulkCreate(d).then((result) => {
			// 				console.log(result, 'done');
			// 			})
			// 		})
			// 		.then((d) => {

			// 			console.log('7++++++++++++++++++++++');
			// 			Store.CartProduct.destroy({
			// 				where: {
			// 					cartId: cartId[0].dataValues.id
			// 				}
			// 			})
			// 		})
			// 		.then(() => res.redirect("/api/paymail/" + info.clientReferenceInformationCode))
			// 		.catch((error) => {

			// 			console.log(error);
			// 			res.sendStatus(500).send(error)
			// 		})



			// }
			// else {
			// 	res.sendStatus(400).send(payStatus)
			// }


		})









	}
	catch (error) {
		console.log('\nException on calling the API : ' + error);
	}

}


