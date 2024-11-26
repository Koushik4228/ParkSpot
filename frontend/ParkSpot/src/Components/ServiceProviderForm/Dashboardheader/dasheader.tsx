import React from 'react';
import './dasheader.css'; // CSS file for styles
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Accounts/AppSlicer/userslicer';

import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
 
const DashHeader = () => {
  const newid = useSelector((state:any)=>state.user.userId);
  console.log(newid);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout=()=>{
    dispatch(logout());
    navigate('/');
  }
  return (
    <header className="header2">
 
      <Link to="/"><img src="src/images/Logfinal.jpg" alt="" style={{ width: '100px', height: '70px' }} /></Link>
      <h1 className="title-dashboard">PARKSPOT</h1>
       {/* Application name */}
      
      <nav className="nav-links">
      <Link to='/addbooking' className="nav-button">AddSlot</Link>
      <Link to='/viewbooking' className="nav-button">ViewSlot</Link>
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
         {/* Login button */}
         {/* <button onClick = {handleLogout}  className="login-button">
        Logout
      </button> */}
    </header>
  );
};
 
export default DashHeader;
 