import React from 'react'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Service from '../components/Service'
import about from '../assets/images/aboutphoto.jpg'


const About = () => {
  return (
    <>
      <Hero img={about} pageName="About" />
     <div style={{paddingLeft: '37%'}}  >
        <div className="max-w-md">
         
          <p style={{fontSize: '20px', fontFamily: 'cursive'}} className="mb-5">
            Welcome to RentMyRide, your trusted platform for hassle-free vehicle rentals. 
            Whether you need a car for a weekend getaway, a luxury ride for a special occasion, or a reliable daily commute option, we’ve got you covered.
          </p>

          <p style={{fontSize: '20px', fontFamily: 'cursive'}} className="mb-5">
            At RentMyRide, we believe in making transportation seamless, affordable, and accessible. 
            Our platform connects vehicle owners with renters, offering a wide selection of cars, bikes, and specialty vehicles to match every need.
          </p>
        </div>
      </div>

      <Service />
      <Footer />
    </>
  )
}

export default About
