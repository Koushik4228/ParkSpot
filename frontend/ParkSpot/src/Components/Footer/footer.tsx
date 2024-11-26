
import * as React from 'react'
import './footer.css'
const Footer = () => {
  return (
    <div className='mx-10'>
        <div className='custom-layout'>
            {/* ----left-------- */}
            <div >
                <h3 className='custom-class' style={{color:'#f7ca4e'}}>ParkSpot</h3>
                <p className='custom-width '>
                
                <p className='custom-p'>We provide easy booking, real-time availability, and secure payment options to make parking hassle-free.</p>
                </p>
            </div>
            {/* --------center----------- */}
            <div className='footer-custom'>
                <h3 className='custom-text' style={{color:'#f7ca4e'}}>Quick Links</h3>
                <ul className='custom-flex'>
                <ul className='custom-flex1'>
                  <li><a className='custom-a' href="/">Home</a></li>
                  <li><a className='custom-a' href="/Aboutus">About Us</a></li>
                  <li><a className='custom-a' href="/contact">Contact Us</a></li>
                </ul>

                    
                </ul>
            </div>
            {/* ---------right----------- */}
            <div className='footer-custom2'>
                <h3 className='custom-text ' style={{color:'#f7ca4e'}}>Popular Parking Locations </h3>
    
                <ul className='custom-flex'>
                <li>MG Road</li>
             <li>Electronic City</li>
             <li>Indiranagar</li>
             <li>Koramangala</li>
                </ul>
            </div>
        </div>
        <div>
            {/* -----------Copyright------------ */}
            <hr />
            <p style={{textAlign:'center'}}>Copyright © 2024 - All Right Reserved</p>
        </div>
    </div>
  )
}
 
export default Footer