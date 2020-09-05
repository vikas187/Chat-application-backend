const express = require('express');
const app = express();
require("./db/mongoose.js");

const userRoute = require("./routers/routers-user");
const taskRoute = require("./routers/routers-tasks");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(port, ()=>{
    console.log("express is up and running");
})