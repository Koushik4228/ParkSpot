import React from 'react';
import './parkingprovider.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const ParkingProvider: React.FC = () => {
    const navigate = useNavigate(); // Using useNavigate hook

    // Function to handle arrow click and navigate
    const handleArrowClick = () => {
        navigate('/signupservice'); // Navigate to the signup page for service providers
    };

    return (
        <div className="provider-container" data-aos="fade-up" data-aos-once="true">
            <div className="provider-text">
                <h1 className="provider-title">Are you a parking provider?</h1>
                <p className="provider-description">
                    "Managing a large fleet? ParkSpot solutions offer efficient parking options to keep your operations running smoothly."
                </p>
            </div>
            <div
                className="provider-arrow"
                data-aos="fade-right"
                data-aos-once="true"
                onClick={handleArrowClick} // Attach click handler to navigate
            >
                <i className="fas fa-arrow-right"></i>
            </div>
        </div>
    );
};

export default ParkingProvider;
