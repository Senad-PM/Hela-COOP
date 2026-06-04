import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import Admin from '../pages/Admin'

const App = () => {

  const location = useLocation()

  return (
    <div>
      {location.pathname !== '/admin' && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App