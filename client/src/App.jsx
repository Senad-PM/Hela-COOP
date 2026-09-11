import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import AdminDashboard from '../pages/AdminDashboard'
import ProtectedRoute from '../routes/ProtectedRoute'
import SetPassword from '../pages/SetPassword'
import StaffDashboard from '../staffDashboard/StaffDashboard'

const HIDDEN_NAVBAR_PATHS = ['/admin', '/staff', '/set-password']

const App = () => {

  const location = useLocation()
  const hideNavbar= HIDDEN_NAVBAR_PATHS.some(
    (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  )

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/staff' element={
          <ProtectedRoute allowedRoles={['staff', 'manager']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path='/set-password/:token' element={<SetPassword />} />
      </Routes>
    </div>
  )
}

export default App