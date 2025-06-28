import LoginPage from '../../support/pageObjects/LoginPage';
import HomePage from '../../support/pageObjects/HomePage';

describe('Testes de logout', () => {

    it('Deve realizar o logout de um usuário comum com sucesso', () => {

        cy.fixture('users').then(users => {
            LoginPage.fazerLogin(users.common.email, Cypress.env('COMMON_USER_PASSWORD'));
        });

        cy.url().should('include', '/home');
        HomePage.fazerLogout();
        cy.url().should('include', '/login');
        cy.contains('h1', 'Login').should('be.visible');
    });
});