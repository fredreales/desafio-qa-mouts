import { faker } from '@faker-js/faker';
import LoginPage from './pageObjects/LoginPage';


Cypress.Commands.add('loginUI', (email, password) => {
  LoginPage.acessarLogin();
  LoginPage.preencherFormulario(email, password);
  LoginPage.submeterFormulario();
});

Cypress.Commands.add('createUserApi', (isAdmin = false) => {
    const userData = {
        nome: `${isAdmin ? 'Admin' : 'Comum'} ${faker.person.firstName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    return cy.request({
        method: 'POST',
        url: 'https://serverest.dev/usuarios',
        body: { ...userData, administrador: `${isAdmin}` }
    }).then(() => {
        return cy.wrap(userData);
    });
});