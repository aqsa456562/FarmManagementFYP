"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = "http://localhost:5000/api"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/auth/users`)
      setUsers(response.data || [])
      setError(null)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users. Please try again.")
      // For demo purposes, create mock users if API fails
      setUsers([
        {
          _id: "1",
          fullName: "John Doe",
          email: "john@example.com",
          farmType: "Crop Farming",
          location: "California",
          isAdmin: false,
          createdAt: "2023-05-15",
        },
        {
          _id: "2",
          fullName: "Jane Smith",
          email: "jane@example.com",
          farmType: "Livestock Farming",
          location: "Texas",
          isAdmin: false,
          createdAt: "2023-05-20",
        },
        {
          _id: "3",
          fullName: "Admin User",
          email: "admin@example.com",
          farmType: "Mixed Farming",
          location: "Iowa",
          isAdmin: true,
          createdAt: "2023-04-10",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await axios.put(`${API_URL}/auth/users/${userId}`, {
        isAdmin: !currentStatus,
      })

      // Update local state
      setUsers(users.map((user) => (user._id === userId ? { ...user, isAdmin: !currentStatus } : user)))
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update user. Please try again.")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/auth/users/${userId}`)

        // Update local state
        setUsers(users.filter((user) => user._id !== userId))
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Failed to delete user. Please try again.")
      }
    }
  }

  return (
    <div className="admin-users">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Manage Users</h2>
      </div>

      <div className="admin-search-filter">
        <input type="text" placeholder="Search users..." className="admin-search-input" />
        <select className="admin-filter-select">
          <option value="all">All Users</option>
          <option value="admin">Admins</option>
          <option value="regular">Regular Users</option>
        </select>
        <button className="admin-search-btn">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Farm Type</th>
                <th>Location</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user._id || user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.farmType}</td>
                  <td>{user.location}</td>
                  <td>
                    <span className={`status-badge ${user.isAdmin ? "admin" : "user"}`}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn edit"
                        onClick={() => handleToggleAdmin(user._id || user.id, user.isAdmin)}
                      >
                        {user.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                      <button className="admin-action-btn delete" onClick={() => handleDeleteUser(user._id || user.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
