import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Login = () => {
  const url = "http://localhost:3002";
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  const navigate = useNavigate();
  
     const closeForm = () => {
       navigate("/"); 
  };
  
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${url}/adduser/login`, {
        email,
        password
      })
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token)
        console.log(response);
        
        navigate("/admin/dashboard")
      }
      else {
        setError("Invalid email or password")
      }
    } catch (error) {
      console.log(error);
      setError("Error logging in")
    }
  }
  


  return (
    <div>
     
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg ">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition duration-300"
            onClick={closeForm}
          >
            ✖
          </button>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
            <>
              <h2 className="text-2xl font-bold text-center animate-fade-in-down">
                Login
              </h2>
              <form
                className="space-y-4   animate-fade-in"
                onSubmit={handleLogin}
              >
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition duration-200">
                  Login
                </button>
              </form>
              
            </>
          
        </div>
      </div>
    </div>
  );
}

export default Login
