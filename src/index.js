const express = require('express')
const POST = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.listen(PORT, (e) => {
    console.log(`Server is up on port ${e}`)
})

// const User = mongoose.model('User', {
//     name: {
//         type:String,
//         required:true,
//         trim:true
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     age: {
//         type:Number,
//         min:0
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true
//     }
// })

// const Task = mongoose.model('Task', {
//     description:{
//         type:String,
//         required:true
//     },
//     completed: {
//         type:Boolean,
//         default:false,
//         required:true
//     }
// })


