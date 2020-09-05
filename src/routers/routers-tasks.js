const express = require("express");
const router = new express.Router();
const Task = require('../models/tasks');
const auth = require('../middleware/auth');
const { Mongoose } = require("mongoose");
const User = require("../models/users");



router.get("/tasks/me", auth, async(req, res) => {
    const match = {};
    if(req.query.completed) {
        match.isCompleted = req.query.completed === 'true';
    }

    try {
        const user = await User.findById(req.user._id);
        await user.populate({
            path: 'tasks',
            match: match
        }).execPopulate();
        res.send(user.tasks);
    } catch(ex) {
        res.status(400).send(ex);
    }
});

router.post("/tasks", auth,  async(req, res) => {
    const task = new Task({
        ...req.body,
        'owner': req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch(ex) {
        res.status(400).send(ex);
    }
});

router.get("/tasks/:id", auth, async(req,res)=>{
    try {
        const _id = req.params.id;
        const task = await Task.findOne({_id: _id, 'owner': req.user._id});
        if(task) {
            res.send(task);
        } else {
            res.status(400).send();
        }
    } catch(ex) {
        res.send(400).send(ex);
    }
})




router.patch("/tasks/:id", auth, async(req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'isCompleted'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    try {
        if(isValidOperation) {
            const task = await Task.findOne({'_id': req.params.id, 'owner': req.user._id});
            
            
            if(!task) {
                res.status(404).send();
            }
            updates.forEach((update)=>{
                task[update] = req.body[update];
            });
            await task.save();
            res.send(task);
        } else {
            console.log(ex);
            res.status(400).send({error: "Invalid Update request"});
        }
    } catch(ex) {
        console.log(ex);
        res.status(400).send();
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({'_id': req.params.id, 'owner': req.user._id});
        if(!task) {
            res.status(400).send();
        }
        res.send("successfully deleted");
    } catch(ex){
        res.status(500).send(ex);
    }
});

module.exports = router;