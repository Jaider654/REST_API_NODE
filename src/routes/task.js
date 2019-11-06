const express = require('express')
const { Task } = require('../models/task')
const auth = require('../middleware/auth')
const app = express.Router()

app.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body.task, 
        owner: req.user._id 
    })

    try {
        await task.save()
        res.status(201).send({OK:true, task })
    } catch (error) {
        res.status(400).send({OK:false, error})   
    }

})


app.patch('/tasks/:id', auth, async (req, res) => {
    const { id } = req.params
    const { task } = req.body
    const updates = Object.keys(task)
    const validUpdates =  ['description', 'completed']
    const isValidOperation = updates.every(update => validUpdates.includes(update)) 

    if(!isValidOperation){
      return res.status(400).send({OK:true, mgs:'There is a field you can not update'})
    }

    try {
        const task = await Task.findOne({_id: id, owner: req.user._id})
        if(!task){
            return res.status(404).send({OK:false, msg:'Task not found'})
        }
        updates.forEach(update => task[update] = req.body.task[update])
        await task.save()
        res.status(200).send({OK:true, task})

    } catch (error) {
        res.status(400).send({OK:false, error})   
    }

})

app.get('/tasks/:id', auth, async (req, res) => {
    
    const { id } = req.params

    try {
        const task = await Task.findOne({_id: id, owner:req.user._id})
        
        if(!task){
            return res.status(404).send({OK:false, msg:'There is no records whit this id'})
        }
        res.status(200).send({OK:true, task})
    } catch (error) {
        res.status(400).send({OK:false, error})
    }

})

app.get('/tasks', auth, async (req, res) => {
    
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
       const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
    }

    try {
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        
        res.status(200).send({OK:true, tasks: req.user.tasks})
    } catch (error) {
        res.status(400).send({OK:false, error})
    }

})


app.delete('/tasks/:id', auth ,async (req, res) => {
    const { id } = req.params

    try {
        const task = await Task.findOneAndDelete({_id:id, owner:req.user._id})

        if(!task){
            return res.status(404).send({OK:true, msg:'Unable to remove a task with this id'})
        }

        res.status(200).send({OK:true, task})
    } catch (error) {
        res.status(400).send({OK:false, error})  
    }
})


module.exports = app 