import React from 'react'
import Navbar from '../components/Navbar'
import bg1 from '../assets/image/bg1.jpg'
import image1 from '../assets/image/image1.jpg'
import image2 from '../assets/image/image2.jpg'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
   <div className='h-screen flex flex-col'>
      <Navbar />
      <div
        className="flex-grow w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="hero min-h-screen flex items-center justify-center">
          <div className="hero-content flex-col lg:flex-row-reverse px-4 py-6 md:px-8 lg:px-16">
            {/* Image */}
            <img
              src={image1}
              className="max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-2xl ml-0 lg:ml-6 mb-6 lg:mb-0"
              alt="product"
            />
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-400">
                Welcome to Market!
              </h1>
              <p className="py-6 text-black">
                Hello, we are JJM Soap and Detergent, and we are super excited to
                welcome you to our shop. Think of me as your guide in this journey. I
                am here to make your experience amazing.
              </p>
              <p className="mb-4">To proceed with ordering our product, just click Get Started or Login.</p>
              <Link to="/login" className="btn btn-outline btn-accent">Get Started</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  )
}

export default Home
