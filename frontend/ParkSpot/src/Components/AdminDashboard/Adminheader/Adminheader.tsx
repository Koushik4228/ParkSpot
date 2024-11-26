import React from 'react'; // Import React library
import './Adminheader.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate hooks from react-router-dom for routing
import { logout } from '../../Accounts/AppSlicer/userslicer'; // Import the logout action from the Redux slice
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks for dispatching actions and selecting state
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon component
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'; // Import specific icons from FontAwesome

const AdminHeader = () => {
  // Get the userId from the Redux state (assuming it is stored under 'user.userId')
  const newid = useSelector((state: any) => state.user.userId);
  console.log(newid); // Log the userId to the console for debugging

  // Initialize dispatch function to send actions to Redux store
  const dispatch = useDispatch();
  
  // Initialize the navigate function to programmatically navigate between routes
  const navigate = useNavigate();

  // Handle logout by dispatching the logout action and navigating to the home page ('/')
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action to clear user data from Redux
    navigate('/'); // Redirect user to the home page after logging out
  };

  return (
    <header className="adminheader">
      {/* Link to navigate to the homepage */}
      <Link to="/">
        {/* Logo image with width 100px and height 70px */}
        <img src="src/Images/Logfinal.jpg" alt="" style={{ width: '100px', height: '70px' }} />
      </Link>

      {/* Title of the header */}
      <h1 className="adminheadertitle">PARKSPOT</h1>

      <div className="icon-container">
        {/* Commented-out button section that was originally intended to show icons (for check and cross) */}
        {/* 
        <button className="icon-button">
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
        <button className="icon-button">
          <FontAwesomeIcon icon={faTimesCircle} />
        </button> 
        */}

        {/* Link to accepted data page with a check circle icon */}
        <Link to="/accepteddata" className="icon-link">
          <FontAwesomeIcon icon={faCheckCircle} className="icon-button" />
        </Link>

        {/* Link to rejected data page with a times circle icon */}
        <Link to="/rejecteddata" className="icon-link">
          <FontAwesomeIcon icon={faTimesCircle} className="icon-button" />
        </Link>
      </div>

      {/* Button to trigger logout */}
      <button onClick={handleLogout} className="login-button">
        Logout
      </button>
    </header>
  );
};

export default AdminHeader; // Export the AdminHeader component to be used in other parts of the app
