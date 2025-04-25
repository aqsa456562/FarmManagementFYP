const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { auth, admin } = require("../middleware/auth")

// Register a new user
router.post("/register", async (req, res) => {
  const { fullName, email, password, confirmPassword, farmType, location } = req.body

  if (!fullName || !email || !password || !confirmPassword || !farmType || !location) {
    return res.status(400).json({ message: "Please fill in all fields", code: 400 })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match", code: 400 })
  }

  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists", code: 403 })
    }

    user = new User({
      fullName,
      email,
      password, // In a real app, you would hash this password
      farmType,
      location,
    })

    await user.save()
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        farmType: user.farmType,
        location: user.location,
        isAdmin: user.isAdmin,
      },
      success: true,
    })
  } catch (err) {
    console.error("Registration error:", err)
    res.status(500).json({ message: "Server Error: " + err.message })
  }
})

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials", code: 403 })
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        farmType: user.farmType,
        location: user.location,
        isAdmin: user.isAdmin,
      },
      success: true,
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    console.error("Error fetching users:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Update user (admin only)
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update only allowed fields
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = req.body.isAdmin
    }

    await user.save()
    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      farmType: user.farmType,
      location: user.location,
      isAdmin: user.isAdmin,
    })
  } catch (err) {
    console.error("Error updating user:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Delete user (admin only)
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await User.deleteOne({ _id: req.params.id })
    res.json({ message: "User deleted successfully" })
  } catch (err) {
    console.error("Error deleting user:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router
