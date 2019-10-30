const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use(taskRouter)
app.use(userRouter)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
