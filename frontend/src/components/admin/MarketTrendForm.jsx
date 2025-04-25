"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const MarketTrendForm = ({ marketTrends = [], onSubmit, isEditing = false }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    crop: "",
    currentPrice: "",
    previousPrice: "",
    change: "",
    trend: "up",
  })

  useEffect(() => {
    if (isEditing && id) {
      const trendToEdit = marketTrends.find((trend) => trend.id.toString() === id)
      if (trendToEdit) {
        setFormData({
          crop: trendToEdit.crop || "",
          currentPrice: trendToEdit.currentPrice || "",
          previousPrice: trendToEdit.previousPrice || "",
          change: trendToEdit.change || "",
          trend: trendToEdit.trend || "up",
        })
      }
    }
  }, [isEditing, id, marketTrends])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "currentPrice" || name === "previousPrice") {
      // Only allow numbers and decimal point
      if (!/^\d*\.?\d*$/.test(value)) return
    }

    if (name === "change") {
      // Allow negative numbers, numbers and decimal point
      if (!/^-?\d*\.?\d*$/.test(value)) return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-calculate change if both prices are set
    if ((name === "currentPrice" || name === "previousPrice") && formData.currentPrice && formData.previousPrice) {
      const current = name === "currentPrice" ? Number.parseFloat(value) : Number.parseFloat(formData.currentPrice)
      const previous = name === "previousPrice" ? Number.parseFloat(value) : Number.parseFloat(formData.previousPrice)

      if (current && previous) {
        const changePercent = (((current - previous) / previous) * 100).toFixed(1)

        setFormData((prev) => ({
          ...prev,
          change: changePercent,
          trend: changePercent > 0 ? "up" : changePercent < 0 ? "down" : "stable",
        }))
      }
    }

    // Auto-set trend based on change
    if (name === "change") {
      const changeValue = Number.parseFloat(value)
      if (!isNaN(changeValue)) {
        setFormData((prev) => ({
          ...prev,
          trend: changeValue > 0 ? "up" : changeValue < 0 ? "down" : "stable",
        }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Convert string values to numbers
    const trendData = {
      ...formData,
      currentPrice: Number.parseFloat(formData.currentPrice),
      previousPrice: Number.parseFloat(formData.previousPrice),
      change: Number.parseFloat(formData.change),
    }

    if (isEditing) {
      onSubmit(id, trendData)
    } else {
      onSubmit(trendData)
    }
  }

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">{isEditing ? "Edit Market Trend" : "Add New Market Trend"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label htmlFor="crop">Crop Name</label>
          <input
            type="text"
            id="crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="currentPrice">Current Price ($/ton)</label>
            <input
              type="text"
              id="currentPrice"
              name="currentPrice"
              value={formData.currentPrice}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="previousPrice">Previous Price ($/ton)</label>
            <input
              type="text"
              id="previousPrice"
              name="previousPrice"
              value={formData.previousPrice}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="change">Change (%)</label>
            <input
              type="text"
              id="change"
              name="change"
              value={formData.change}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="trend">Trend</label>
            <select
              id="trend"
              name="trend"
              value={formData.trend}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="stable">Stable</option>
            </select>
          </div>
        </div>

        <div className="admin-form-buttons">
          <button type="button" onClick={() => navigate("/admin/market-trends")} className="btn admin-cancel-btn">
            Cancel
          </button>
          <button type="submit" className="btn admin-submit-btn">
            {isEditing ? "Update Market Trend" : "Add Market Trend"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MarketTrendForm
