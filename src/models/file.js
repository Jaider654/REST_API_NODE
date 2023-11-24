const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: 'User'
  },
  originalname: {
    type: String,
    required: true,
    trim: true
  },
  encoding: {
    type: String,
    required: true,
    trim: true
  },
  mimetype: {
    type: String,
    required: true,
    trim: true
  },
  file: {
    type: Buffer
  }
}, { timestamps: true })

fileSchema.methods.toJSON = function () {
  const file = this
  const fileObject = file.toObject()
  delete fileObject.file
  return fileObject

}

const File = mongoose.model('File', fileSchema)

module.exports = { File }