import HomePage from '../../support/pageObjects/HomePage';

describe('Testes de Busca e Adição de Produtos à Lista', () => {

    beforeEach(() => {
        
        cy.createUserApi(false).then(userData => {
            cy.loginUI(userData.email, userData.password);
        });
    });

    it('Deve buscar um produto, adicioná-lo à lista e retornar à página inicial', () => {
        const nomeProduto = 'Logitech MX Vertical';

        HomePage.buscarProduto(nomeProduto);
        HomePage.adicionarProdutoALista(nomeProduto);

        cy.url().should('include', '/minhaListaDeProdutos');
        HomePage.retornarParaPaginaInicial();
        cy.url().should('include', '/home');
        HomePage.validarTituloStore();
    });
});