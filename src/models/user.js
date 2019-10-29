const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
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
    }, 
    tokens: [
        {
            token: {
                type: String,
                required:true
            }
        }
    ]
})


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login, [EMAIL]')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login [PASSWORD]')
    }

    return user

}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign( { _id: user._id.toString() } ,'thisismynewcourse')
    user.tokens = [...user.tokens, ...[{token}]]
    await user.save()
    return token
}

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = { User }