const express = require('express');
const app = express();
require("./db/mongoose.js");
const User = require("./models/users.js");
const Task = require("./models/tasks.js");

const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req,res)=>{
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch(ex) {
        res.status(400).send(ex);
    }  
});

app.get("/users", async(req, res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch(ex) {
        res.status(400).send(ex);
    }
});

app.get("/users/:id", async(req, res)=>{
    const _id = req.params.id;
    
    try {
        const user = await User.findById(_id);
        if(user) {
            res.send(user);
        } else {
            res.status(404).send();
        }
    } catch(ex) {
        res.status(500).send(ex);
    }
});

app.patch("/users/:id", async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {"new":true, "runValidators": true});
        if(!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch(ex) {
        res.status(400).send(ex);
    }
})

app.get("/tasks", async(request, response) => {

    try {
        const task = await Task.find({});
        response.send(task);
    } catch(ex) {
        response.status(400).send(ex);
    }
});

app.post("/tasks", async(request, response) => {
    const task = new Task(request.body);
    try {
        await task.save();
        response.send(task);
    } catch(ex) {
        response.status(400).send(ex);
    }
});

app.get("/tasks/:id", async(req,res)=>{
    try {
        const _id = req.params.id;
        const task = await Task.findById(_id);
        if(task) {
            res.send(task);
        } else {
            res.status(400).send();
        }
    } catch(ex) {
        res.send(400).send(ex);
    }
})


app.listen(port, ()=>{
    console.log("express is up and running");
})