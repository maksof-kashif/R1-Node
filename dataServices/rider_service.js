var geodist = require('geodist');
var geoip = require('geoip-lite');
const usersDb = require('../schema/user_schema');
const sessionDb = require('../schema/session_schema');
const locationDb = require('../schema/location_schema');


var commonServices = require('../commonServices/common');

exports.getRidersUnderFiveKM = async (req, res, cb) => {
    try {
        var user = await commonServices.returnUserDetails(req, res);
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        // if (ip == '::1') {
        //     cb("Invalid ip address found please")
        // } else {
        
        // var geo = geoip.lookup(ip);
        
        // var normalUserLat = geo.ll[0], normalUserLon = geo.ll[1];
        
        // var dist = geodist({ lat: 45.4891452, lon: 4.5188533 }, { lat: geo.ll[0], lon: geo.ll[1] });
        // console.log(dist);
        var res = await locationDb.aggregate([
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [-81.093699, 32.074673]
                    },
                    "maxDistance": 5000,
                    "spherical": true,
                    "distanceField": "distance",
                    "distanceMultiplier": 0.000621371,
                    // "distanceMultiplier": 6378.1
                }
            }
        ])
        console.log(res);
        // }
    } catch (e) {
        console.log(e);
        cb(e);
    }
}