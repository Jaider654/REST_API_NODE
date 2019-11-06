const express = require('express')
const { User } = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const app = express.Router()

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.status(200).send({OK:true, user, token})
    } catch (error) {
        res.status(400).send({OK:false, error})
    } 
})

app.post('/users', async (req, res) => {

    const { user } = req.body
    const newUser = new User(user)
    try {
        const userSaved = await newUser.save()
        const token = await userSaved.generateAuthToken()
        res.status(201).send({OK:true, userSaved, token})
    } catch (error) {
        res.status(400).send({OK:false, error})           
    }
})


app.post('/users/logout', auth  ,async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter( token => token.token !== req.token ) 
        await req.user.save()
        res.send({OK:true, msg:'Logged out correctly'})
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/users/me', auth ,async (req, res) => {
    res.send(req.user)
})

app.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({OK:false, error:error.message})
})

app.delete('/user/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    const user = await req.user.save()
    res.status(200).send({OK:true, user})
})


app.patch('/users/me', auth, async(req, res) => {

    const { user } = req.body
    const updates = Object.keys(user)
    const validUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every(update => validUpdates.includes(update) )

    if(!isValidOperation){
        return res.status(400).send({OK:false, error:'There was an error trying to update the row'})
    }

    try {
        updates.forEach(update => req.user[update] = req.body.user[update])
        await req.user.save()
        res.status(200).send({OK:true, user: req.user})
    } catch (error) {
        res.status(400).send({OK:false, error})                   
    }
})

app.delete('/users/me', auth ,async (req, res) => {
    
    try {
        await req.user.remove()
        res.status(200).send({OK: true, user:req.user}) 
    } catch (error) {
        res.status(400).send({OK:true})
    }

})

module.exports = app 