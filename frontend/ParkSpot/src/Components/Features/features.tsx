import { useState } from 'react';
import './Features.css'; // Import the global CSS file
import Header from '../Header/header';
import Footer from '../Footer/footer';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

// Define the Features component
const Features = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null); // Track which card is expanded

  const handleCardClick = (index: number) => {
    // Toggle the card expansion
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <>
      <Header />

      {/* Intro Section */}
      <div className="features-section">
        <div className="features-description">
          <h1 className="features-title">
            Why Parking With ParkSpot Is Good
          </h1>
          <p className="features-intro-text">
            Finding cheap and best parking space with ease. Providing a lot of features that no other parking platforms
            provide. Booking, Searching, Safety & Security, and many other services at ParkSpot which make
            your parking experience better than ever.
          </p>
        </div>
        <div className="features-visual">
          <img src="src/images/Designer5.png" alt="ParkSpot Features" className="features-image" />
        </div>
      </div>

      {/* Card Section */}
      <div className="features-card-container">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`feature-card ${expandedCard === index ? 'feature-card--expanded' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="feature-card-icon">
              <FontAwesomeIcon icon={card.icon} size="2x" />
            </div>
            <h3 className="feature-card-title">{card.title}</h3>
            <p className="feature-card-description">{card.description}</p>

            {/* Conditionally render additional content if the card is expanded */}
            {expandedCard === index && (
              <div className="feature-card-expanded-content">
                <p>{card.expandedDescription}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

// Updated card data with detailed "Booking" info
const cardData = [
  {
    title: 'Searching',
    description:
      'People love their cars and hence they would want to keep their vehicles in a safe and secure parking area.',
    expandedDescription:
      'They would want a parking area where there will be security guards, CCTV cameras, etc. ParkSpot provides a genuine and authentic parking space for its users so that no mishappening will be done to the user’s property. ParkSpot provides security to private property as well so that users don’t need to worry about the place where they are keeping their vehicles.',
    icon: faSearch, // Font Awesome Search icon
  },
  {
    title: 'Booking',
    description:
      'Who doesn’t want to reserve a spot? It is easy to park vehicles beside the roadside but everyone knows what might be the consequences.',
    expandedDescription:
      'The usual consequences will be that the user’s vehicle might get towed away. Just like people going to Movie Theatres after booking a ticket so that they don’t need to worry about the availability of tickets after going to the Theatre, users can also book their car parking space by using our platform and will be assured that there will be a parking space reserved for their vehicles.',
    icon: faCalendarAlt, // Font Awesome Calendar icon
  },
  {
    title: 'Security',
    description:
      'At ParkSpot, we prioritize security to ensure your vehicle stays safe in the parking spots that you reserve.',
    expandedDescription:
      'ParkSpot provides features like security guards, CCTV surveillance, and gated parking lots to ensure the safety of your vehicles.',
    icon: faShieldAlt, // Font Awesome Shield icon
  },
];

export default Features;
