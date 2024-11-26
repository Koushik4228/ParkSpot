import React from 'react';
import './AboutUs.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';

const AboutUs: React.FC = () => {
    return (
        <>
            <div className="header-wrapper">
                <Header />
            </div>
            <div className="overview-wrapper">
                <div className="image-area">
                    <img
                        alt="Illustration of a mobile phone with a location pin and a person standing next to it"
                        height="800"
                        src="src/images/aboutus1.png"
                        width="200"
                    />
                </div>
                <div className="text-area">
                    <h1>Company Overview:</h1>
                    <p>
                        ParkSpot is a leading provider of parking solutions for businesses. We offer a wide range of services, including parking management, parking management, and parking management.
                    </p>
                    <h1>Our Services:</h1>
                    <p>
                        At ParkSpot, we aim to transform the parking experience by offering a seamless and efficient way to find and book parking slots. Our mission is to reduce traffic congestion and save you time by providing a reliable and convenient parking service. We prioritize efficiency, reliability, and customer satisfaction above all else.
                    </p>
                    <p>
                        Let's get started and <a className="link-highlight" href="#">get your Parking Spot</a> or <a className="link-highlight" href="#">register your Parking Spot</a> with your parking companion.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
