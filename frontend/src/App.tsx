import './App.css'
import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  )
}
export default App
