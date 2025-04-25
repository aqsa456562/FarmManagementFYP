import { Link } from "react-router-dom"

const AdminOverview = ({ stats }) => {
  return (
    <div className="admin-overview">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Dashboard Overview</h2>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-label">Total Users</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalCrops}</div>
          <div className="admin-stat-label">Crops</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalMarketTrends}</div>
          <div className="admin-stat-label">Market Trends</div>
        </div>
      </div>

      <div className="admin-chart-container">
        <h3 className="admin-chart-title">User Registration Trends</h3>
        <div className="admin-chart-placeholder">
          <p>User registration chart will be displayed here</p>
        </div>
      </div>

      <div className="admin-section-header">
        <h2 className="admin-section-title">Quick Actions</h2>
      </div>

      <div className="admin-stats-grid">
        <Link to="/admin/crops/add" className="admin-stat-card">
          <div className="admin-stat-value">
            <i className="fas fa-plus"></i>
          </div>
          <div className="admin-stat-label">Add New Crop</div>
        </Link>
        <Link to="/admin/market-trends/add" className="admin-stat-card">
          <div className="admin-stat-value">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="admin-stat-label">Add Market Trend</div>
        </Link>
        <Link to="/admin/users" className="admin-stat-card">
          <div className="admin-stat-value">
            <i className="fas fa-users"></i>
          </div>
          <div className="admin-stat-label">Manage Users</div>
        </Link>
      </div>

      <div className="admin-chart-container">
        <h3 className="admin-chart-title">Recent Activity</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Added Crop</td>
                <td>admin@example.com</td>
                <td>2023-06-15</td>
                <td>Added new crop: Tomato</td>
              </tr>
              <tr>
                <td>Updated Market Trend</td>
                <td>admin@example.com</td>
                <td>2023-06-14</td>
                <td>Updated wheat market prices</td>
              </tr>
              <tr>
                <td>New User</td>
                <td>john@example.com</td>
                <td>2023-06-12</td>
                <td>New user registration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
