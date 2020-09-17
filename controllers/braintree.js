const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();


// var gateway = new braintree.BraintreeGateway({
//     environment:  braintree.Environment.Sandbox,
//     merchantId:   'fdkwx94gcdy27v2m',
//     publicKey:    'x3dmrxnsfwbssrsb',
//     privateKey:   '871217f86dc78fefa4023959c3c21a02'
// });


var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Production
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
