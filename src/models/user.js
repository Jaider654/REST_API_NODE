const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Task } = require('./task')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true,
        uppercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
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
    ],
    avatar: {
        type:Buffer
    }
}, {timestamps: true})


userSchema.virtual('tasks', {
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
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
    const token = jwt.sign( { _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = [...user.tokens, ...[{token}]]
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = { User }