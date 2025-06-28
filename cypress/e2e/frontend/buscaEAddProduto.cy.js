import LoginPage from '../../support/pageObjects/LoginPage';
import HomePage from '../../support/pageObjects/HomePage';

describe('Testes de adição de produto à lista de compras', () => {

    beforeEach(() => {
        cy.fixture('users').then(users => {
            LoginPage.fazerLogin(users.common.email, Cypress.env('COMMON_USER_PASSWORD'));
        });
    });

    it('Deve adicionar um produto à lista de compras, navegar e retornar à página inicial', () => {
        const nomeProduto = 'Logitech MX Vertical';

        HomePage.buscarProduto(nomeProduto);
        HomePage.adicionarProdutoALista(nomeProduto);

        cy.url().should('include', '/minhaListaDeProdutos');
        HomePage.retornarParaPaginaInicial();
        cy.url().should('include', '/home');
        HomePage.validarTituloStore();
    });
});