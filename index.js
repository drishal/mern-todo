const express = require('express')
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todo-app");
mongoose.connection.on("connected", () => {
	console.log("DB CONNECTED");
});
mongoose.set('strictQuery', false);

// Create a new Mongoose schema for tasks
const taskSchema = new mongoose.Schema({
    name: String,
    completed: Boolean
})

// Create a Mongoose model for tasks
const Task = mongoose.model('Task', taskSchema)
module.exports = {Task};

const app = express()

app.use(express.json())
// Create a new task
app.post('/tasks', (req, res) => {
  const task = new Task(req.body)
  task.save()
	.then(() => res.send(task));
  console.log(req.body)
})

// Read a task by id
app.get('/tasks/:id', (req, res) => {
  Task.findById(req.params.id)
    .then(task => res.send(task))
})

// Show all tasks
app.get('/tasks', (req, res) => {
  Task.find({}, 'name completed')
    .then(tasks => res.send(tasks))
})

// Update a task
app.put('/tasks/:id', (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(200))
})

// Update a task and mark it as completed
app.put('/tasks/:id/complete', (req, res) => {
  Task.findByIdAndUpdate(req.params.id, { completed: true })
    .then(() => res.sendStatus(200))
})

// Delete a task by id
app.delete('/tasks/:id', (req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(200))
})

app.listen(3000)
