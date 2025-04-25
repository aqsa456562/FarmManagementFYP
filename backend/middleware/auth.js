const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
   
    const { email } = req.body

    if (!email) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Middleware to check if user is an admin
const admin = async (req, res, next) => {
  try {
    // First run the auth middleware
    auth(req, res, () => {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" })
      }
      next()
    })
  } catch (error) {
    console.error("Admin middleware error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { auth, admin }
