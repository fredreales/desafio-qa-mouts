# Desafio de Automação de Testes com Cypress - ServeRest

[![Status da Pipeline](https://github.com/fredreales/desafio-qa-mouts/actions/workflows/ci.yml/badge.svg)](https://github.com/fredreales/desafio-qa-mouts/actions/workflows/ci.yml)

Este repositório contém a solução para o Desafio de Automação proposto, que consiste em desenvolver testes E2E e de API para a plataforma [ServeRest](https://serverest.dev/). O objetivo é demonstrar a aplicação de boas práticas de desenvolvimento, padrões de projeto e a construção de uma suíte de testes robusta.

**Aplicações Alvo:**
* **Frontend:** `https://front.serverest.dev/`
* **API (Swagger):** `https://serverest.dev/`

## Stack
* **JavaScript**
* **Node.js**
* **Cypress** - Framework principal para automação de testes E2E e de API.
* **GitHub Actions** - Para automação da pipeline de CI/CD.
* **@faker-js/faker** - Biblioteca para geração de massa de dados dinâmica e realista.

## Funcionalidades e Cenários Testados

A suíte de testes automatizados foi dividida em duas frentes principais: Frontend (E2E) e API, cobrindo os fluxos críticos da aplicação, incluindo cenários positivos e negativos.

### Testes de Frontend (E2E)

* **Login:** Valida os fluxos de autenticação para usuários administradores e comuns e o tratamento de erro para credenciais inválidas.
* **Cadastro de Usuário:** Cobre o fluxo de criação de contas para perfis de administrador e comum, incluindo cenários negativos para campos obrigatórios e e-mail duplicado.
* **Gerenciamento de Produtos:** Testa o ciclo de vida completo de um produto por um usuário administrador (criar, validar na listagem e excluir).
* **Logout:** Garante que o processo de encerramento de sessão funciona corretamente.
* **Busca de Produtos:** Simula a jornada de um usuário comum ao buscar um produto e adicioná-lo à sua lista de compras.

### Testes de API

* **Usuários:** Contém testes para o recurso de usuários, incluindo a validação de contrato do endpoint de listagem e um teste de ciclo de vida completo (Criar, Alterar, Excluir).
* **Produtos:** Contém testes para o recurso de produtos, incluindo o ciclo de vida completo e cenários negativos de segurança (401, 403) e regras de negócio (400).

##  Boas Práticas e Padrões de Projeto Aplicados

* **Page Object Model (POM):** Toda a interação com as páginas de frontend foi abstraída em classes específicas, mantendo os testes limpos e focados no comportamento. [cite: 3]
* **Comandos Customizados (`commands.js`):** Foram criados comandos reutilizáveis (ex: `cy.createUserApi`, `cy.loginUI`) para encapsular ações repetitivas e complexas, limpando o código dos testes e centralizando a lógica de setup.
* **Sincronização com a Rede (`cy.intercept`):** Uso de interceptadores para aguardar respostas da API antes de realizar asserções, eliminando a instabilidade ("flakiness") dos testes. [cite: 7]
* **Versionamento de Dependências:** As versões das dependências no `package.json` são exatas (sem `^`), garantindo builds consistentes e reproduzíveis no ambiente de CI/CD. [cite: 33]
* **Pipeline de CI/CD:** Uma pipeline com GitHub Actions foi configurada para executar toda a suíte de testes automaticamente a cada alteração no código, com jobs paralelos para frontend e API para otimizar o tempo de feedback.

## Estrutura de Arquivos

A estrutura final do projeto está organizada da seguinte forma:

```text
/DESAFIO-QA-MOUTS
|-- .github/
|   |-- workflows/
|   |   `-- ci.yml
|-- cypress
|   |-- e2e
|   |   |-- api/
|   |   |   |-- produtos.api.cy.js
|   |   |   `-- usuarios.api.cy.js
|   |   `-- frontend/
|   |       |-- buscaEAddProduto.cy.js
|   |       |-- cadastrarProduto.cy.js
|   |       |-- cadastro.cy.js
|   |       |-- login.cy.js
|   |       `-- logout.cy.js
|   `-- support/
|       |-- pageObjects/
|       |-- commands.js
|       `-- e2e.js
|-- .gitignore
|-- cypress.config.js
|-- package.json
`-- README.md
```
# Como Rodar o Projeto Localmente

Siga as instruções abaixo para configurar e executar a suíte de automação na sua máquina.

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
* npm (geralmente instalado com o Node.js)

### Passos para Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/fredreales/desafio-qa-mouts.git
    cd desafio-qa-mouts
    ```

2.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```

3.  **Execute os Testes usando os `npm scripts`:**

    * **Para abrir a interface interativa do Cypress:**
        ```bash
        npm run cy:open
        ```

    * **Para rodar TODOS os testes no terminal (headless):**
        ```bash
        npm run test
        ```

    * **Para rodar APENAS os testes de frontend no terminal:**
        ```bash
        npm run test:e2e
        ```

    * **Para rodar APENAS os testes de API no terminal:**
        ```bash
        npm run test:api
        ```
    *(Use a terminação `:headed` para rodar os testes com o navegador abrindo, ex: `npm run test:e2e:headed`)*
