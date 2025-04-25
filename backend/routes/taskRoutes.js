const express = require("express")
const router = express.Router()
const Task = require("../models/Task")
const { auth } = require("../middleware/auth")

// Get all tasks for the current user
router.get("/", async (req, res) => {
  try {
    // In a real app with proper auth, you would use req.user.id
    // For now, we'll return all tasks
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    console.error("Error fetching tasks:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Get a specific task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // In a real app, verify the task belongs to the current user
    // if (task.user.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized" })
    // }

    res.json(task)
  } catch (err) {
    console.error("Error fetching task:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Create a new task
router.post("/", async (req, res) => {
  try {
    // In a real app with proper auth, you would set user: req.user.id
    // For now, we'll use a placeholder user ID
    const newTask = new Task({
      ...req.body,
      user: "64f5a53e9d312a1f34b5f7e1", // Placeholder user ID
    })

    await newTask.save()
    res.status(201).json(newTask)
  } catch (err) {
    console.error("Error creating task:", err)
    res.status(500).json({ message: "Server Error: " + err.message })
  }
})

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // In a real app, verify the task belongs to the current user
    // if (task.user.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized" })
    // }

    // Update task fields
    Object.keys(req.body).forEach((key) => {
      // Don't allow updating the user field
      if (key !== "user") {
        task[key] = req.body[key]
      }
    })

    await task.save()
    res.json(task)
  } catch (err) {
    console.error("Error updating task:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // In a real app, verify the task belongs to the current user
    // if (task.user.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized" })
    // }

    await Task.deleteOne({ _id: req.params.id })
    res.json({ message: "Task deleted successfully" })
  } catch (err) {
    console.error("Error deleting task:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router
