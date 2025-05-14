"use client";

import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Extract the active tab from the URL path
    const path = location.pathname.split("/").pop();
    if (path && path !== "admin") {
      setActiveTab(path);
    } else if (location.pathname === "/admin") {
      setActiveTab("overview");
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab === "overview" ? "" : tab}`);
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div className="container">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <p className="admin-dashboard-subtitle">
            Manage crops, users, and system settings
          </p>
        </div>
      </div>

      <div className="container admin-dashboard-content">
        <div className="admin-dashboard-nav">
          <Link
            to="/admin"
            className={`admin-nav-link ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => handleTabClick("overview")}
          >
            Overview
          </Link>
          <Link
            to="/admin/crops"
            className={`admin-nav-link ${
              activeTab === "crops" ? "active" : ""
            }`}
            onClick={() => handleTabClick("crops")}
          >
            Manage Crops
          </Link>
          <Link
            to="/admin/users"
            className={`admin-nav-link ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => handleTabClick("users")}
          >
            Manage Users
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/crops/*" element={<AdminCrops />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCrops: 0,
    totalUserCrops: 0,
    totalTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats from the backend
        const [usersResponse, cropsResponse, userCropsResponse, tasksResponse] =
          await Promise.all([
            axios.get(`${API_URL}/auth/users`), // Fetch total users
            axios.get(`${API_URL}/crops`), // Fetch total crops
            axios.get(`${API_URL}/user-crops`), // Fetch total user crops
            axios.get(`${API_URL}/tasks`), // Fetch total tasks
          ]);

        setStats({
          totalUsers: usersResponse.data.length,
          totalCrops: cropsResponse.data.length,
          totalUserCrops: userCropsResponse.data.length,
          totalTasks: tasksResponse.data.length,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        setError("Failed to load dashboard stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2 className="admin-section-title">Dashboard Overview</h2>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-label">Registered Users</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalCrops}</div>
          <div className="admin-stat-label">Crop Types</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalUserCrops}</div>
          <div className="admin-stat-label">User Crops</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalTasks}</div>
          <div className="admin-stat-label">User Tasks</div>
        </div>
      </div>

      <div className="admin-actions-container">
        <h3>Quick Actions</h3>
        <div className="admin-quick-actions">
          <button
            className="btn admin-action-btn"
            onClick={() => (window.location.href = "/admin/crops/add")}
          >
            Add New Crop
          </button>
          <button
            className="btn admin-action-btn"
            onClick={() => (window.location.href = "/crop-management")}
          >
            View Crop Catalog
          </button>
          <button
            className="btn admin-action-btn"
            onClick={() => (window.location.href = "/admin/users")}
          >
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Crops Management Component
const AdminCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddCrop = async (cropData) => {
    try {
      console.log("Adding new crop:", cropData);
      const response = await axios.post(`${API_URL}/crops`, cropData);
      setCrops([...crops, response.data]);
      navigate("/admin/crops");
      alert("Crop added successfully!");
    } catch (error) {
      console.error("Error adding crop:", error);
      alert("Failed to add crop. Please try again.");
    }
  };

  const handleUpdateCrop = async (id, cropData) => {
    try {
      console.log("Updating crop:", id, cropData);
      const response = await axios.put(`${API_URL}/crops/${id}`, cropData);
      setCrops(
        crops.map((crop) =>
          crop._id === id || crop.id === id ? response.data : crop
        )
      );
      navigate("/admin/crops");
      alert("Crop updated successfully!");
    } catch (error) {
      console.error("Error updating crop:", error);
      alert("Failed to update crop. Please try again.");
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching all crops for admin");
      const response = await axios.get(`${API_URL}/crops`);
      console.log("Admin crops response:", response.data);
      setCrops(response.data || []);
    } catch (error) {
      console.error("Error fetching crops:", error);
      setError("Failed to load crops. Please try again.");

      // For demo purposes, load from local data if API fails
      import("../data/crops").then((module) => {
        setCrops(module.default);
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if we're on the add or edit page
  const isAddPage = location.pathname.includes("/admin/crops/add");
  const isEditPage = location.pathname.includes("/admin/crops/edit");

  if (isAddPage) {
    return <AdminCropForm onSubmit={handleAddCrop} />;
  }

  if (isEditPage) {
    const cropId = location.pathname.split("/").pop();
    return (
      <AdminCropForm
        cropId={cropId}
        crops={crops}
        onSubmit={handleUpdateCrop}
        isEditing
      />
    );
  }

  const handleDeleteCrop = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this crop? This action cannot be undone."
      )
    ) {
      try {
        console.log("Deleting crop:", id);
        await axios.delete(`${API_URL}/crops/${id}`);
        setCrops(crops.filter((crop) => crop._id !== id && crop.id !== id));
        alert("Crop deleted successfully!");
      } catch (error) {
        console.error("Error deleting crop:", error);
        alert("Failed to delete crop. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading crops...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Manage Crops</h2>
        <div className="admin-header-actions">
          <button className="btn" onClick={() => navigate("/admin/crops/add")}>
            Add New Crop
          </button>
          <button
            className="btn view-catalog-btn"
            onClick={() => navigate("/crop-management")}
          >
            View Crop Catalog
          </button>
        </div>
      </div>

      {/* <div className="admin-search-filter">
        <input type="text" placeholder="Search crops..." className="admin-search-input" />
        <select className="admin-filter-select">
          <option value="">All Categories</option>
          <option value="grain">Grains</option>
          <option value="vegetable">Vegetables</option>
          <option value="fruit">Fruits</option>
          <option value="legume">Legumes</option>
        </select>
        <button className="admin-search-btn">Search</button>
      </div> */}

      {crops.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <i className="fas fa-seedling"></i>
          </div>
          <p className="admin-empty-text">
            No crops found. Add your first crop to get started.
          </p>
          <button className="btn" onClick={() => navigate("/admin/crops/add")}>
            Add New Crop
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Season</th>
                <th>Duration</th>
                <th className="admin-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop.id || crop._id}>
                  <td>{crop.name}</td>
                  <td>{crop.category}</td>
                  <td>{crop.season}</td>
                  <td>{crop.duration}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn view"
                        onClick={() =>
                          navigate(`/crop/${crop.slug || crop.id}`)
                        }
                      >
                        View
                      </button>
                      <button
                        className="admin-action-btn edit"
                        onClick={() =>
                          navigate(`/admin/crops/edit/${crop.id || crop._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteCrop(crop.id || crop._id)}
                      >
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
  );
};

