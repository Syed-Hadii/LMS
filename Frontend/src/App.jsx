import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login"
import Admin from './admin/Pages/Admin';
import ProtectedRoute from './Components/protectedRoute';

const App = () => {
  return (
    <div >

      
      <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/admin/*' element ={ <Admin/>} />
          {/* <Route path='/admin/*' element={ <ProtectedRoute element={<Admin/>} /> } /> */}
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
