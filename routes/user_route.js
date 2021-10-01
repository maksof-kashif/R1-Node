var express = require('express');
var Route = express.Router();
var userController = require('../controllers/user_controller');

var router = function() {
    Route.post('/signup', userController.signup);
    Route.post('/login', userController.login);
    Route.get('/getProfile', userController.getProfile);
    Route.post('/updateProfile', userController.updateProfile);
    Route.post('/forgotPassword', userController.forgotPassword);
    Route.post('/verifyChangePassword', userController.verifyChangePassword);
    Route.post('/otp', userController.otp);
    Route.post('/verifyOtp', userController.verifyOtp);
    return Route
}

module.exports = router();