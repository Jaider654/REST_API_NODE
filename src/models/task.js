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
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
}, {
    timestamps: true
})

taskSchema.pre('save', async function(next){
    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = { Task }