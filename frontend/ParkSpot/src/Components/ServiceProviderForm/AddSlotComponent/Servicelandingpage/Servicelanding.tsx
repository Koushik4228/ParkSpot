import React from 'react';
import './Servicelanding.css'; // Import the CSS file
import Userheader from '../../Dashboardheader/dasheader';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../Footer/footer';

const Servicelanding: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/addbooking');
  };

  return (
    <>
      <Userheader />
      <div className="service-landing-container">
        <div className="image-container">
          <img src="src/Images/image2.png" alt="Parking" className="service-image" />
        </div>
        <div className="content-container">
          <h2 className="service-title">Start Earning Money From Your Parking Space</h2>
          <p className="service-description">
            Do you own an unused parking space or lot? Make the most of it by partnering with Parkify! 
            We provide a seamless platform for individuals and businesses to post their parking spaces.
          </p>
          <button className="list-space-button" onClick={handleButtonClick}>
            List Your Space
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Servicelanding;
