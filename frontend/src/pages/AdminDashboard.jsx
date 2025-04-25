"use client"

import { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./AdminDashboard.css"

// Admin Dashboard Components
import AdminCrops from "../components/admin/AdminCrops"
import AdminMarketTrends from "../components/admin/AdminMarketTrends"
import AdminUsers from "../components/admin/AdminUsers"
import AdminOverview from "../components/admin/AdminOverview"

const API_URL = "http://localhost:5000/api"

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCrops: 0,
    totalMarketTrends: 0,
  })

  useEffect(() => {
    // If we're at /admin, redirect to /admin/overview
    if (location.pathname === "/admin") {
      navigate("/admin/overview")
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // In a real app, you would fetch these stats from your API
        // For now, we'll use mock data
        setStats({
          totalUsers: 24,
          totalCrops: 9,
          totalMarketTrends: 12,
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      }
    }

    fetchStats()
  }, [location.pathname, navigate])

  // Check if a nav link is active
  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div className="container">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <p className="admin-dashboard-subtitle">Manage crops, market trends, and user accounts</p>
        </div>
      </div>

      <div className="container admin-dashboard-content">
        <div className="admin-dashboard-nav">
          <Link to="/admin/overview" className={`admin-nav-link ${isActive("/overview") ? "active" : ""}`}>
            Overview
          </Link>
          <Link to="/admin/crops" className={`admin-nav-link ${isActive("/crops") ? "active" : ""}`}>
            Manage Crops
          </Link>
          <Link to="/admin/market-trends" className={`admin-nav-link ${isActive("/market-trends") ? "active" : ""}`}>
            Market Trends
          </Link>
          <Link to="/admin/users" className={`admin-nav-link ${isActive("/users") ? "active" : ""}`}>
            Users
          </Link>
        </div>

        <Routes>
          <Route path="/overview" element={<AdminOverview stats={stats} />} />
          <Route path="/crops/*" element={<AdminCrops />} />
          <Route path="/market-trends/*" element={<AdminMarketTrends />} />
          <Route path="/users/*" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard
