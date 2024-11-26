import { Provider } from 'react-redux'; // Import Redux Provider
import Features from './Features/features';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter for routing context
import { mount } from 'cypress/react18';
import store from '../Components/Accounts/Store/mystore'; // Import your Redux store

describe('<Features />', () => {
  it('renders without crashing', () => {
    // Wrap your component with Redux Provider and MemoryRouter
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Features />
        </MemoryRouter>
      </Provider>
    );

    // Check if the main title is rendered
    cy.get('.features-title').contains('Why Parking With ParkSpot Is Good').should('exist');
    
    // Check if the intro description is rendered
    cy.get('.features-intro-text').contains('Finding cheap and best parking space with ease').should('exist');
  });

  it('toggles card expansion when clicked', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Features />
        </MemoryRouter>
      </Provider>
    );

    // Check the first card is not expanded initially
    cy.get('.feature-card').first().should('not.have.class', 'feature-card--expanded');
    
    // Click on the first card
    cy.get('.feature-card').first().click();

    // Check that the first card expands
    cy.get('.feature-card').first().should('have.class', 'feature-card--expanded');

    // Click on the first card again to collapse it
    cy.get('.feature-card').first().click();

    // Check that the first card collapses
    cy.get('.feature-card').first().should('not.have.class', 'feature-card--expanded');
  });

  it('displays the correct icons in each card', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Features />
        </MemoryRouter>
      </Provider>
    );

    
    

  });

  it('shows expanded content when a card is clicked', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Features />
        </MemoryRouter>
      </Provider>
    );

    // Check if the expanded content is not visible initially
    cy.get('.feature-card-expanded-content').should('not.exist');

    // Click on the first card to expand it
    cy.get('.feature-card').first().click();

    // Check that the expanded content for the first card is visible
    cy.get('.feature-card-expanded-content').first().should('exist').and('contain', 'They would want a parking area where there will be security guards, CCTV cameras, etc.');
  });

  it('checks the features image is displayed', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Features />
        </MemoryRouter>
      </Provider>
    );

    // Ensure the features image is displayed correctly
    cy.get('.features-image').should('have.attr', 'src').and('include', 'src/images/Designer5.png');
  });
});
