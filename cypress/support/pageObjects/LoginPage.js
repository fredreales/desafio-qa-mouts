export const ELEMENTS = {
  emailInput: '[data-testid="email"]',
  passwordInput: '[data-testid="senha"]',
  submitButton: '[data-testid="entrar"]',
  errorAlert: '.alert.alert-secondary'
};

class LoginPage {
  acessarLogin() {
    cy.visit('/login');
  }

  preencherFormulario(email, password) {
    cy.get(ELEMENTS.emailInput)
      .should('be.visible')
      .type(email);

    cy.get(ELEMENTS.passwordInput)
      .should('be.visible')
      .type(password, { log: false });
  }

  submeterFormulario() {
    cy.get(ELEMENTS.submitButton)
      .should('be.visible')
      .click();
  }

  validarMensagemDeErro(mensagem) {
    cy.get(ELEMENTS.errorAlert)
      .should('be.visible')
      .should('contain', mensagem);
  }

  fazerLogin(email, senha) {
    this.acessarLogin();
    this.preencherFormulario(email, senha);
    this.submeterFormulario();
  }
}

export default new LoginPage();