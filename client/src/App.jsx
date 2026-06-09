import React from 'react'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Admin from '../pages/Admin'
import ProtectedRoute from '../pages/ProtectedRoute'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/admin' element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App