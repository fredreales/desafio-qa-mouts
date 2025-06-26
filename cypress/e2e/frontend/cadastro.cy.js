import { faker } from '@faker-js/faker';
import CadastroPage, { ELEMENTS } from '../../support/pageObjects/CadastroPage';
import HomePage from '../../support/pageObjects/HomePage';

describe('Testes de cadastro de usuário', () => {

  let usersData;
  
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      usersData = users;
    });
    CadastroPage.acessarCadastro();
  });

  it('Cenário 1: Deve realizar o cadastro de um novo usuário COMUM com sucesso', () => {
    cy.intercept('GET', '**/produtos').as('getProdutos');
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const senha = faker.internet.password();
    CadastroPage.preencherFormulario(nome, email, senha, false);
    CadastroPage.submeterCadastro();
    CadastroPage.validarMensagemSucesso('Cadastro realizado com sucesso');
    cy.wait('@getProdutos');
    cy.url().should('include', '/home');
    HomePage.validarTituloStore();
  });

  it('Cenário 2: Deve realizar o cadastro de um novo usuário ADMINISTRADOR com sucesso', () => {
    cy.intercept('GET', '**/usuarios').as('getUsuarios');
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const senha = faker.internet.password();
    CadastroPage.preencherFormulario(nome, email, senha, true);
    CadastroPage.submeterCadastro();
    CadastroPage.validarMensagemSucesso('Cadastro realizado com sucesso');
    cy.wait('@getUsuarios');
    cy.url().should('include', '/admin/home');
    HomePage.validarBoasVindasAdmin(nome);
  });

  it('Cenário 3: Deve falhar ao tentar cadastrar um usuário sem o campo "Nome"', () => {
    const email = faker.internet.email();
    const senha = faker.internet.password();

    cy.get(ELEMENTS.emailInput).type(email);
    cy.get(ELEMENTS.passwordInput).type(senha, { log: false });
    
    CadastroPage.submeterCadastro();
    CadastroPage.validarMensagemDeErro('Nome é obrigatório');
  });

  it('Cenário 4: Deve exibir erro ao tentar cadastrar um e-mail já existente', () => {
    cy.intercept('POST', '**/usuarios').as('postUsuario');
    const nome = faker.person.fullName();
    const senha = faker.internet.password();
    CadastroPage.preencherFormulario(nome, usersData.admin.email, senha, { log: false });
    CadastroPage.submeterCadastro();
    cy.wait('@postUsuario').its('response.statusCode').should('eq', 400);
    CadastroPage.validarMensagemDeErro('Este email já está sendo usado');
  });
});