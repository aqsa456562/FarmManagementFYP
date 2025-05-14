"use client"

import { useState } from "react"
import CropCard from "../components/CropCard"
import crops from "../data/crops"
import "./CropManagement.css"

const CropManagement = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Crops" },
    { id: "grain", name: "Grains" },
    { id: "vegetable", name: "Vegetables" },
    { id: "fruit", name: "Fruits" },
    { id: "legume", name: "Legumes" },
    { id: "fiber", name: "Fiber Crops" },
    { id: "cash", name: "Cash Crops" },
  ]

  const filteredCrops = activeCategory === "all" ? crops : crops.filter((crop) => crop.category === activeCategory)

  return (
    <div className="crop-management-page">
      <div className="crop-hero">
        <div className="container">
          <h1 className="crop-hero-title">Crop Management</h1>
          <p className="crop-hero-subtitle">
            Comprehensive guides and information on various crops to help you maximize your yield and quality.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="crop-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="crops-grid">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              id={crop.id}
              slug={crop.slug}
              image={crop.images?.[0] || crop.image}
              name={crop.name}
              season={crop.season}
              duration={crop.duration}
              description={crop.description}
            />
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="no-crops-message">No crops found in this category. Please try another category.</div>
        )}
      </div>

      <div className="crop-management-info section">
        <div className="container">
          <h2 className="section-title">Effective Crop Management Practices</h2>
          <div className="crop-management-content">
            <div className="crop-management-text">
              <p>
                Successful crop management involves a combination of traditional knowledge and modern agricultural
                science. Here are some key practices that can help improve your crop yield and quality:
              </p>

              <h3>Soil Preparation</h3>
              <p>
                Proper soil preparation is the foundation of successful crop production. This includes testing soil
                quality, adjusting pH levels, adding organic matter, and ensuring proper drainage.
              </p>

              <h3>Crop Rotation</h3>
              <p>
                Rotating crops helps prevent soil depletion, reduces pest and disease problems, and can improve soil
                structure and fertility. Plan your rotation cycles based on crop families and nutrient needs.
              </p>

              <h3>Water Management</h3>
              <p>
                Efficient irrigation systems and water management practices are crucial for crop success, especially in
                areas with limited water resources. Consider drip irrigation, moisture sensors, and rainwater
                harvesting.
              </p>

              <h3>Integrated Pest Management (IPM)</h3>
              <p>
                IPM combines biological, cultural, physical, and chemical tools to minimize economic, health, and
                environmental risks from pests and pest management practices.
              </p>
            </div>

            <div className="crop-management-image">
              <img src="/crop-management-info.jpg" alt="Crop Management Practices" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropManagement
