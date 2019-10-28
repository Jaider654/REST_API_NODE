const express = require('express')
const { User } = require('../models/user')
const app = express.Router()

app.post('/users', async (req, res) => {

    const { user } = req.body
    const newUser = new User(user)
    try {
        const userSaved = await newUser.save()
        res.status(201).send({OK:true, userSaved})
    } catch (error) {
        res.status(400).send({OK:false, error})           
    }
})

app.get('/users/:id', async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(id)

        if(!user){
            return res.status(404).send({OK:false, mgs:'No user with that id'})
        }

        res.status(200).send({OK:true, user})
    } catch (error) {
        res.status(400).send({OK:false, error})
    }
})

app.patch('/users/:id', async(req, res) => {

    const { id } = req.params
    const { user } = req.body
    const updates = Object.keys(user)
    const validUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every(update => validUpdates.includes(update) )

    if(!isValidOperation){
        return res.status(400).send({OK:false, error:'There was an error trying to update the row'})
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(id, user , {new:true, runValidators:true})
        res.status(200).send({OK:true, userUpdated})
    } catch (error) {
        res.status(400).send({OK:false, error})                   
    }
})

app.delete('/users/:id', async (req, res) => {
    
    const { id } = req.params
     try {
        const userDeleted = await User.findByIdAndDelete(id)

        if(!userDeleted){
            return res.status(404).json({OK:false, msg:'Unable to delete user with this id'})
        }

        res.status(200).send({OK: true, userDeleted}) 
     } catch (error) {
         res.status(400).send({OK:true})
     }

})

module.exports = app 