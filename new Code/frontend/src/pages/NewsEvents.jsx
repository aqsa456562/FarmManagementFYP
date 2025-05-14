"use client"

import { useState } from "react"
import NewsCard from "../components/NewsCard"
import news from "../data/news"
import events from "../data/events"
import "./NewsEvents.css"

const NewsEvents = () => {
  const [activeTab, setActiveTab] = useState("news")

  const displayItems = activeTab === "news" ? news : events

  return (
    <div className="news-events-page">
      <div className="news-hero">
        <div className="container">
          <h1 className="news-hero-title">News & Events</h1>
          <p className="news-hero-subtitle">
            Stay informed with the latest agricultural news, upcoming events, and industry developments.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="tabs">
          <button className={`tab-btn ${activeTab === "news" ? "active" : ""}`} onClick={() => setActiveTab("news")}>
            Latest News
          </button>
          <button
            className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Upcoming Events
          </button>
        </div>

        <div className="news-events-grid">
          {displayItems.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              slug={item.slug}
              image={item.image}
              title={item.title}
              date={item.date}
              summary={item.summary}
            />
          ))}
        </div>

        <div className="pagination">
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn next">Next →</button>
        </div>
      </div>

      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
            <p className="newsletter-description">
              Get the latest agricultural news, event updates, and farming tips delivered directly to your inbox.
            </p>

            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" className="newsletter-input" required />
              <button type="submit" className="btn newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsEvents
