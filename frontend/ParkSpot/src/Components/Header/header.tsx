import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Accounts/AppSlicer/userslicer';
import { RootState } from '../Accounts/Store/mystore'; // Adjust path as necessary
import { useState } from 'react';
 
const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLogIn);
 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
 
  const handleLogin = () => {
    navigate('/login');
  };
 
  const handleSignUp = () => {
    navigate('/signup');
  };
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 
  return (
<header className="main-header">
<div className="logo-title-container">
<Link to="/" className="logo-container">
<img src="src/Images/Logfinal.jpg" alt="Logo" className="header-logo" />
</Link>
<h1 className="header-title">PARKSPOT</h1>
</div>
<button className="toggle-button" onClick={toggleMenu}>
&#9776;
</button>

<div id='g1'>
<nav className={`header-navlinks ${isMenuOpen ? 'active' : ''}`}>
<Link to="/" className="header-navbutton">Home</Link>
<Link to="/Aboutus" className="header-navbutton">About Us</Link>
<Link to="/Features" className="header-navbutton">Features</Link>
<Link to="/FAQ" className="header-navbutton">FAQ</Link>
<Link to="/Contact" className="header-navbutton">Contact Us</Link>
</nav>
</div>

        {isLoggedIn ? (
<button onClick={handleLogout} className="header-authbutton">
            Logout
</button>
        ) : (
<>
<button onClick={handleLogin} className="header-authbutton">
              Login/SignUp
</button>

</>
        )}

</header>
  );
};

export default Header;