var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var Stocks = new Schema({
        ticker: String,
        priceHistory: { Date: Date, Open: Number, High: Number, Low: Number, Last: Number, Close: Number},
        createdDate: Date,
        updatedDate: Date
    },
    {
        toObject: {
            transform: function (doc, ret) {
                delete ret._id;
            }
        },
        toJSON: {
            transform: function (doc, ret) {
                delete ret._id;
            }
        }
    });

mongoose.model( 'stocks_info', Stocks );
mongoose.connect( 'mongodb://raunak_singha:pizzaraunak1212@ds223009.mlab.com:23009/stocks' );
var db = mongoose.connection;

db.on('error', function(err) {
    console.error("Error while connecting to DB: " + err.message);
});
db.once('open', function() {
    console.log('DB connected successfully!');
});

exports.db = db;