// Admin Crop Form Component
const AdminCropForm = ({ cropId, crops = [], onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    // scientificName: "",
    season: "",
    duration: "",
    category: "",
    description: "",
    // fullDescription: "",
    planting: "",
    care: "",
    farmerName: "", // change 1
    // harvesting: "",
    // pests: "",
    images: [],
  });
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && cropId) {
      console.log("Editing crop with ID:", cropId);
      console.log("Available crops:", crops);

      const cropToEdit = crops.find(
        (crop) =>
          (crop.id && crop.id.toString() === cropId) ||
          (crop._id && crop._id.toString() === cropId)
      );

      if (cropToEdit) {
        console.log("Found crop to edit:", cropToEdit);
        setFormData({
          name: cropToEdit.name || "",
          // scientificName: cropToEdit.scientificName || "",
          season: cropToEdit.season || "",
          duration: cropToEdit.duration || "",
          category: cropToEdit.category || "",
          description: cropToEdit.description || "",
          // fullDescription: cropToEdit.fullDescription || "",
          planting: cropToEdit.planting || "",
          care: cropToEdit.care || "",
          farmerName: cropToEdit.farmerName || "", // change 2
          // harvesting: cropToEdit.harvesting || "",
          // pests: cropToEdit.pests || "",
          images: cropToEdit.images || [],
        });
      } else {
        console.log("Crop not found in local data, fetching from API");
        // If not found in local state, try to fetch from API
        axios
          .get(`${API_URL}/crops/${cropId}`)
          .then((response) => {
            const cropData = response.data;
            console.log("Fetched crop data:", cropData);
            setFormData({
              name: cropData.name || "",
              // scientificName: cropData.scientificName || "",
              season: cropData.season || "",
              duration: cropData.duration || "",
              category: cropData.category || "",
              description: cropData.description || "",
              // fullDescription: cropData.fullDescription || "",
              planting: cropData.planting || "",
              care: cropData.care || "",
              farmerName: cropData.farmerName || "", //change 3
              // harvesting: cropData.harvesting || "",
              // pests: cropData.pests || "",
              images: cropData.images || [],
            });
          })
          .catch((error) => {
            console.error("Error fetching crop for editing:", error);
            alert("Failed to load crop data for editing");
          });
      }
      setLoading(false);
    }
  }, [isEditing, cropId, crops]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate slug if not editing
    const dataToSubmit = { ...formData };
    if (!isEditing) {
      dataToSubmit.slug = formData.name.toLowerCase().replace(/\s+/g, "-");
    }

    console.log("Submitting crop data:", dataToSubmit);

    if (isEditing) {
      onSubmit(cropId, dataToSubmit);
    } else {
      onSubmit(dataToSubmit);
    }
  };

  if (loading) {
    return <div className="loading">Loading crop data...</div>;
  }

  return (
    <div className="admin-crop-form">
      <h2>{isEditing ? "Edit Crop" : "Add New Crop"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
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

          {/* <div className="form-group">
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
        </div> */}

          <div className="form-row">
            <div className="form-group">
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
                <option value="hello">Hellow</option>
              </select>
            </div>

            <div className="form-group">
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
          </div>

          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="images">Image URL</label>
              <input
                type="text"
                id="images"
                name="images"
                value={formData.images[0] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, images: [e.target.value] })
                }
                className="form-control"
                placeholder="Enter primary image URL"
              />
            </div>
          </div>

          <div className="form-group">
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

          {/* <div className="form-group">
          <label htmlFor="fullDescription">Full Description</label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
        </div> */}

          <div className="form-group">
            <label htmlFor="planting">Planting Instructions</label>
            <textarea
              id="planting"
              name="planting"
              value={formData.planting}
              onChange={handleChange}
              className="form-control"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="care">Care Instructions</label>
            <textarea
              id="care"
              name="care"
              value={formData.care}
              onChange={handleChange}
              className="form-control"
              required
            ></textarea>
          </div>
          <div className="form-group">
            {" "}
            {/** change 4 */}
            <label htmlFor="farmerName">Farmer Name</label>
            <input
              id="farmerName"
              name="farmerName"
              value={formData.farmerName}
              onChange={handleChange}
              className="form-control"
              required
            ></input>
          </div>
          {/* 
        <div className="form-group">
          <label htmlFor="harvesting">Harvesting Instructions</label>
          <textarea
            id="harvesting"
            name="harvesting"
            value={formData.harvesting}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
        </div> */}

          {/* <div className="form-group">
          <label htmlFor="pests">Pests & Diseases</label>
          <textarea
            id="pests"
            name="pests"
            value={formData.pests}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
        </div> */}
        </div>
        <div className="form-buttons">
          <button
            type="button"
            className="btn admin-cancel-btn"
            onClick={() => navigate("/admin/crops")}
          >
            Cancel
          </button>
          <button type="submit" className="btn admin-submit-btn">
            {isEditing ? "Update Crop" : "Add Crop"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Admin Users Management Component
const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    farmType: "",
    location: "",
    isAdmin: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, you would fetch users from your API
        const response = await axios.get(`${API_URL}/auth/users`);
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");

        // Mock data for demo
        setUsers([
          {
            id: 1,
            fullName: "John Doe",
            email: "john@example.com",
            farmType: "Crop Farming",
            location: "California",
            isAdmin: false,
          },
          {
            id: 2,
            fullName: "Jane Smith",
            email: "jane@example.com",
            farmType: "Mixed Farming",
            location: "Texas",
            isAdmin: false,
          },
          {
            id: 3,
            fullName: "Admin User",
            email: "admin@example.com",
            farmType: "Organic Farming",
            location: "New York",
            isAdmin: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await axios.put(`${API_URL}/auth/users/${userId}`, {
        isAdmin: !currentStatus,
      });

      // Update the users list with the updated user
      setUsers(
        users.map((user) =>
          user.id === userId || user._id === userId
            ? { ...user, isAdmin: !currentStatus }
            : user
        )
      );

      alert(
        `User ${
          currentStatus ? "removed from" : "promoted to"
        } admin role successfully!`
      );
    } catch (error) {
      console.error("Error updating user admin status:", error);
      alert("Failed to update user status. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${API_URL}/auth/users/${userId}`);
        setUsers(
          users.filter((user) => user.id !== userId && user._id !== userId)
        );
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      farmType: user.farmType,
      location: user.location,
      isAdmin: user.isAdmin,
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({
      fullName: "",
      email: "",
      farmType: "",
      location: "",
      isAdmin: false,
    });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Make API call to update user
      await axios.put(
        `${API_URL}/auth/users/${editingUser.id || editingUser._id}`,
        editFormData
      );

      // Update the users list with the updated user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id || user._id === editingUser._id
            ? { ...user, ...editFormData }
            : user
        )
      );

      alert("User updated successfully!");
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Manage Users</h2>
      </div>

      {editingUser ? (
        <div className="admin-form-container">
          <h3>Edit User</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={editFormData.fullName}
                onChange={handleEditFormChange}
                className="admin-form-control"
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                className="admin-form-control"
                disabled // Disable editing email for simplicity
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="farmType">Farm Type</label>
              <input
                type="text"
                id="farmType"
                name="farmType"
                value={editFormData.farmType}
                onChange={handleEditFormChange}
                className="admin-form-control"
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editFormData.location}
                onChange={handleEditFormChange}
                className="admin-form-control"
              />
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="isAdmin">Is Admin</label>
            <select
              id="isAdmin"
              name="isAdmin"
              value={editFormData.isAdmin}
              onChange={handleEditFormChange}
              className="admin-form-control"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="admin-form-buttons">
            <button className="btn admin-cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button className="btn admin-submit-btn" onClick={handleUpdateUser}>
              Update User
            </button>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <i className="fas fa-users"></i>
          </div>
          <p className="admin-empty-text">No users found.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Farm Type</th>
                <th>Location</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id || user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.farmType}</td>
                  <td>{user.location}</td>
                  <td>
                    <span className={user.isAdmin ? "admin-badge" : ""}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      {/* <button
                        className="admin-action-btn edit"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button> */}
                      <button
                        className="admin-action-btn edit"
                        onClick={() =>
                          handleToggleAdmin(user.id || user._id, user.isAdmin)
                        }
                      >
                        {user.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteUser(user.id || user._id)}
                      >
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
  );
};

export default AdminDashboard;
