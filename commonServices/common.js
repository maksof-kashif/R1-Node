common = module.exports = {};
const usersDb = require('../schema/user_schema');
const sessionDb = require('../schema/session_schema');
const nodemailer = require("nodemailer");

common.required = function (value) {
    var result = false;
    if (value != '' && value != undefined && value != null) result = true;
    return result;
}

common.stringGen = function () {
    var text = "";
    var len = 50;
    var char_list =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++) {
        text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
}

common.checkURLOfImage = function (url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

common.validateEmail = function (email) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
}

common.validateEmail = function (email) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
}

common.validatePassword = function (pass) {
    console.log(pass.length > 5);
    if (pass.length > 5) return true;
    else return false;
}

common.validatePhoneNumber = function (number) {

    var num = /^[0-9]\d*$/g;

    if (number.match(num)) {
        return false;
    } else {
        return true;
    }
}

common.returnUserDetails = async (req, res) => {
    var token = req.headers.authorization;
    var resData = await sessionDb.find({ session_token: token });
    if (resData.length > 0) {
        var userData = await usersDb.find({ _id: resData[0].user_id });
        return { user_id: userData[0]._id, role: userData[0].role, first_name: userData[0].first_name, last_name: userData[0].last_name }
    } else return res.json({
        status: -1,
        msg: "Invalid session token."
    })
}

common.returnUserDetailsIfDataPass = async (data) => {
    var token = data.token;
    var resData = await sessionDb.find({ session_token: token });
    if (resData.length > 0) {
        var userData = await usersDb.find({ _id: resData[0].user_id });
        return { user_id: userData[0]._id, role: userData[0].role, first_name: userData[0].first_name, last_name: userData[0].last_name, error: false }
    } else {
        return {error: true};
    }
}

common.changePasswordEmail = function (email, code) {
    try{
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'minhaj123technado@gmail.com',
                    pass: 'geeks&bachelors',
                },
            });
            var html = "<P>Please change your password by click on this link</p><br> <a> http://localhost:4200/reset-password?code=" + code + "</a>"
            transporter.sendMail({
                from: '"minhaj123technado@gmail.com',
                to: email,
                subject: "Change Password Email",
                html: html
            }, (error, result) => {
                if (error) {
                    console.log("error is " + error);
                    resolve(false);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                }
            })
        })
    } catch(e){
        return false;
    }
}