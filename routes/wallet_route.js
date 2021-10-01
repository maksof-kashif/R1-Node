var express = require('express');
var Route = express.Router();
var walletController = require('../controllers/wallet_controller');

var router = function() {
    Route.post('/uploadBalance', walletController.uploadBalance);
    return Route
}

module.exports = router();