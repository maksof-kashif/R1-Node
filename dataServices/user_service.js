const usersDb = require('../schema/user_schema');
const sessionDb = require('../schema/session_schema');
const locationDb = require('../schema/location_schema');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('$encodeDecodeSecKeyYouCanChangeIt$');
const jwt = require('jsonwebtoken');
var commonServices = require('../commonServices/common');
const { find } = require('../schema/user_schema');
var formidable = require('formidable');
const fs = require("fs");
const path = require("path");

exports.signup = async (body, cb) => {
    try {
        var email = body.email.toLowerCase();
        var userRes = await usersDb.find({ email: email });
        if (userRes.length == 0) {
            var pass = cryptr.encrypt(body.password);
            var user = await new usersDb({first_name: body.first_name, last_name: body.last_name, email: body.email, role: body.role, phone_number: body.phone_number, password: pass}).save();
            if (user) {
                var userDetails = await usersDb.find({ email: email });
                var token = jwt.sign({ userId: userDetails[0]._id, firstName: userDetails[0].first_name, lastName: userDetails[0].last_name, email: userDetails[0].email, role: userDetails[0].role }, 'todo-app-super-shared-secret', { expiresIn: '5h' }, { algorithm: 'RS256' });
                var sessionSave = await new sessionDb({ session_token: token, user_id: userDetails[0]._id, role: userDetails[0].role }).save();
                if (sessionSave) {
                    var temp = {
                        user_id: userDetails[0].id,
                        first_name: userDetails[0].first_name,
                        last_name: userDetails[0].last_name,
                        email: userDetails[0].email,
                        phone_number: userDetails[0].phone_number,
                        role: userDetails[0].role,
                        address: userDetails[0].address,
                        wallet: userDetails[0].wallet,
                        token: token,
                    };
                    cb(null, temp);
                } else cb("Oops, somthing going on wrong when inserting session in db.", null);


            } else cb("Oops, somthing going on wrong when inserting user in db.", null);
        } else cb("Email already exists.", null);
    } catch (e) {
        console.log(e);
        cb(e);
    }
}

exports.login = async (body, cb) => {
    try {
        var email = body.email.toLowerCase();
        var userRes = await usersDb.find({ email: email });
        console.log(userRes);
        if (userRes.length != 0) {
            var pass = cryptr.decrypt(userRes[0].password);
            if (pass == body.password) {
                var token = jwt.sign({ userId: userRes[0]._id, firstName: userRes[0].first_name, lastName: userRes[0].last_name, email: userRes[0].email }, 'todo-app-super-shared-secret', { expiresIn: '1h' }, { algorithm: 'RS256' });
                console.log(token);
                var getSession = await sessionDb.find({ user_id: userRes[0]._id });
                console.log(getSession);
                if (getSession.length > 0) {
                    var updateSession = await sessionDb.updateOne({ _id: getSession[0]._id }, { session_token: token });
                    if (updateSession) {
                        return cb(null, {
                            user_id: userRes[0].id,
                            first_name: userRes[0].first_name,
                            last_name: userRes[0].last_name,
                            email: userRes[0].email,
                            phone_number: userRes[0].phone_number,
                            user_image: userRes[0].user_image,
                            wallet: userRes[0].wallet,
                            token: token
                        });
                    } else cb("Oops, somthing going on wrong when update session in db.", null);
                } else {
                    var updateSession = await new sessionDb({ session_token: token, user_id: userRes[0]._id, role: userRes[0].role }).save()
                    if (updateSession) {
                        return cb(null, {
                            user_id: userRes[0].id,
                            first_name: userRes[0].first_name,
                            last_name: userRes[0].last_name,
                            email: userRes[0].email,
                            phone_number: userRes[0].phone_number,
                            user_image: userRes[0].user_image,
                            wallet: userRes[0].wallet,
                            token: token
                        })
                    } else cb("Oops, somthing going on wrong when inserting session in db.", null);;
                }
            } else {
                return cb("Invalid password", null);
            }
        } else return cb("No user is found against this email address. Please check your email.", null);
    } catch (e) {
        console.log(e);
        return cb(e, null);
    }
}

exports.getProfile = async (req, res, cb) => {
    try {
        var user = await commonServices.returnUserDetails(req, res);
        var userId = user.user_id;
        var userData = await usersDb.find({ _id: userId });
        console.log(userData);
        if (userData.length > 0) {
            cb(null, { first_name: userData[0].first_name, last_name: userData[0].last_name, role: userData[0].role, email: userData[0].email, image: userData[0].image,  wallet: userData[0].wallet, });
        } else cb('Oops!, Something going on wrong when featch profile.');
    } catch (e) {
        console.log(e);
        return cb(e, null);
    }
}

