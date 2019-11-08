const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')
const app = express()

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

module.exports = app