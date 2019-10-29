const express = require('express')
const { Task } = require('../models/task')
const app = express.Router()

app.post('/tasks', async (req, res) => {

    const { description } = req.body.task

    const task = new Task({description})

    try {
        const taskSaved = await task.save()
        res.status(201).send(taskSaved)
    } catch (error) {
        res.status(400).send({OK:false, error})   
    }

})


app.patch('/task/:id', async (req, res) => {
    
    const { id } = req.params
    const { task } = req.body
    const updates = Object.keys(task)
    const validUpdates =  ['description', 'completed']
    const isValidOperation = updates.every(update => validUpdates.includes(update)) 

    if(!isValidOperation){
      return res.status(400).send({OK:true, mgs:'There is a field you can not update'})
    }

    try {

        // const taskUpdated = await Task.findByIdAndUpdate(id, task, {runValidators:true, new:true})
        const task = await Task.findById(id)
        updates.forEach(update => task[update] = req.body.task[update])
        
        const taskUpdated = await task.save()

        res.status(200).send({OK:true, taskUpdated})
    } catch (error) {
        res.status(400).send({OK:false, error})   
    }

})

app.get('/task/:id', async (req, res) => {
    
    const { id } = req.params

    try {
        const task = await Task.findById(id)
        if(!task){
            return res.status(404).send({OK:false, msg:'There is no records whit this id'})
        }
        res.status(200).send({OK:true, task})
    } catch (error) {
        res.status(400).send({OK:false, error})
    }

})


app.delete('/task/:id', async (req, res) => {
    const { id } = req.params

    try {
        const taskDeleted = await Task.findByIdAndDelete(id)

        if(!taskDeleted){
            return res.status(404).send({OK:true, msg:'Unable to remove a task with this id'})
        }

        res.status(200).send({OK:true, taskDeleted})
    } catch (error) {
        res.status(400).send({OK:false, error})  
    }
})


module.exports = app 