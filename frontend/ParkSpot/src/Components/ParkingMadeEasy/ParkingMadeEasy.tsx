import './ParkingMadeEasy.css';


const ParkingMadeEasy = () => {
  return (
    <div className="container-parkingmadeeasy">
      <div className="header" data-aos="fade-up" data-aos-once ="true">
        <h1>Parking Made Easy</h1>
        <p>You can plan and book your parking at thousands of parking spaces across India.</p>
      </div>
      <div className="features">
        <div className="feature" data-aos="fade-up" data-aos-delay="100" data-aos-once ="true">
          <img
            alt="Search icon"
            src="src/images/parkingmadeeasy2.jpg"
          />
          <h3>SEARCH</h3>
          <p>Search for all available parking options closest to your destination.</p>
        </div>
        <div className="feature" data-aos="fade-up" data-aos-delay="150" data-aos-once ="true">
          <img
            alt="Book icon"
            src="src/images/parkingmadeeasy3.jpg"
          />
          <h3>BOOK</h3>
          <p>Pre-book the perfect parking spot & Pay using convenient payment options.</p>
        </div>
        <div className="feature" data-aos="fade-up" data-aos-delay="200" data-aos-once ="true">
          <img
            alt="Park icon"
            src="src/images/parkimgmadeeasy1.jpg"
          />
          <h3>PARK</h3>
          <p>Navigate to your parking spot, Park your vehicle and enjoy a stress-free journey.</p>
        </div>
      </div>
    </div>
  );
};

export default ParkingMadeEasy;
