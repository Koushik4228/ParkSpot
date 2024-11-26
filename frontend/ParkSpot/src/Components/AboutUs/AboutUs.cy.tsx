import React from 'react';
import AboutUs from './AboutUs';

import { beforeEach, describe, it } from 'node:test';

describe('<AboutUs />', () => {
  beforeEach(() => {
    // cy.mount(<AboutUs />);
    cy.mount(<AboutUs></AboutUs>)
  });

  it('renders the header', () => {
    cy.get('.header-wrapper').should('exist');
  });

  it('renders the overview section', () => {
    cy.get('.overview-wrapper').should('exist');
  });

  it('renders the image with correct attributes', () => {
    cy.get('.image-area img')
      .should('have.attr', 'alt', 'Illustration of a mobile phone with a location pin and a person standing next to it')
      .and('have.attr', 'src', 'src/images/aboutus1.png')
      .and('have.attr', 'height', '800')
      .and('have.attr', 'width', '200');
  });

  it('renders the company overview text', () => {
    cy.contains('h1', 'Company Overview:').should('exist');
    cy.contains('p', 'ParkSpot is a leading provider of parking solutions for businesses.').should('exist');
  });

  it('renders the services text', () => {
    cy.contains('h1', 'Our Services:').should('exist');
    cy.contains('p', 'At ParkSpot, we aim to transform the parking experience by offering a seamless and efficient way to find and book parking slots.').should('exist');
  });

  it('renders the footer', () => {
    cy.get('footer').should('exist');
  });
});
