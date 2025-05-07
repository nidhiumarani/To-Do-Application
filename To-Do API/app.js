const express = require('express');
const mongoose = require('mongoose');
const app = express();
const todos = require('./models/todo.model')
const port = 3000;

app.use(express.json()) // middleware 

// create a task
app.post('/todos/createTask', async (req, res) => {
  try{
    const task = req.body;
    const newTask = await todos.create(task);
    res.send({message: "task created successfully", task: newTask, success: true})
  } catch (error) {
    res.send({message: "Failed to create a task"})
  } 
});

// get all the tasks 
app.get('/todos/tasks', async (req, res) => {
  try {
    const allTodos = await todos.find({});
    res.send(allTodos);

  } catch (error) {
    res.send({message: "Error getting all the products"})
  }
})

// ruoute to find task usign its ID
app.get('/todos/taskById/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await todos.findById(taskId);
    res.send({message: "task found", task: task});
  } catch(error) {
    res.send({message: "Error getting the specific task"});
  }
})

// route to find data using task name
app.get('/todos/taskByName/:name', async (req, res) => {
 try {
  const { name } = req.params;
  const task = await todos.findOne({name: name});
  res.send({message: "task name found", task: task});
 } catch (error) {
  res.send({message: "Error fetching task name"});
 }
});

// marking task as complete 
app.post('/todos/markComplete', async (req, res) => {
  try {
    const { id }  = req.body;
    // console.log("ID : ", id)
    const filter = { _id: id };
    const update = { completed: true };
    const task = await todos.findOneAndUpdate(filter, update);
    res.send({success: true, task: task})
  } catch (error) {
    // console.log("Check", error)
    res.send({message: "Failed to mark complete"});
  }
});

// "app.listen" is a method of app object which starts the EXPRESS JS server
// console.log is just a console message stating that server has started and listning to requests
mongoose.connect("mongodb+srv://Admin:27Ynnp3vwCCZIYVA@backenddb.icqyros.mongodb.net/To_Do_DB?retryWrites=true&w=majority&appName=BackendDB")
.then(() => {
  console.log("Connected to Database");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})

.catch(() => {
  console.log("Error connecting to Database");
})
