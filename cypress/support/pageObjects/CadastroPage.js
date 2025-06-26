export const ELEMENTS = {
  nomeInput: '[data-testid="nome"]',
  emailInput: '[data-testid="email"]',
  passwordInput: '[data-testid="password"]',
  adminCheckbox: '[data-testid="checkbox"]',
  cadastrarButton: '[data-testid="cadastrar"]',
  successAlert: '.alert-link',
  errorAlert: '.alert.alert-secondary'
};

class CadastroPage {
  acessarCadastro() {
    cy.visit('/cadastrarusuarios');
  }

  preencherFormulario(nome, email, senha, isAdmin = false) {
    cy.get(ELEMENTS.nomeInput).type(nome);
    cy.get(ELEMENTS.emailInput).type(email);
    cy.get(ELEMENTS.passwordInput).type(senha, { log: false });

    if (isAdmin) {
      cy.get(ELEMENTS.adminCheckbox).check();
    }
  }
  
  submeterCadastro() {
    cy.get(ELEMENTS.cadastrarButton).click();
  }

  validarMensagemSucesso(mensagem) {
    cy.get(ELEMENTS.successAlert)
      .should('be.visible')
      .should('have.text', mensagem);
  }

  validarMensagemDeErro(mensagem) {
    cy.get(ELEMENTS.errorAlert)
      .should('be.visible')
      .and('contain', mensagem);
  }
}

export default new CadastroPage();