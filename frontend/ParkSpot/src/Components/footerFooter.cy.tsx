import React from 'react';
import Footer from './Footer/footer';
import { mount } from 'cypress/react18';  // Import from @cypress/react18

describe('<Footer />', () => {
  it('renders without crashing', () => {
    mount(<Footer />);
  });

  it('displays the correct title', () => {
    mount(<Footer />);
    cy.get('.custom-class').contains('ParkSpot').should('exist');
  });

  it('displays the correct description', () => {
    mount(<Footer />);
    cy.get('.custom-width').contains('We provide easy booking, real-time availability, and secure payment options to make parking hassle-free.').should('exist');
  });

  it('displays Quick Links with correct links', () => {
    mount(<Footer />);
    cy.get('.footer-custom').within(() => {
      cy.get('a').should('have.length', 3);
      cy.get('a').eq(0).should('have.attr', 'href', '/').and('contain', 'Home');
      cy.get('a').eq(1).should('have.attr', 'href', '/Aboutus').and('contain', 'About Us');
      cy.get('a').eq(2).should('have.attr', 'href', '/contact').and('contain', 'Contact Us');
    });
  });

  it('displays Popular Parking Locations', () => {
    mount(<Footer />);
    cy.get('.footer-custom2').within(() => {
      cy.contains('MG Road').should('exist');
      cy.contains('Electronic City').should('exist');
      cy.contains('Indiranagar').should('exist');
      cy.contains('Koramangala').should('exist');
    });
  });

  it('displays the copyright text', () => {
    mount(<Footer />);
  
  });
});
