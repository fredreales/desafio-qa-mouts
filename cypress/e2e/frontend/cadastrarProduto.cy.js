import HomePage from '../../support/pageObjects/HomePage';
import CadastrarProdutosPage from '../../support/pageObjects/CadastrarProdutosPage';
import ListarProdutosPage from '../../support/pageObjects/ListarProdutosPage';
import { faker } from '@faker-js/faker';

describe('Testes de Gerenciamento de Produtos (Admin)', () => {

    beforeEach(() => {

        cy.createUserApi(true).then(userData => {
            cy.loginUI(userData.email, userData.password);
        });
    });

    it('Deve cadastrar e excluir um produto com sucesso', () => {
        const produto = {
            nome: "Produto E2E - " + faker.string.uuid(),
            preco: faker.number.int({ min: 100, max: 2000 }),
            descricao: faker.commerce.productDescription(),
            quantidade: faker.number.int({ min: 1, max: 100 })
        };

        cy.intercept('POST', '**/produtos').as('postProduto');
        cy.intercept('DELETE', '**/produtos/*').as('deleteProduto');

        HomePage.clicarCadastrarProdutos();
        CadastrarProdutosPage.preencherFormulario(produto.nome, produto.preco, produto.descricao, produto.quantidade);
        CadastrarProdutosPage.submeterCadastro();
        cy.wait('@postProduto').its('response.statusCode').should('eq', 201);

        HomePage.clicarListarProdutos();
        ListarProdutosPage.excluirProdutoDaLista(produto.nome);
        cy.wait('@deleteProduto').its('response.statusCode').should('eq', 200);
        cy.contains('tr', produto.nome).should('not.exist');
    });
});