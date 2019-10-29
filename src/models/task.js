const mongoose = require('mongoose')

const taskSchema =  mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    completed: {
        type:Boolean,
        default:false,
        required:true
    }
})

taskSchema.pre('save', async function(next){
    console.log('Just before saving')
    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = { Task }