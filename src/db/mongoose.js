const mongoose = require('mongoose')

const DATA_SOURCE = process.env.DATA_SOURCE || "mongodb://azon_dev:Azon_Dev_*@localhost:27019/azon_db"

mongoose.connect(DATA_SOURCE, {useUnifiedTopology:true, useNewUrlParser:true, useCreateIndex:true})
  .then(res => {
    console.log("DATABASE CONNECTED")
  })
