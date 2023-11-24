const express = require('express')
const { User } = require('../models/user')
const { File } = require('../models/file')
const auth = require('../middleware/auth')
const multer = require('multer')
const app = express.Router()

const upload = multer({
  limits: {
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error('Please upload an image or pdf file'))
    }

    cb(undefined, true)
  }
})

app.post('/files', auth, upload.single('file'), async (req, res) => {
  console.log("Entró")
  try {
    const { name } = req.body
    const file = new File({ 
      name, 
      owner:        req.user._id, 
      file:         req.file.buffer, 
      originalname: req.file.originalname,
      encoding:     req.file.encoding,
      mimetype:     req.file.mimetype,
    })    
    await file.save()
    res.send(file)
  } catch (error) {
    res.status(400).send({ OK: false })
  }
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

app.get('/files/user', auth, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id })
    res.send(files)
  } catch(error) {
    res.status(400).send({ error: error.message })
  }
})

app.get('/files/:id', async (req, res) => {
  const { id } = req.params
  try {
    const file = await File.findById(id)
    if (!file) {
      throw new Error('File not found')
    }
    res.set('Content-Type', file.mimetype)
    res.send(file.file)
  } catch (error) {
    res.status(400).send({ error })
  }
})

module.exports = app 