


import React, { useState, useEffect, useRef } from 'react';
import './Userheader.css'; // CSS file for styles
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../Accounts/AppSlicer/userslicer';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import ViewProfile from '../../Profile/ViewProfile';


const Userheader: React.FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
 

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };


  return (
    <>
      <header className="userHeader">
        <Link to="/">
          <img src="src/Images/Logfinal.jpg" alt="Logo" className="logoImage" />
        </Link>
        <h1 className="appTitle">PARKSPOT</h1>

        <nav className="navLinks10">
          <Link to="/viewslots" className="navLink">View Slots</Link>
          <Link to="/viewuserbooking" className="navLink">My Bookings</Link>
        </nav>

      
        <div>
              <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
        <img
          src="https://images.vexels.com/content/147101/preview/instagram-profile-button-68a534.png" // Replace this with your image URL
          alt="Profile"
          style={{ width: "30px", height: "30px", borderRadius: "50%" }} // Adjust as needed
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <Dropdown.Item as={Link} to="/viewprofile">View Profile</Dropdown.Item>
      <Dropdown.Item as={Link} to="/editprofile">Edit Profile</Dropdown.Item>
        <Dropdown.Item  onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </div>
       
      </header>
      {/* <Userlanding /> Uncomment if needed */}
    </>
  );
};

export default Userheader;
