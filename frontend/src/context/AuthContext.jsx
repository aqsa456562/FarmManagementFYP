"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const API_URL = "http://localhost:5000/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials)

      if (response.data.success) {
        const userData = response.data.user
        setCurrentUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)

      if (response.data.success) {
        const newUser = response.data.user
        setCurrentUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAdmin: currentUser?.isAdmin || false,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export default AuthProvider
