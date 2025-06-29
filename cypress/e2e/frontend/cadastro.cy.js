import { faker } from '@faker-js/faker';
import CadastroPage, { ELEMENTS } from '../../support/pageObjects/CadastroPage';
import HomePage from '../../support/pageObjects/HomePage';

describe('Testes de cadastro de usuário', () => {

  beforeEach(() => {
    CadastroPage.acessarCadastro();
  });

  it('Cenário 1: Deve realizar o cadastro de um novo usuário COMUM com sucesso', () => {
    cy.intercept('GET', '**/produtos').as('getProdutos');
    CadastroPage.preencherFormulario(faker.person.fullName(), faker.internet.email(), faker.internet.password(), false);
    CadastroPage.submeterCadastro();
    CadastroPage.validarMensagemSucesso('Cadastro realizado com sucesso');
    cy.wait('@getProdutos');
    cy.url().should('include', '/home');
    HomePage.validarTituloStore();
  });

  it('Cenário 2: Deve realizar o cadastro de um novo usuário ADMINISTRADOR com sucesso', () => {
    cy.intercept('GET', '**/usuarios').as('getUsuarios');
    const nome = `Admin ${faker.person.firstName()}`;
    CadastroPage.preencherFormulario(nome, faker.internet.email(), faker.internet.password(), true);
    CadastroPage.submeterCadastro();
    CadastroPage.validarMensagemSucesso('Cadastro realizado com sucesso');
    cy.wait('@getUsuarios');
    cy.url().should('include', '/admin/home');
    HomePage.validarBoasVindasAdmin(nome);
  });

  it('Cenário 3: Deve falhar ao tentar cadastrar um usuário sem o campo "Nome"', () => {
    CadastroPage.preencherFormulario('{backspace}', faker.internet.email(), faker.internet.password());
    CadastroPage.submeterCadastro();
    CadastroPage.validarMensagemDeErro('Nome é obrigatório');
  });

  it('Cenário 4: Deve exibir erro ao tentar cadastrar um e-mail já existente', () => {
    cy.intercept('POST', '**/usuarios').as('postUsuario');
    //Cria um usuário para garantir que o e-mail exista
    cy.createUserApi().then(userData => {
        //Tenta cadastrar de novo com o mesmo e-mail
        CadastroPage.acessarCadastro();
        CadastroPage.preencherFormulario(faker.person.fullName(), userData.email, faker.internet.password());
        CadastroPage.submeterCadastro();
        cy.wait('@postUsuario').its('response.statusCode').should('eq', 400);
        CadastroPage.validarMensagemDeErro('Este email já está sendo usado');
    });
  });
});