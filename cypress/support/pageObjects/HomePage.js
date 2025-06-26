const ELEMENTS = {
  textoBoasVindasAdmin: '.jumbotron h1',
  tituloStore: 'h1',
  botaoCadastrarUsuarios: '[data-testid="cadastrar-usuarios"]',
  botaoCadastrarProdutos: '[data-testid="cadastrar-produtos"]',
  botaoListarProdutos: '[data-testid="listar-produtos"]',
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

  validarTituloStore() {
    cy.get(ELEMENTS.tituloStore).should('have.text', 'Serverest Store');
  }
}

export default new HomePage();