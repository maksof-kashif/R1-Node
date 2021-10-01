var walletService = require('../dataServices/wallet_service');
var commonServices = require('../commonServices/common');

exports.uploadBalance = async (req, res) => {
    try {

        var body = req.body;

        if (!commonServices.required(body. body.amount)) return res.json({
            status: 0,
            msg: 'Amount is missing.'
        })
        
        if (!commonServices.required(body. body.stripeToken)) return res.json({
            status: 0,
            msg: 'Stripe token is missing.'
        })
        
        walletService.uploadBalance(req, res, (error, result) => {
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