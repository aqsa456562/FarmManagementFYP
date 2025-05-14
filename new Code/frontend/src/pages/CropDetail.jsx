"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import crops from "../data/crops"
import "./CropDetail.css"

const CropDetail = () => {
  const { slug } = useParams()
  const [crop, setCrop] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the crop data from an API
    // For now, we'll use our local data
    const fetchCrop = () => {
      setLoading(true)

      // Find crop by slug or id
      const foundCrop = crops.find((c) => c.slug === slug || c.id.toString() === slug)

      if (foundCrop) {
        setCrop(foundCrop)
      }

      setLoading(false)
    }

    fetchCrop()
  }, [slug])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading crop information...</p>
      </div>
    )
  }

  if (!crop) {
    return (
      <div className="crop-not-found">
        <h2>Crop Not Found</h2>
        <p>The crop you are looking for does not exist or has been removed.</p>
        <Link to="/crop-management" className="btn">
          Back to Crop Management
        </Link>
      </div>
    )
  }

  return (
    <div className="crop-detail-page">
      <div
        className="crop-detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${crop.images?.[0] || "/crops/default-crop.jpg"})`,
        }}
      >
        <div className="container">
          <h1 className="crop-detail-title">{crop.name}</h1>
          <p className="crop-detail-subtitle">{crop.scientificName}</p>
        </div>
      </div>

      <div className="container section">
        <div className="crop-detail-nav">
          <Link to="/crop-management" className="crop-nav-link">
            <i className="fas fa-arrow-left"></i> Back to Crops
          </Link>
        </div>

        <div className="crop-detail-content">
          <div className="crop-detail-main">
            <div className="crop-detail-images">
              <div className="crop-main-image">
                <img src={crop.images?.[0] || "/placeholder.svg"} alt={crop.name} />
              </div>
              {crop.images && crop.images.length > 1 && (
                <div className="crop-image-thumbnails">
                  {crop.images.map((img, index) => (
                    <div key={index} className="crop-thumbnail">
                      <img src={img || "/placeholder.svg"} alt={`${crop.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="crop-detail-info">
              <div className="crop-info-card">
                <h3>Crop Information</h3>
                <ul className="crop-info-list">
                  <li>
                    <strong>Name:</strong> {crop.name}
                  </li>
                  <li>
                    <strong>Scientific Name:</strong> {crop.scientificName}
                  </li>
                  <li>
                    <strong>Category:</strong> {crop.category.charAt(0).toUpperCase() + crop.category.slice(1)}
                  </li>
                  <li>
                    <strong>Growing Season:</strong> {crop.season}
                  </li>
                  <li>
                    <strong>Duration:</strong> {crop.duration}
                  </li>
                </ul>
              </div>

              <div className="crop-description-section">
                <h2>Overview</h2>
                <p>{crop.fullDescription}</p>
              </div>

              <div className="crop-cultivation-section">
                <h2>Cultivation Guide</h2>

                <div className="cultivation-step">
                  <h3>Planting</h3>
                  <p>{crop.planting}</p>
                </div>

                <div className="cultivation-step">
                  <h3>Care & Maintenance</h3>
                  <p>{crop.care}</p>
                </div>

                <div className="cultivation-step">
                  <h3>Harvesting</h3>
                  <p>{crop.harvesting}</p>
                </div>

                <div className="cultivation-step">
                  <h3>Pests & Diseases</h3>
                  <p>{crop.pests}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="crop-detail-sidebar">
            <div className="sidebar-card">
              <h3>Related Resources</h3>
              <ul className="resource-links">
                <li>
                  <a href="#">
                    <i className="fas fa-file-pdf"></i> {crop.name} Growing Guide
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-video"></i> {crop.name} Cultivation Video
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-calculator"></i> Yield Calculator
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-chart-line"></i> Market Trends for {crop.name}
                  </a>
                </li>
              </ul>
            </div>

            <div className="sidebar-card">
              <h3>Expert Advice</h3>
              <p>Need personalized advice on growing {crop.name}?</p>
              <Link to="/contact" className="btn sidebar-btn">
                Contact Our Experts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropDetail
