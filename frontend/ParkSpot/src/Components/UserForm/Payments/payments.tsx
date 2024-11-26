import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './payments.css'; // Import the CSS file
import Userheader from '../UserDashboardheader/Userheader';

const Payments: React.FC = () => {
  const location = useLocation();
  const { slotId, userName, price, vehicleNumber } = location.state || {};
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      console.error('Razorpay library not loaded.');
      return; // Exit if Razorpay is not loaded
    }

    const options = {
      key: 'rzp_test_vv1FCZvuDRF6lQ', // Replace with your Razorpay key
      amount: Math.round(price * 100), // Amount in paise
      currency: 'INR',
      name: 'Parking Booking',
      description: 'Booking for parking slot',
      handler: async (response: any) => {
        const paymentId = response.razorpay_payment_id;

        try {
          navigate('/feedback', { state: { slotId } });
          //   Swal.fire('Success', 'Payment completed successfully!', 'success');
          //   navigate('/thankYou'); // Redirect to thank you page after payment
        } catch (error) {
          console.error('Error processing payment:', error);
          //   Swal.fire('Error', 'Payment failed.', 'error');
        }
      },
      theme: {
        color: '#F7ca4e',
      },
    };

    const pay = new (window as any).Razorpay(options);
    pay.open();
  };

  return (
    <><Userheader /><div className="unique-payment-wrapper">
      <div className="unique-payment-card">
        <h2>Payment Details</h2>
        <p>Slot Id : {slotId}</p>
        <p>User Name: {userName}</p>
        <p>Vehicle Number: {vehicleNumber}</p>
        <p>Price: {price ? price.toFixed(2) : '0.00'}/-</p>

        <button onClick={handlePayment} className="unique-pay-button">
          Pay Now
        </button>
      </div>
    </div></>
  );
};

export default Payments;
