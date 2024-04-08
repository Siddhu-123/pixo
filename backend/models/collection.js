const { Decimal128, Double } = require('mongodb');
const mongoose = require('mongoose');

const collectionschema = new mongoose.Schema({
    _id:String,
    name: String,
    image: String,
    date: Date,
    description: String,
    category: String,
    address: String,
    likes:[String],
    nfts:[String],
})

const collectionmodel = mongoose.model("collections",collectionschema)
module.exports = collectionmodel