exports.updateProfile = async (req, res, cb) => {
    try {
        var user = await commonServices.returnUserDetails(req, res);
        var userId = user.user_id;
        var body = req.headers;
        if (body.isimage == 'yes') {
            var imagePath = [];
            var form = new formidable.IncomingForm();
            var imgPath = path.join(__dirname + '/public/uploads');
            form.uploadDir = path.join(__dirname + '/public/uploads');
            form.on('file', function (field, images) {
                var altName = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < 32; i++) {
                    altName += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                imagePath.push(altName + images.name);
                fs.rename(images.path, path.join(form.uploadDir, altName + images.name), async function (error, results) {
                    if (error) return res.json({
                        status: 0,
                        msg: "Image not uploaded."
                    });
                    var imageUrl = 'dataServices/public/uploads/' + imagePath[0];
                    var userData = await usersDb.updateOne({ _id: userId }, { first_name: body.first_name, last_name: body.last_name, image: imageUrl });
                    if (userData) {
                        cb(null, 'Data has been updated successfully.');
                    } else cb('Oops!, Something going on wrong when updating profile.');
                });
            });
            form.parse(req);
        } else {
            var userData = await usersDb.updateOne({ _id: userId }, { first_name: body.first_name, last_name: body.last_name });
            if (userData) {
                cb(null, 'Data has been updated successfully.');
            } else cb('Oops!, Something going on wrong when updating profile.');
        }
    } catch (e) {
        console.log(e);
        return cb(e, null);
    }
}

exports.forgotPassword = async (req, res, cb) => {
    try {
        var body = req.body;
        var userId = user.user_id;
        var userData = await usersDb.find({ email: body.email })
        if (userData.length > 0) {
            var code = commonServices.stringGen();
            var saveCode = await usersDb.updateOne({ _id: userId }, { email_verification_code: code });
            console.log(saveCode);
            var sendEmail = commonServices.changePasswordEmail(body.email, code);
            if (sendEmail) {
                cb(null, "Email has been send.");
            } else cb('Oops!, something going on wrong.');
        } else cb('Oops!, Email not exist.');
    } catch (e) {
        console.log(e);
        return cb(e, null);
    }
}

exports.verifyChangePassword = async (body, cb) => {
    try {
        var userData = await usersDb.find({ email_verification_code: body.code });
        if (userData.length > 0) {
            var pass = cryptr.encrypt(body.password);
            var updatePassword = await usersDb.updateOne({ _id: userData[0]._id }, { password: pass, email_verification_code: '' });
            var deleteSession = await sessionDb.deleteOne({ user_id: userData[0]._id });
            console.log(deleteSession);
            if (updatePassword) {
                cb(null, "Password change successfully.");
            } else cb('Oops!, somthing going on wrong when update password');
        } else cb('Oops!, Your code is invalid.');
    } catch (e) {
        console.log(e);
        return cb(e, null);
    }
}

exports.otp = async (req, cb) =>{
    try{
        if (req.body.phonenumber) {
        client
        .verify
        .services("VA1a3289fab773f058b87360867ec76ac3")
        .verifications
        .create({
            to: `+${req.body.phonenumber}`,
            channel: req.body.channel==='call' ? 'call' : 'sms' 
        })
        .then(data => {
            console.log(data);
            cb(null, "Verification code has been sent!!")
        }) 
        } else {
            console.log("Wrong phone number");
            cb("Wrong phone number please enter Phone number with country code without + sign")
        }
    } catch(e){
        console.log(e);
        cb(e)
    }
}

exports.verifyOtp = async (req, cb) =>{
    try{
        if (req.body.phonenumber && req.body.code.length == 6) {
            client
                .verify
                .services("VA1a3289fab773f058b87360867ec76ac3")
                .verificationChecks
                .create({
                    to: `+${req.body.phonenumber}`,
                    code: req.body.code
                })
                .then(data => {
                    if (data.status === "approved") {
                        cb(null,"User is Verified!!");
                    }
                })
        } else {
            cb("Wrong phone number or code");
        }
    } catch(e){
        console.log(e);
        cb(e)
    }
}

exports.setUserLocation = async (req, res, cb) =>{
    try{
        var user = await commonServices.returnUserDetails(req, res);
        var userId = user.user_id;
        var body = req.body;
        body.user_id = userId;
        body.role = user.role;
        var userData = await locationDb.find({user_id: userId});
        if(userData.length > 0){
            var updateUserdata = await locationDb.updateOne({user_id: userId},body);
            if(updateUserdata) cb(null, "Location updated successfully.");
            else cb("Failed to update Location.");
        } else {
            var updateUserdata = await new locationDb(body);
            if(updateUserdata) cb(null, "Location updated successfully.");
            else cb("Failed to update Location.");
        }
    } catch(e){
        console.log(e);
        cb(e)
    }
}