const ELEMENTS = {
  emailInput: '[data-testid="email"]',
  passwordInput: '[data-testid="senha"]',
  loginButton: '[data-testid="entrar"]'
};

class LoginPage {
  acessarLogin() {
    cy.visit('/login');
  }

  preencherFormulario(email, senha) {
    cy.get(ELEMENTS.emailInput)
      .should('be.visible')
      .type(email);

    cy.get(ELEMENTS.passwordInput)
      .should('be.visible')
      .type(senha, { log: false });
  }

  submeterFormulario() {
    cy.get(ELEMENTS.loginButton)
      .should('be.visible')
      .click();
  }

  fazerLogin(email, senha) {
    this.acessarLogin();
    this.preencherFormulario(email, senha);
    this.submeterFormulario();
  }
}

export default new LoginPage();