const mongoose = require("mongoose");
const { model, Schema } = mongoose
const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    confirmpassword: String
}, { timestamps: true })
const User = model('User', userSchema)
module.exports = User