"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = "http://localhost:5000/api"

const CropForm = ({ crops = [], onSubmit, isEditing = false }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(isEditing)

  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    season: "",
    duration: "",
    category: "",
    description: "",
    fullDescription: "",
    planting: "",
    care: "",
    harvesting: "",
    pests: "",
    images: [""],
  })

  useEffect(() => {
    if (isEditing && id) {
      // First check if the crop is in the passed crops array
      const cropToEdit = crops.find((crop) => (crop._id || crop.id).toString() === id)

      if (cropToEdit) {
        populateFormData(cropToEdit)
      } else {
        // If not found in the passed array, fetch from API
        fetchCropById(id)
      }
    }
  }, [isEditing, id, crops])

  const fetchCropById = async (cropId) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/crops/${cropId}`)
      if (response.data) {
        populateFormData(response.data)
      }
    } catch (error) {
      console.error("Error fetching crop:", error)
      alert("Failed to load crop data. Please try again.")
      navigate("/admin/crops")
    } finally {
      setLoading(false)
    }
  }

  const populateFormData = (crop) => {
    setFormData({
      name: crop.name || "",
      scientificName: crop.scientificName || "",
      season: crop.season || "",
      duration: crop.duration || "",
      category: crop.category || "",
      description: crop.description || "",
      fullDescription: crop.fullDescription || "",
      planting: crop.planting || "",
      care: crop.care || "",
      harvesting: crop.harvesting || "",
      pests: crop.pests || "",
      images: crop.images?.length ? crop.images : [""],
    })
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }))
  }

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }))
  }

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      images: updatedImages.length ? updatedImages : [""],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Generate a slug from the name if not editing
    const cropData = {
      ...formData,
      slug: isEditing ? undefined : formData.name.toLowerCase().replace(/\s+/g, "-"),
    }

    if (isEditing) {
      onSubmit(id, cropData)
    } else {
      onSubmit(cropData)
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading crop data...</div>
  }

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">{isEditing ? "Edit Crop" : "Add New Crop"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="name">Crop Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="scientificName">Scientific Name</label>
            <input
              type="text"
              id="scientificName"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="season">Growing Season</label>
            <input
              type="text"
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Category</option>
            <option value="grain">Grain</option>
            <option value="vegetable">Vegetable</option>
            <option value="fruit">Fruit</option>
            <option value="legume">Legume</option>
            <option value="fiber">Fiber</option>
            <option value="cash">Cash Crop</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label htmlFor="description">Short Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="fullDescription">Full Description</label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            className="form-control"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="admin-form-group">
          <label htmlFor="planting">Planting Instructions</label>
          <textarea
            id="planting"
            name="planting"
            value={formData.planting}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="admin-form-group">
          <label htmlFor="care">Care Instructions</label>
          <textarea
            id="care"
            name="care"
            value={formData.care}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="admin-form-group">
          <label htmlFor="harvesting">Harvesting Instructions</label>
          <textarea
            id="harvesting"
            name="harvesting"
            value={formData.harvesting}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="admin-form-group">
          <label htmlFor="pests">Pests & Diseases</label>
          <textarea
            id="pests"
            name="pests"
            value={formData.pests}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="admin-form-group">
          <label>Images</label>
          {formData.images.map((image, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="form-control"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="admin-action-btn delete"
                style={{ width: "40px" }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
          <button type="button" onClick={addImageField} className="btn" style={{ marginTop: "10px" }}>
            Add Image
          </button>
        </div>

        <div className="admin-form-buttons">
          <button type="button" onClick={() => navigate("/admin/crops")} className="btn admin-cancel-btn">
            Cancel
          </button>
          <button type="submit" className="btn admin-submit-btn">
            {isEditing ? "Update Crop" : "Add Crop"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CropForm
