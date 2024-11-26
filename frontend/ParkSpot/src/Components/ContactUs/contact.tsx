import React from 'react';
import './contact.css'; // Import the CSS file
import Header from '../Header/header';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Contact: React.FC = () => {
    return (
        <>
            <Header />
            <section className="contact-overlay">
                <div className="contact-header">
                    <div className="contact-header-text">
                        <p className='contact-p'>Question?</p>
                        <h1>Let's get this sorted out</h1>
                    </div>
                </div>
                <div className="contact-intro">
                    <h1>Let us help you best</h1>
                    <p>Here for app help? Want to connect with a ParkSpot sales rep? Select from the options below to find your quickest answer.</p>
                </div>
                <div className="contact-info">
                    <div className="contact-info-section">
                        <h3>Address</h3>
                        <p>Happiest Minds Technologies Limited, SMILES 1, SJR Equinox, Sy.No.47/8, Doddathogur Village, EC</p>
                    </div>
                    <div className="contact-info-section">
                        <h3>Contact</h3>
                        <p>+91 9988776655</p>
                        <p>parkspot1@gmail.com</p>
                        <div className="contact-social-links">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div className="contact-info-section">
                        <h3>Opening Hours</h3>
                        <p>Mon - Fri: 10:00 am – 6:00 pm</p>
                        <p>Saturday: 10:00 am – 3:00 pm</p>
                        <p>Sunday: Holiday</p>
                    </div>
                </div>
            </section>

            <footer className="contact-footer">
                <p className='contact-footer-p'>© 2024 ParkSpot. All rights reserved.</p>
                {/* <a href="/privacy-policy">Privacy Policy</a> */}
                {/* <span> | </span> */}
                {/* <a href="/terms-of-service">Terms of Service</a> */}
            </footer>
        </>
    );
};

export default Contact;
