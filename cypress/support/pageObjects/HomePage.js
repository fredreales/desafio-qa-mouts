export const ELEMENTS = {
  textoBoasVindasAdmin: '.jumbotron h1',
  tituloStore: 'h1',
  botaoCadastrarUsuarios: '[data-testid="cadastrar-usuarios"]',
  botaoCadastrarProdutos: '[data-testid="cadastrar-produtos"]',
  botaoListarProdutos: '[data-testid="listar-produtos"]',
  campoBusca: '[data-testid="pesquisar"]',
  botaoPaginaInicial: '[data-testid="paginaInicial"]',
  botaoLogout: '[data-testid="logout"]',
  alert: '.alert'
};

class HomePage {
  validarBoasVindasAdmin(nomeUsuario) {
    cy.get(ELEMENTS.textoBoasVindasAdmin)
      .should('contain', 'Bem Vindo')
      .and('contain', nomeUsuario);
  }

  validarBotoesAdmin() {
    cy.get(ELEMENTS.botaoCadastrarUsuarios).should('be.visible');
    cy.get(ELEMENTS.botaoCadastrarProdutos).should('be.visible');
    cy.get(ELEMENTS.botaoListarProdutos).should('be.visible');
  }

   validarAusenciaBotoesAdmin() {
    cy.get(ELEMENTS.registerUsersButton).should('not.exist');
    cy.get(ELEMENTS.registerProductsButton).should('not.exist');
  }

  validarTituloStore() {
    cy.get(ELEMENTS.tituloStore).should('have.text', 'Serverest Store');
  }

  buscarProduto(nomeProduto) {
    cy.get(ELEMENTS.campoBusca).type(nomeProduto);
  }

  adicionarProdutoALista(nomeProduto) {
    cy.contains('.card-title', nomeProduto)
      .parents('.card')
      .find('button.btn-primary')
      .click();
  }

  retornarParaPaginaInicial() {
    cy.get(ELEMENTS.botaoPaginaInicial).click();
  }

  validarMensagemDeAlerta(mensagem) {
    cy.get(ELEMENTS.alert)
      .should('be.visible')
      .should('have.text', mensagem);
  }

  fazerLogout() {
    cy.get(ELEMENTS.botaoLogout).click();
  }

  clicarCadastrarProdutos() {
    cy.get(ELEMENTS.botaoCadastrarProdutos).click();
  }

  clicarListarProdutos() {
    cy.get(ELEMENTS.botaoListarProdutos).click();
  }
}

export default new HomePage();