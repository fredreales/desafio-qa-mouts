import LoginPage from '../../support/pageObjects/LoginPage';
import HomePage from '../../support/pageObjects/HomePage';

describe('Testes da Funcionalidade de Login', () => {

    let usersData;

    beforeEach(() => {
        cy.fixture('users').then((users) => {
            usersData = users;
        });
        LoginPage.acessarLogin();
    });

    it('Cenário 1: Login com sucesso como Administrador', () => {
        //prepara a interceptação da chamada da API de usuários
        cy.intercept('GET', '**/usuarios').as('getUsuarios');

        const adminEmail = usersData.admin.email;
        const adminPassword = Cypress.env('ADMIN_PASSWORD');

        LoginPage.preencherFormulario(adminEmail, adminPassword);
        LoginPage.submeterFormulario();

        // aguarda a requisição de usuários terminar antes de validar a UI
        cy.wait('@getUsuarios');

        HomePage.validarBoasVindasAdmin(usersData.admin.nome);
        cy.url().should('include', '/admin/home');
    });

    it('Cenário 2: Login com sucesso como Usuário comum', () => {

        cy.intercept('GET', '**/produtos').as('getProdutos');

        const commonUserEmail = usersData.common.email;
        const commonUserPassword = Cypress.env('COMMON_USER_PASSWORD');

        LoginPage.preencherFormulario(commonUserEmail, commonUserPassword);
        LoginPage.submeterFormulario();


        cy.wait('@getProdutos');

        HomePage.validarTituloStore();
        cy.url().should('include', '/home');
    });

    it('Cenário 3: Tentativa de login com credenciais inválidas', () => {

        cy.intercept('POST', '**/login').as('loginRequest');

        LoginPage.preencherFormulario('email.invalido@qa.com', 'senhaerrada');
        LoginPage.submeterFormulario();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

        cy.contains('Email e/ou senha inválidos').should('be.visible');
        cy.url().should('include', '/login');
    });
});