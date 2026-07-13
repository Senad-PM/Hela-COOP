import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import Admin from '../pages/Admin'
import ProtectedRoute from '../pages/ProtectedRoute'

const App = () => {

  const location = useLocation()

  return (
    <div>
      {location.pathname !== '/admin' && location.pathname !== '/set-password' && !location.pathname.startsWith('/set-password/') && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path='/set-password/:token' element={<SetPassword />} />
      </Routes>
    </div>
  )
}

export default App