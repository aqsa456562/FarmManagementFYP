"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import axios from "axios"
import MarketTrendForm from "./MarketTrendForm"

const API_URL = "http://localhost:5000/api"

const AdminMarketTrends = () => {
  const [marketTrends, setMarketTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("weekly")
  const navigate = useNavigate()

  useEffect(() => {
    fetchMarketTrends()
  }, [timeframe])

  const fetchMarketTrends = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/market-trends?timeframe=${timeframe}`)
      setMarketTrends(response.data || [])
      setError(null)
    } catch (error) {
      console.error("Error fetching market trends:", error)
      setError("Failed to load market trends. Please try again.")
      // For demo purposes, load from local data if API fails
      import("../../data/marketTrends").then((module) => {
        setMarketTrends(module.default[timeframe] || [])
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this market trend?")) {
      try {
        await axios.delete(`${API_URL}/market-trends/${id}`)
        setMarketTrends(marketTrends.filter((trend) => trend._id !== id))
      } catch (error) {
        console.error("Error deleting market trend:", error)
        alert("Failed to delete market trend. Please try again.")
      }
    }
  }

  const handleAddMarketTrend = async (trendData) => {
    try {
      const response = await axios.post(`${API_URL}/market-trends`, {
        ...trendData,
        timeframe,
      })
      setMarketTrends([...marketTrends, response.data])
      navigate("/admin/market-trends")
    } catch (error) {
      console.error("Error adding market trend:", error)
      alert("Failed to add market trend. Please try again.")
    }
  }

  const handleUpdateMarketTrend = async (id, trendData) => {
    try {
      const response = await axios.put(`${API_URL}/market-trends/${id}`, {
        ...trendData,
        timeframe,
      })
      setMarketTrends(marketTrends.map((trend) => (trend._id === id ? response.data : trend)))
      navigate("/admin/market-trends")
    } catch (error) {
      console.error("Error updating market trend:", error)
      alert("Failed to update market trend. Please try again.")
    }
  }

  // Render the list of market trends
  const renderMarketTrendsList = () => {
    if (loading) {
      return <div className="admin-loading">Loading market trends...</div>
    }

    if (error) {
      return <div className="admin-error">{error}</div>
    }

    return (
      <>
        <div className="admin-section-header">
          <h2 className="admin-section-title">Manage Market Trends</h2>
          <button className="btn" onClick={() => navigate("/admin/market-trends/add")}>
            Add New Market Trend
          </button>
        </div>

        <div className="admin-search-filter">
          <select className="admin-filter-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Crop</th>
                <th>Current Price</th>
                <th>Previous Price</th>
                <th>Change (%)</th>
                <th>Trend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marketTrends.map((trend) => (
                <tr key={trend._id || trend.id}>
                  <td>{trend._id || trend.id}</td>
                  <td>{trend.crop}</td>
                  <td>${trend.currentPrice}</td>
                  <td>${trend.previousPrice}</td>
                  <td>{trend.change > 0 ? `+${trend.change}%` : `${trend.change}%`}</td>
                  <td>
                    <span className={`status-badge ${trend.trend}`}>
                      {trend.trend === "up" ? "↑ Up" : trend.trend === "down" ? "↓ Down" : "→ Stable"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn edit"
                        onClick={() => navigate(`/admin/market-trends/edit/${trend._id || trend.id}`)}
                      >
                        Edit
                      </button>
                      <button className="admin-action-btn delete" onClick={() => handleDelete(trend._id || trend.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  return (
    <div className="admin-market-trends">
      <Routes>
        <Route path="/" element={renderMarketTrendsList()} />
        <Route path="/add" element={<MarketTrendForm onSubmit={handleAddMarketTrend} />} />
        <Route
          path="/edit/:id"
          element={<MarketTrendForm marketTrends={marketTrends} onSubmit={handleUpdateMarketTrend} isEditing />}
        />
      </Routes>
    </div>
  )
}

export default AdminMarketTrends
