"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import CropForm from "./CropForm"

const API_URL = "http://localhost:5000/api"

const AdminCrops = () => {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/crops`)
      setCrops(response.data || [])
      setError(null)
    } catch (error) {
      console.error("Error fetching crops:", error)
      setError("Failed to load crops. Please try again.")
      // For demo purposes, load from local data if API fails
      import("../../data/crops").then((module) => {
        setCrops(module.default)
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await axios.delete(`${API_URL}/crops/${id}`)
        setCrops(crops.filter((crop) => crop._id !== id))
      } catch (error) {
        console.error("Error deleting crop:", error)
        alert("Failed to delete crop. Please try again.")
      }
    }
  }

  const handleAddCrop = async (cropData) => {
    try {
      const response = await axios.post(`${API_URL}/crops`, cropData)
      setCrops([...crops, response.data])
      navigate("/admin/crops")
    } catch (error) {
      console.error("Error adding crop:", error)
      alert("Failed to add crop. Please try again.")
    }
  }

  const handleUpdateCrop = async (id, cropData) => {
    try {
      const response = await axios.put(`${API_URL}/crops/${id}`, cropData)
      setCrops(crops.map((crop) => (crop._id === id ? response.data : crop)))
      navigate("/admin/crops")
    } catch (error) {
      console.error("Error updating crop:", error)
      alert("Failed to update crop. Please try again.")
    }
  }

  // Render the list of crops
  const renderCropsList = () => {
    if (loading) {
      return <div className="admin-loading">Loading crops...</div>
    }

    if (error) {
      return <div className="admin-error">{error}</div>
    }

    if (crops.length === 0) {
      return (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <i className="fas fa-seedling"></i>
          </div>
          <p className="admin-empty-text">No crops found. Add your first crop!</p>
          <button className="btn" onClick={() => navigate("/admin/crops/add")}>
            Add Crop
          </button>
        </div>
      )
    }

    return (
      <>
        <div className="admin-section-header">
          <h2 className="admin-section-title">Manage Crops</h2>
          <button className="btn" onClick={() => navigate("/admin/crops/add")}>
            Add New Crop
          </button>
        </div>

        <div className="admin-search-filter">
          <input type="text" placeholder="Search crops..." className="admin-search-input" />
          <select className="admin-filter-select">
            <option value="all">All Categories</option>
            <option value="grain">Grains</option>
            <option value="vegetable">Vegetables</option>
            <option value="fruit">Fruits</option>
            <option value="legume">Legumes</option>
          </select>
          <button className="admin-search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Season</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop._id || crop.id}>
                  <td>{crop._id || crop.id}</td>
                  <td>{crop.name}</td>
                  <td>{crop.category}</td>
                  <td>{crop.season}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn view"
                        onClick={() => navigate(`/crop/${crop.slug || crop._id || crop.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="admin-action-btn edit"
                        onClick={() => navigate(`/admin/crops/edit/${crop._id || crop.id}`)}
                      >
                        Edit
                      </button>
                      <button className="admin-action-btn delete" onClick={() => handleDelete(crop._id || crop.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <button className="admin-pagination-btn">1</button>
          <button className="admin-pagination-btn">2</button>
          <button className="admin-pagination-btn">3</button>
          <button className="admin-pagination-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="admin-crops">
      <Routes>
        <Route path="/" element={renderCropsList()} />
        <Route path="/add" element={<CropForm onSubmit={handleAddCrop} />} />
        <Route path="/edit/:id" element={<CropForm crops={crops} onSubmit={handleUpdateCrop} />} />{" "}
        {/* Corrected the onSubmit prop */}
      </Routes>
    </div>
  )
}

export default AdminCrops
