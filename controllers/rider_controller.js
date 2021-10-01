var riderService = require('../dataServices/rider_service');
var commonServices = require('../commonServices/common');

exports.getRidersUnderFiveKM = async (req, res) => {
    try {
        // var body = req.body;
        // if (!commonServices.required(body.userLongitude)) return res.json({
        //     status: 0,
        //     msg: 'User longitude is missing.'
        // })
        
        // if (!commonServices.required(body.userlatitude)) return res.json({
        //     status: 0,
        //     msg: 'User latitude is missing.'
        // })

        riderService.getRidersUnderFiveKM(req, res, (error, result) => {
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