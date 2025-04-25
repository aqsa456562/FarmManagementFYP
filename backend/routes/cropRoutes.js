const express = require("express")
const router = express.Router()
const Crop = require("../models/Crop")
const { auth, admin } = require("../middleware/auth")

// Get all crops
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find()
    res.json(crops)
  } catch (err) {
    console.error("Error fetching crops:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Get a specific crop by ID or slug
router.get("/:idOrSlug", async (req, res) => {
  try {
    let crop

    // Check if the parameter is an ObjectId
    if (req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      crop = await Crop.findById(req.params.idOrSlug)
    } else {
      // Otherwise, treat it as a slug
      crop = await Crop.findOne({ slug: req.params.idOrSlug })
    }

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" })
    }

    res.json(crop)
  } catch (err) {
    console.error("Error fetching crop:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Create a new crop (admin only)
router.post("/", async (req, res) => {
  try {
    const newCrop = new Crop(req.body)
    await newCrop.save()
    res.status(201).json(newCrop)
  } catch (err) {
    console.error("Error creating crop:", err)
    res.status(500).json({ message: "Server Error: " + err.message })
  }
})

// Update a crop (admin only)
router.put("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" })
    }

    // Update crop fields
    Object.keys(req.body).forEach((key) => {
      crop[key] = req.body[key]
    })

    await crop.save()
    res.json(crop)
  } catch (err) {
    console.error("Error updating crop:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Delete a crop (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" })
    }

    await Crop.deleteOne({ _id: req.params.id })
    res.json({ message: "Crop deleted successfully" })
  } catch (err) {
    console.error("Error deleting crop:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router
