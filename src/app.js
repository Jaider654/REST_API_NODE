const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')
const fileRouter = require('./routes/file')
const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/class-304', taskRouter)
app.use('/api/class-304', userRouter)
app.use('/api/class-304', fileRouter)

module.exports = app