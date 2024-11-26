// import React from 'react';
import './LandingPage.css'; // Import the CSS for styling/
import Header from '../Header/header';
import ParkingMadeEasy from '../ParkingMadeEasy/ParkingMadeEasy';
// import ParkingSpaceRental from '../parkingspacerental/parkingspacerental';
import Footer from '../Footer/footer';
import ParkingCards from '../ParkingCards/ParkingCards';
import ParkingProvider from '../ParkingProvider/Parkingprovider';
import { Link } from 'react-router-dom';
// import ContactUs from '../ContactUs/contact';




const LandingPage = () => {
  <Header></Header>
  return (
   
    <div className="landing-page">
      <Header />
      <div className="overlay">
        <h1 className='landing-page-h1' > Reserve Your Parking</h1>
        <p className='landing-p' style={{color:'white'}}>Secure Parking, Anytime, Anywhere</p>
        <div className="search-container">
          <button className="search-button"><Link to='./justview' id='y1'>Click Here</Link></button>
        </div>
      </div>
      
      <ParkingCards></ParkingCards>
      <ParkingProvider></ParkingProvider>
      <ParkingMadeEasy></ParkingMadeEasy>
      <Footer/>
      {/* <ContactUs/> */}
    </div>
    
  );
};

export default LandingPage;

