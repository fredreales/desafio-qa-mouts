
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
    cy.get(ELEMENTS.emailInput).type(email);
    cy.get(ELEMENTS.passwordInput).type(senha, { log: false });
  }

  submeterFormulario() {
    cy.get(ELEMENTS.loginButton).click();
  }

  fazerLogin(email, senha) {
    this.acessarLogin();
    this.preencherFormulario(email, senha, { log: false });
    this.submeterFormulario();
  }
}

export default new LoginPage();