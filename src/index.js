const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')
const app = express()
const PORT = process.env.PORT || 3000

const multer = require('multer')
const upload = multer({
    dest: 'src/upload/images',
    limits:{
        fileSize: 1000000
    }
})

app.post('/upload', upload.single('avatar'), (req, res) => {
    res.send()
})

app.use(express.json())

app.use(taskRouter)
app.use(userRouter)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
