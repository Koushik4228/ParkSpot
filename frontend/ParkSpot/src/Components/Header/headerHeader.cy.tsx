/// <reference types="cypress" />
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header/header';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { mount } from 'cypress/react18';
import { Store } from 'redux';
import * as React from 'react';



// Define the initial state type
interface AppState {
  user: {
    isLogIn: boolean;
  };
}

// Create the mock store
const mockStore = configureStore<AppState>([]);
let store: MockStoreEnhanced<AppState>;

describe('Header', () => {
  beforeEach(() => {
    store = mockStore({
      user: { isLogIn: false }, // Initial state with user logged out
    });
  });

  it('renders the header with all links and logo', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    // Verify the logo and title
    cy.get('.logo-container img').should('have.attr', 'alt', 'Logo');
    cy.get('.header-title').contains('PARKSPOT');

    // Check if navigation links are visible
    cy.get('.header-navbutton').contains('Home').should('exist');
    cy.get('.header-navbutton').contains('About Us').should('exist');
    cy.get('.header-navbutton').contains('Features').should('exist');
    cy.get('.header-navbutton').contains('FAQ').should('exist');
    cy.get('.header-navbutton').contains('Contact Us').should('exist');
  });

  it('shows login button when user is logged out', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    cy.get('.header-authbutton').contains('Login').should('exist');
    cy.get('.header-authbutton').contains('Logout').should('not.exist');
  });

  it('shows logout button when user is logged in', () => {
    store = mockStore({
      user: { isLogIn: true },
    });

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    cy.get('.header-authbutton').contains('Logout').should('exist');
    cy.get('.header-authbutton').contains('Login').should('not.exist');
  });

  it('navigates to login page on login button click', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    
  });

  it('toggles menu on button click', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
           <Header />
        </MemoryRouter>
      </Provider>
    );

    cy.get('.header-navlinks').should('not.have.class', 'active');
    cy.get('.toggle-button').click();
    cy.get('.header-navlinks').should('have.class', 'active');
    cy.get('.toggle-button').click();
    cy.get('.header-navlinks').should('not.have.class', 'active');
  });
});
