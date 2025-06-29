import LoginPage, { ELEMENTS } from '../../support/pageObjects/LoginPage';
import HomePage from '../../support/pageObjects/HomePage';
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade de Login', () => {

    it('Cenário 1: Login com sucesso como Administrador', () => {
        cy.intercept('GET', '**/usuarios').as('getUsuarios');
        
        //cria um admin dinâmico para este teste
        cy.createUserApi(true).then(userData => {
            //testa o login com o usuário recém criado
            LoginPage.acessarLogin();
            LoginPage.preencherFormulario(userData.email, userData.password);
            LoginPage.submeterFormulario();
            
            cy.wait('@getUsuarios');
            HomePage.validarBoasVindasAdmin(userData.nome);
            cy.url().should('include', '/admin/home');
        });
    });

    it('Cenário 2: Login com sucesso como Usuário comum', () => {
        cy.intercept('GET', '**/produtos').as('getProdutos');
        
        //cria um usuário comum dinâmico para este teste
        cy.createUserApi(false).then(userData => {
            LoginPage.acessarLogin();
            LoginPage.preencherFormulario(userData.email, userData.password);
            LoginPage.submeterFormulario();

            cy.wait('@getProdutos');
            HomePage.validarTituloStore();
            HomePage.validarAusenciaBotoesAdmin();
            cy.url().should('include', '/home');
        });
    });

    it('Cenário 3: Tentativa de login com credenciais inválidas', () => {
        cy.intercept('POST', '**/login').as('loginRequest');
        LoginPage.acessarLogin();
        LoginPage.preencherFormulario('email.invalido@qa.com', 'senhaerrada');
        LoginPage.submeterFormulario();
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

        LoginPage.validarMensagemDeErro('Email e/ou senha inválidos');
        cy.get(ELEMENTS.emailInput).should('be.visible');
        cy.get(ELEMENTS.passwordInput).should('be.visible');
    });
});