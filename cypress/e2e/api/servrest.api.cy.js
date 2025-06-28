import { faker } from '@faker-js/faker';

describe('Testes de API - ServeRest', () => {

    const apiBaseUrl = Cypress.env('apiBaseUrl');
    let adminToken;
    let commonUserToken;

    before(() => {
        cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/login`,
            body: {
                "email": Cypress.env('ADMIN_EMAIL'),
                "password": Cypress.env('ADMIN_PASSWORD')
            },
            log: false
        }).then(response => {
            adminToken = response.body.authorization;
        });

        cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/login`,
            body: {
                "email": Cypress.env('COMMON_USER_EMAIL'),
                "password": Cypress.env('COMMON_USER_PASSWORD')
            },
            log: false
        }).then(response => {
            commonUserToken = response.body.authorization;
        });
    });

    it('Deve listar todos os usuários', () => {
        cy.request({
            method: 'GET',
            url: `${apiBaseUrl}/usuarios`
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.usuarios).to.be.an('array').and.not.be.empty;
            cy.wrap(response.body.usuarios[0]).should('have.all.keys',
                'nome', 'email', 'password', 'administrador', '_id'
            );
        });
    });

    it('Deve realizar o ciclo de vida completo de um produto (criar, alterar e excluir)', () => {
        const produtoNome = "Produto teste123 " + faker.string.uuid();
        let produtoId;

        cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/produtos`,
            headers: { 'Authorization': adminToken },
            body: {
                "nome": produtoNome,
                "preco": faker.number.int({ min: 100, max: 500 }),
                "descricao": "Produto para teste de ciclo de vida",
                "quantidade": faker.number.int({ min: 10, max: 50 })
            }
        }).then((createResponse) => {
            expect(createResponse.status).to.equal(201);
            produtoId = createResponse.body._id; //guarda o ID do produto criado
            expect(createResponse.body.message).to.equal('Cadastro realizado com sucesso');

            return cy.request({
                method: 'PUT',
                url: `${apiBaseUrl}/produtos/${produtoId}`,
                headers: { 'Authorization': adminToken },
                body: { "nome": produtoNome, "preco": 999, "descricao": "Descrição Alterada", "quantidade": 1 }
            });

        }).then((putResponse) => {
            expect(putResponse.status).to.equal(200);
            expect(putResponse.body.message).to.equal('Registro alterado com sucesso');

            return cy.request({
                method: 'DELETE',
                url: `${apiBaseUrl}/produtos/${produtoId}`,
                headers: { 'Authorization': adminToken }
            });
            
        }).then((deleteResponse) => {
            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse.body.message).to.equal('Registro excluído com sucesso');
        });
    });

    it('Deve falhar ao tentar cadastrar um produto sem autorização (401)', () => {
        cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/produtos`,
            body: { "nome": "Produto Sem Token " + faker.string.uuid(), "preco": 50, "descricao": "Teste", "quantidade": 10 },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body.message).to.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
        });
    });

    it('Deve falhar ao tentar cadastrar um produto com nome duplicado (400)', () => {
        const produtoDuplicado = { "nome": "Produto Duplicado " + faker.string.uuid(), "preco": 150, "descricao": "Descrição", "quantidade": 50 };

        cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/produtos`,
            headers: { 'Authorization': adminToken },
            body: produtoDuplicado
        }).then(() => {
            cy.request({
                method: 'POST',
                url: `${apiBaseUrl}/produtos`,
                headers: { 'Authorization': adminToken },
                body: produtoDuplicado,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body.message).to.equal('Já existe produto com esse nome');
            });
        });
    });

    it('Deve falhar ao tentar excluir um produto com usuário comum (403)', () => {
        cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/produtos`,
            headers: { 'Authorization': adminToken },
            body: { "nome": "Produto para Exclusao " + faker.string.uuid(), "preco": 333, "descricao": "Teste", "quantidade": 15 }
        }).then((response) => {
            const produtoId = response.body._id;
            cy.request({
                method: 'DELETE',
                url: `${apiBaseUrl}/produtos/${produtoId}`,
                headers: { 'Authorization': commonUserToken },
                failOnStatusCode: false
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.equal(403);
                expect(deleteResponse.body.message).to.equal('Rota exclusiva para administradores');
            });
        });
    });
});