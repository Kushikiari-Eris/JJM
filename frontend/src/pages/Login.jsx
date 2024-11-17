import axios from 'axios'
import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import AuthContext from '../context/AuthContext'
import bg2 from '../assets/image/bg2.jpg'
import axiosInstance from '../utils/AxiosInstance'



const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const { getLoggedIn } = useContext(AuthContext)

    const login = async (e) => {
        e.preventDefault()
    
        try {
          const loginData = {
            email,
            password,
          }
    
         // Make login request to backend
         const response = await axios.post('http://localhost:7684/api/login', loginData);

         // Assuming response contains the user data with _id
         const userId = response.data.user._id; // Extract userId from response
         Cookies.set('userId', userId, { expires: 7 }); // Set userId in cookies for 7 days

         // Update logged-in state
         await getLoggedIn();

         // Success alert
         Swal.fire({
             title: 'Login Successful!',
             text: 'You have logged in successfully.',
             icon: 'success',
             confirmButtonText: 'OK'
         });


        } catch (error) {
          console.error(error)
          if (error.response) {
            const { status, data } = error.response;
      
            // Handle specific error statuses
            if (status === 400 || status === 401) {
              // Extract the errorMessage from the backend response
              const errorMessage = data.errorMessage || "An error occurred";
      
              // Show SweetAlert with the error message
              Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              // Generic error for other statuses
              Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } else {
            // Network or other errors
            Swal.fire({
              title: 'Network Error',
              text: 'Unable to reach the server. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        }
      }

  return (
    <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="hero bg-base-200 min-h-screen" style={{ backgroundImage: `url(${bg2})` }}>
            <div className="hero-content flex-col lg:flex-row-reverse">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold text-green-400 text-right">Sign up</h1>
                <p className="py-6 text-black text-right">
                Access your account by logging in and enjoy exclusive member perks, personalized recommendations, and more!.
                </p>
              </div>
              <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <form className="card-body" onSubmit={login}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input type="email" placeholder="email" className="input input-bordered" onChange={(e) => setEmail(e.target.value)} value={email}/>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input type="password" placeholder="password" className="input input-bordered" onChange={(e) => setPassword(e.target.value)} value={password}/>
                  </div>
                  <div className='text-sm'>
                    <p>Dont have an account? <a href='/register' className='underline hover:text-blue-500'>Create an Account</a></p>
                  </div>
                  <div className="form-control mt-4">
                    <button className="btn btn-primary">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Login