const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    _id:String,
    name: String,
    username: String,
    profileimage: String,
    backgroundimage: String,
    date: Date,
    bio: String,
    following: [String],
    followers: [String],
    email: String,
    instagram: String,
    twitter: String,
    website: String,
    collections: [String],
    cart: [String],
})

const usermodel = mongoose.model("users",userschema)
module.exports = usermodel