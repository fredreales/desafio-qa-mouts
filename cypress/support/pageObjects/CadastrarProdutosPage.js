const ELEMENTS = {
  nomeInput: '[data-testid="nome"]',
  precoInput: '[data-testid="preco"]',
  descricaoInput: '[data-testid="descricao"]',
  quantidadeInput: '[data-testid="quantity"]',
  cadastrarButton: '[data-testid="cadastarProdutos"]'
};

class CadastrarProdutosPage {
  preencherFormulario(nome, preco, descricao, quantidade) {
    cy.get(ELEMENTS.nomeInput)
      .should('be.visible')
      .type(nome);

    cy.get(ELEMENTS.precoInput)
      .should('be.visible')
      .type(preco);

    cy.get(ELEMENTS.descricaoInput)
      .should('be.visible')
      .type(descricao);

    cy.get(ELEMENTS.quantidadeInput)
      .should('be.visible')
      .type(quantidade);
  }

  submeterCadastro() {
    cy.get(ELEMENTS.cadastrarButton)
      .should('be.visible')
      .click();
  }
}

export default new CadastrarProdutosPage();