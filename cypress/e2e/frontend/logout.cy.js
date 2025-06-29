import HomePage from '../../support/pageObjects/HomePage';

describe('Testes da Funcionalidade de Logout', () => {

    it('Deve realizar o logout de um usuário comum com sucesso', () => {

        cy.createUserApi(false).then(userData => {
            cy.loginUI(userData.email, userData.password);
        });

        cy.url().should('include', '/home');
        HomePage.fazerLogout();
        cy.url().should('include', '/login');
        cy.contains('h1', 'Login').should('be.visible');
    });
});