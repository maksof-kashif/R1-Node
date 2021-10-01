var express = require('express');
var Route = express.Router();
var riderController = require('../controllers/rider_controller');

var router = function() {
    Route.post('/getRidersUnderFiveKM', riderController.getRidersUnderFiveKM);
    return Route
}

module.exports = router();