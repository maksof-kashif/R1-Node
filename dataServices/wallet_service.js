const usersDb = require('../schema/user_schema');
const paymentDb = require('../schema/payments_schema');
var commonServices = require('../commonServices/common');
const stripe = require('stripe')(process.env.STRIPEKEY);

exports.uploadBalance = async (req, res, cb) => {
    try {
        var user = await commonServices.returnUserDetails(req, res);
        var userId = user.user_id;

        const response = await stripe.charges.create({
            amount: body.amount * 100,
            currency: 'USD',
            source: body.stripeToken
        })
        var paymentId = response.id;
        var balance_transaction = response.balance_transaction;
        var amount = response.amount / 100;
        var addBalance = await usersDb.updateOne({ _id: userId }, { $inc: { wallet: amount } })
        if (addBalance) {
            var payment = await new paymentDb({
                user_id: userId,
                txn: balance_transaction,
                payemt_id: paymentId,
                amount: amount
            }).save();
            console.log(payment);
            if (payment) cb(null, "Amount uploaded successfully.");
            else cb('Oops!, There is something wrong when inserting balance in payment section.');
        } else cb('Oops!, There is something wrong when updating balance in your account.');
    } catch (e) {
        console.log(e);
        return cb(e, null);
    }
}