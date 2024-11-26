import React from 'react';
import './userlanding.css'; // Import the CSS file
import Userheader from '../UserDashboardheader/Userheader';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Footer/footer';

const Userlanding: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/viewslots');
  };

  return (
    <>
      <Userheader />
      <div className="user-landing-booking-section">
        <div className="image-wrapper">
          <img src="src/Images/welcome.png" alt="Parking" />
        </div>
        <div className="content-wrapper">
          <h2 className='prebook'>Pre book Your Space</h2>
          <p className='reserve'>Reserve your parking spot in advance for a hassle-free experience.</p>
          <p>Secure, convenient, and stress-free.</p>
          <button className="book-now-button" onClick={handleButtonClick} style={{ backgroundColor: '#f7ca4e' }}>
            Book now!
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Userlanding;
