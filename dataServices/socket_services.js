var userDb = require('../schema/user_schema');
var locationDb = require('../schema/location_schema');
var commonServices = require('../commonServices/common');

module.exports = function(io) {

    io.on('connect', async function(socket) {

        socket.on("updatesCordinates", async(data) => {
            var userData = await commonServices.returnUserDetailsIfDataPass(data);
            if(!userData.error){
                var locationData = locationDb.find({user_id: data.driverId});
                return io.emit('updatesCordinatesResponseSocket', {
                    status: 1,
                    data: locationData,
                    msg: "Data featched."
                })
            } else {
                return io.emit('updatesCordinatesResponseSocket', {
                    status: -1,
                    msg: "Faild to verify token."
                })
            }
        });
    });
}