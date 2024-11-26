import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css'; // Import the CSS file
import Userheader from '../UserDashboardheader/Userheader';

const ThankYou = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/viewuserbooking'); // Replace with your desired route
    };

    return (
        <><Userheader /><div className="thank-you-wrapper">
            <div className="thank-you-content">
                <h2>Thank You for Your Booking!</h2>
                <p>Your booking has been successfully confirmed. We appreciate your choice!</p>
                <p>Please click the button below to check in.</p>
                <button className="thank-you-action-button" onClick={handleClick}>
                    Click Here
                </button>
            </div>
        </div></>
    );
};

export default ThankYou;
