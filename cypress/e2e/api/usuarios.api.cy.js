import { faker } from '@faker-js/faker';

describe('Testes de API - Recurso /produtos', () => {

    let adminToken;
    let commonUserToken;

    beforeEach(() => {
    
        cy.createUserApi(true).then(userData => {
            cy.request({
                method: 'POST', url: 'https://serverest.dev/login',
                body: { email: userData.email, password: userData.password }
            }).then(authResponse => {
                adminToken = authResponse.body.authorization;
            });
        });
        cy.createUserApi(false).then(userData => {
            cy.request({
                method: 'POST', url: 'https://serverest.dev/login',
                body: { email: userData.email, password: userData.password }
            }).then(authResponse => {
                commonUserToken = authResponse.body.authorization;
            });
        });
    });

    it('Deve realizar o ciclo de vida completo de um produto (criar, alterar e excluir)', () => {
        const produtoNome = "Produto Ciclo de Vida " + faker.string.uuid();
        let produtoId;

        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/produtos',
            headers: { 'Authorization': adminToken },
            body: { "nome": produtoNome, "preco": faker.number.int({ min: 100, max: 500 }), "descricao": "Produto de teste", "quantidade": 50 }
        }).then(createResponse => {
            expect(createResponse.status).to.equal(201);
            produtoId = createResponse.body._id;

            return cy.request({
                method: 'PUT',
                url: `https://serverest.dev/produtos/${produtoId}`,
                headers: { 'Authorization': adminToken },
                body: { "nome": produtoNome, "preco": 999, "descricao": "Descrição Alterada", "quantidade": 1 }
            });
        }).then(putResponse => {
            expect(putResponse.status).to.equal(200);
            expect(putResponse.body.message).to.equal('Registro alterado com sucesso');

            return cy.request({
                method: 'DELETE',
                url: `https://serverest.dev/produtos/${produtoId}`,
                headers: { 'Authorization': adminToken }
            });
        }).then(deleteResponse => {
            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse.body.message).to.equal('Registro excluído com sucesso');
        });
    });

    it('Deve falhar ao tentar cadastrar um produto sem autorização (401)', () => {
        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/produtos',
            body: { "nome": "Produto Sem Token " + faker.string.uuid(), "preco": 50, "descricao": "Teste", "quantidade": 10 },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.equal(401);
        });
    });

    it('Deve falhar ao tentar cadastrar um produto com nome duplicado (400)', () => {
        const produtoDuplicado = { "nome": "Produto Duplicado " + faker.string.uuid(), "preco": 150, "descricao": "Descrição", "quantidade": 50 };
        
        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/produtos',
            headers: { 'Authorization': adminToken },
            body: produtoDuplicado
        }).then(() => {
            cy.request({
                method: 'POST',
                url: 'https://serverest.dev/produtos',
                headers: { 'Authorization': adminToken },
                body: produtoDuplicado,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.equal(400);
                expect(response.body.message).to.equal('Já existe produto com esse nome');
            });
        });
    });

    it('Deve falhar ao tentar excluir um produto com usuário comum (403)', () => {
        let produtoId;
        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/produtos',
            headers: { 'Authorization': adminToken },
            body: { "nome": "Produto para Exclusao " + faker.string.uuid(), "preco": 333, "descricao": "Teste", "quantidade": 15 }
        }).then(response => {
            produtoId = response.body._id;
        }).then(() => {
            cy.request({
                method: 'DELETE',
                url: `https://serverest.dev/produtos/${produtoId}`,
                headers: { 'Authorization': commonUserToken },
                failOnStatusCode: false
            }).then(deleteResponse => {
                expect(deleteResponse.status).to.equal(403);
                expect(deleteResponse.body.message).to.equal('Rota exclusiva para administradores');
            });
        });
    });
});