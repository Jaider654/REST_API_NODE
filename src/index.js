const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')
const app = express()
const PORT = process.env.PORT
app.use(express.json())

app.use(taskRouter)
app.use(userRouter)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
