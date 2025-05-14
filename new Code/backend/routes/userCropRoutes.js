const express = require("express")
const router = express.Router()
const UserCrop = require("../models/UserCrop")
const { auth } = require("../middleware/auth")

// Get all user crops for the current user
router.get("/", async (req, res) => {
  try {
    // In a real app with proper auth, you would use req.user.id
    // For now, we'll return all crops
    const userCrops = await UserCrop.find()
    res.json(userCrops)
  } catch (err) {
    console.error("Error fetching user crops:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Get a specific user crop by ID
router.get("/:id", async (req, res) => {
  try {
    const crop = await UserCrop.findById(req.params.id)
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" })
    }

    // In a real app, verify the crop belongs to the current user
    // if (crop.user.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized" })
    // }

    res.json(crop)
  } catch (err) {
    console.error("Error fetching user crop:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Create a new user crop
router.post("/", async (req, res) => {
  try {
    // In a real app with proper auth, you would set user: req.user.id
    // For now, we'll use a placeholder user ID
    const newCrop = new UserCrop({
      ...req.body,
      user: "64f5a53e9d312a1f34b5f7e1", // Placeholder user ID
    })

    await newCrop.save()
    res.status(201).json(newCrop)
  } catch (err) {
    console.error("Error creating user crop:", err)
    res.status(500).json({ message: "Server Error: " + err.message })
  }
})

// Update a user crop
router.put("/:id", async (req, res) => {
  try {
    const crop = await UserCrop.findById(req.params.id)
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" })
    }

    // In a real app, verify the crop belongs to the current user
    // if (crop.user.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized" })
    // }

    // Update crop fields
    Object.keys(req.body).forEach((key) => {
      // Don't allow updating the user field
      if (key !== "user") {
        crop[key] = req.body[key]
      }
    })

    await crop.save()
    res.json(crop)
  } catch (err) {
    console.error("Error updating user crop:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Delete a user crop
router.delete("/:id", async (req, res) => {
  try {
    const crop = await UserCrop.findById(req.params.id)
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" })
    }

    // In a real app, verify the crop belongs to the current user
    // if (crop.user.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized" })
    // }

    await UserCrop.deleteOne({ _id: req.params.id })
    res.json({ message: "Crop deleted successfully" })
  } catch (err) {
    console.error("Error deleting user crop:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router
