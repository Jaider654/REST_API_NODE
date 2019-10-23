const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    age: {
        type:Number,
        min:0,
        default:0
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
})

module.exports = { User }