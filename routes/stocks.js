var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Stocks = mongoose.model('stocks_info');
var wait = require('wait-for-stuff');
var db = require('../db').db;
/**
 * Create Websocket client.
 */
var WebSocket = require('ws');
var connection = new WebSocket('ws://localhost:8000');
connection.once('open', function open() {
    console.log("Websocket client connected");
});
function stocklookup(req, res, next) {
    Stocks.find({ticker: req.params.id}, function(err, results) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({ errors: "Could not retrieve stock info" });
        }

        if ((results.length === 0)/* || (results[0].updatedDate !== Date.now())*/) {

            connection.once('error', function (error) {
                console.error('WebSocket Error ' + error);
            });

            connection.once('message', function (e) {
                console.log('message from server: ', e);
                //jsondata = e;
                req.data = JSON.parse(e);
                var newstock = new Stocks({
                    ticker: req.data.dataset.dataset_code,
                    priceHistory: {
                        Date: req.data.dataset.data[0][0],
                        Open: req.data.dataset.data[0][1],
                        High: req.data.dataset.data[0][2],
                        Low: req.data.dataset.data[0][3],
                        Last: req.data.dataset.data[0][4],
                        Close: req.data.dataset.data[0][5]
                    },
                    createdDate: req.data.dataset.start_date,
                    updatedDate: req.data.dataset.data[0][0]
                }).save(function(err, result) {
                    if (err) throw err;

                    if(result) {
                        console.log("Database updated");
                    }
                });
            });
            // get info from websocket
            connection.send(req.params.id);
            wait.for.time(5);
            //connection.close(200,"Thank you server");
        }
        else {
            req.data = results[0];
            console.log("Data already present in database");
        }
    }).then(function () {
        next()
    });
}
/* GET users listing. */
router.get('/:id', stocklookup, function(req, res, next) {
    res.send(req.data);

});

module.exports = router;