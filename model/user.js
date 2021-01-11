
require('dotenv').config();
const mongoose = require('mongoose');
const becrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Schema for user
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: false
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch(err){
        console.log('err :>> ', err);
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log('this.password :>> ', this.password);
        this.password = await becrypt.hash(this.password, 10);;
    }
    next();
});

//Creating the collection Address
const User = mongoose.model('User', userSchema);
module.exports = User;