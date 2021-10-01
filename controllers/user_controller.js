var userService = require('../dataServices/user_service');
var commonServices = require('../commonServices/common');

exports.signup = async (req, res) => {
    try {

        var body = req.body;

        if (!commonServices.required(body.email)) return res.json({
            status: 0,
            msg: 'Email is missing.'
        })

        if (!commonServices.validateEmail(body.email)) return res.json({
            status: 0,
            msg: 'Invalid email address.'
        })

        if (!commonServices.required(body.password)) return res.json({
            status: 0,
            msg: 'Password is missing.'
        })

        if (!commonServices.validatePassword(body.password)) return res.json({
            status: 0,
            msg: 'Password must be of six digits'
        })

        if (!commonServices.required(body.first_name)) return res.json({
            status: 0,
            msg: 'First Name is missing.'
        })

        if (!commonServices.required(body.phone_number)) return res.json({
            status: 0,
            msg: 'Phone number is missing.'
        })

        if (!commonServices.required(body.role)) return res.json({
            status: 0,
            msg: 'Role is missing.'
        })

        userService.signup(req.body, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "Join Successfully."
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.login = async (req, res) => {
    try {

        var body = req.body;

        if (!commonServices.required(body.email)) return res.json({
            status: 0,
            msg: 'Email is missing.'
        })

        if (!commonServices.validateEmail(body.email)) return res.json({
            status: 0,
            msg: 'Invalid email address.'
        })

        if (!commonServices.required(body.password)) return res.json({
            status: 0,
            msg: 'Password is missing.'
        })

        if (!commonServices.validatePassword(body.password)) return res.json({
            status: 0,
            msg: 'Password must be of six digits'
        })

        userService.login(body, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "login Successfully."
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.getProfile = async (req, res) => {
    try {

        userService.getProfile(req, res, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "Data featched successfully."
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {

        userService.updateProfile(req, res, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "Data updated successfully."
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.forgotPassword = async (req, res) => {
    try {

        var body = req.body;

        if (!commonServices.required(body.email)) return res.json({
            status: 0,
            msg: 'Email is missing.'
        })

        if (!commonServices.validateEmail(body.email)) return res.json({
            status: 0,
            msg: 'Invalid email address.'
        })
        userService.forgotPassword(req, res, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "We have send you an email about change password. Please check your inbox."
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.verifyChangePassword = async (req, res) => {
    try {

        var body = req.body;

        if (!commonServices.required(body.email)) return res.json({
            status: 0,
            msg: 'Email is missing.'
        })

        if (!commonServices.validateEmail(body.email)) return res.json({
            status: 0,
            msg: 'Invalid email address.'
        })

        if (!commonServices.required(body.code)) return res.json({
            status: 0,
            msg: 'code is missing.'
        })

        if (!commonServices.required(body.password)) return res.json({
            status: 0,
            msg: 'Password is missing.'
        })

        if (!commonServices.validatePassword(body.password)) return res.json({
            status: 0,
            msg: 'Password must be of six digits'
        })

        userService.verifyChangePassword(body, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "Verified successfully."
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.otp = async(req, res) => {
    try {
        userService.otp(req, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "Successfully get all users"
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.verifyOtp = async(req, res) => {
    try {
        userService.verifyOtp(req, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                data: result,
                msg: "Successfully get all users"
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}

exports.setUserLocation = async(req, res) => {
    try {

        if (req.body.cordinates.length != 2) return res.json({
            status: 0,
            msg: 'Cordinates arry is missing.'
        })

        userService.setUserLocation(req, res, (error, result) => {
            if (error) return res.json({
                status: 0,
                msg: error
            })

            return res.json({
                status: 1,
                msg: "Location updated successfully."
            })
        })
    } catch (e) {
        console.log(e);
        return res.json({
            status: 0,
            msg: e
        });
    }
}