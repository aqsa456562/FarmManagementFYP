const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
  completed: { type: Boolean, default: false },
  notes: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Update the updatedAt field before saving
TaskSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const Task = mongoose.model("Task", TaskSchema)
module.exports = Task
