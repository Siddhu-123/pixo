const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    event: String,
    price: Number,
    from: String,
    to: String,
    date: Date,
    expirydate: Date,
});

const nftschema = new mongoose.Schema({
    transaction: [transactionSchema],
    _id: String,
    collections: String,
    collectionid: String,
    name: String,
    image: String,
    date: Date,
    description: String,
    traits: String,
    address: String,
    likes: [String],
    views: Number,
    image_features: String,
    __v: { type: Number, default: 0 }
});

const nftmodel = mongoose.model("nfts", nftschema);

module.exports = nftmodel;
