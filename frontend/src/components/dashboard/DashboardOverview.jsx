"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import weatherForecast from "../../data/weatherForecast";
import marketTrends from "../../data/marketTrends";

const API_URL = "http://localhost:5000/api";

const DashboardOverview = () => {
  const [userCrops, setUserCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const cropsResponse = await axios.get(`${API_URL}/user-crops`);
        setUserCrops(cropsResponse.data || []);

        const tasksResponse = await axios.get(`${API_URL}/tasks`);
        setTasks(tasksResponse.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        import("../../data/userCrops").then((module) => {
          setUserCrops(module.default);
        });

        import("../../data/tasks").then((module) => {
          setTasks(module.default);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  // Calculate metrics
  const totalCrops = userCrops.length;
  const plannedCrops = userCrops.filter((crop) => crop.status === "Planned").length;
  const harvestedCrops = userCrops.filter((crop) => crop.status === "Harvested").length;
  const growingCrops = userCrops.filter((crop) => crop.status === "Growing").length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="dashboard-overview">
      <div className="dashboard-grid">
        {/* Metrics Section */}
        <div className="dashboard-card metrics-card">
          <h3 className="card-title">Dashboard Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <h4>Total Crops</h4>
              <p>{totalCrops}</p>
            </div>
            <div className="metric-item">
              <h4>planned Crops</h4>
              <p>{plannedCrops}</p>
            </div>
            <div className="metric-item">
              <h4>Harvested Crops</h4>
              <p>{harvestedCrops}</p>
            </div>
            <div className="metric-item">
              <h4>Growing Crops</h4>
              <p>{growingCrops}</p>
            </div>
            
            <div className="metric-item">
              <h4>Pending Tasks</h4>
              <p>{pendingTasks}</p>
            </div>
            <div className="metric-item">
              <h4>Completed Tasks</h4>
              <p>{completedTasks}</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
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
                  <div
                    className={`task-priority ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </div>
                </li>
              ))}
          </ul>
          <button
            className="view-all-btn"
            onClick={() => (window.location.href = "/dashboard/tasks")}
          >
            View All Tasks
          </button>
        </div>

        {/* Crops Section */}
        <div className="dashboard-card crops-card">
          <h3 className="card-title">My Crops</h3>
          <ul className="crop-list">
            {userCrops.map((crop) => (
              <li key={crop.id} className="crop-item">
                <div className="crop-info">
                  <div className="crop-name">{crop.name}</div>
                  <div className="crop-area">{crop.area}</div>
                  <div className="crop-area">{crop.harvestDate}</div>
                </div>
                <div className={`crop-status ${crop.status.toLowerCase()}`}>
                  {crop.status}
                </div>
              </li>
            ))}
          </ul>
          <button
            className="view-all-btn"
            onClick={() => (window.location.href = "/dashboard/crops")}
          >
            Manage Crops
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
