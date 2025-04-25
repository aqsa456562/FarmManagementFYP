"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import weatherForecast from "../../data/weatherForecast"
import marketTrends from "../../data/marketTrends"

const API_URL = "http://localhost:5000/api"

const DashboardOverview = () => {
  const [userCrops, setUserCrops] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Get the weekly market data for the dashboard
  const marketPrices = marketTrends.weekly.slice(0, 3)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch user crops
        const cropsResponse = await axios.get(`${API_URL}/user-crops`)
        setUserCrops(cropsResponse.data || [])

        // Fetch tasks
        const tasksResponse = await axios.get(`${API_URL}/tasks`)
        setTasks(tasksResponse.data || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)

        // For demo purposes, load from local data if API fails
        import("../../data/userCrops").then((module) => {
          setUserCrops(module.default)
        })

        import("../../data/tasks").then((module) => {
          setTasks(module.default)
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-grid">
        <div className="dashboard-card weather-card">
          <h3 className="card-title">Weather Forecast</h3>
          <div className="weather-forecast">
            {weatherForecast.map((day, index) => (
              <div key={index} className="weather-day">
                <div className="weather-icon">{day.icon}</div>
                <div className="weather-info">
                  <div className="weather-day-name">{day.day}</div>
                  <div className="weather-temp">{day.temp}</div>
                  <div className="weather-condition">{day.condition}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card tasks-card">
          <h3 className="card-title">Upcoming Tasks</h3>
          <ul className="task-list">
            {tasks
              .filter((task) => !task.completed)
              .slice(0, 3)
              .map((task) => (
                <li key={task.id} className="task-item">
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    <div className="task-due">Due: {task.dueDate}</div>
                  </div>
                  <div className={`task-priority ${task.priority.toLowerCase()}`}>{task.priority}</div>
                </li>
              ))}
          </ul>
          <button className="view-all-btn" onClick={() => (window.location.href = "/dashboard/tasks")}>
            View All Tasks
          </button>
        </div>

        <div className="dashboard-card market-card">
          <h3 className="card-title">Market Prices</h3>
          <ul className="market-list">
            {marketPrices.map((item, index) => (
              <li key={index} className="market-item">
                <div className="market-crop">{item.crop}</div>
                <div className="market-price">${item.currentPrice}/ton</div>
                <div className={`market-change ${item.trend}`}>
                  {item.change > 0 ? "+" : ""}
                  {item.change}%
                </div>
              </li>
            ))}
          </ul>
          <button className="view-all-btn" onClick={() => (window.location.href = "/market-trends")}>
            View Market Trends
          </button>
        </div>

        <div className="dashboard-card crops-card">
          <h3 className="card-title">My Crops</h3>
          <ul className="crop-list">
            {userCrops.map((crop) => (
              <li key={crop.id} className="crop-item">
                <div className="crop-info">
                  <div className="crop-name">{crop.name}</div>
                  <div className="crop-area">{crop.area}</div>
                </div>
                <div className={`crop-status ${crop.status.toLowerCase()}`}>{crop.status}</div>
              </li>
            ))}
          </ul>
          <button className="view-all-btn" onClick={() => (window.location.href = "/dashboard/crops")}>
            Manage Crops
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
