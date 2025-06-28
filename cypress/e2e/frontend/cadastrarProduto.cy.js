import LoginPage from '../../support/pageObjects/LoginPage';
import HomePage from '../../support/pageObjects/HomePage';
import CadastrarProdutosPage from '../../support/pageObjects/CadastrarProdutosPage';
import ListarProdutosPage from '../../support/pageObjects/ListarProdutosPage';

describe('Cadastro de produtos com usuario ADMIN', () => {

    const produto = {
        nome: 'Produto teste',
        preco: 999,
        descricao: 'Teste cadastrando um novo produto',
        quantidade: 100
    };

    beforeEach(() => {
        cy.fixture('users').then(users => {
            LoginPage.fazerLogin(users.admin.email, Cypress.env('ADMIN_PASSWORD'));
        });
    
    });

    it('Cenário 1: Deve cadastrar um novo produto com sucesso', () => {
        cy.intercept('POST', '**/produtos').as('postProduto');

        HomePage.clicarCadastrarProdutos();
        CadastrarProdutosPage.preencherFormulario(produto.nome, produto.preco, produto.descricao, produto.quantidade);
        CadastrarProdutosPage.submeterCadastro();

        cy.wait('@postProduto').its('response.statusCode').should('eq', 201);
    });

    it('Cenário 2: Deve listar e validar o produto recém criado e deleta-lo', () => {
       cy.intercept('DELETE', '**/produtos/*').as('deleteProduto');

        HomePage.clicarListarProdutos();
        ListarProdutosPage.validarProdutoNaLista(produto.nome, produto.preco, produto.descricao);
        ListarProdutosPage.excluirProdutoDaLista(produto.nome);

        cy.wait('@deleteProduto').its('response.statusCode').should('eq', 200);
        cy.contains('tr', produto.nome).should('not.exist');
    });
});