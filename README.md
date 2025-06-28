# Desafio de automação de testes - ServeRest

Este repositório contém a solução para o desafio de Automação proposto, que consiste em desenvolver testes E2E e de API para a plataforma [ServeRest](https://serverest.dev/). O objetivo é demonstrar a aplicação de boas práticas de desenvolvimento, padrões de projeto e a construção de uma suíte de testes robusta e de alta qualidade.

**Aplicações alvo:**
* **Frontend:** `https://front.serverest.dev/`
* **API (Swagger):** `https://serverest.dev/`

## Stack utilizada:
* **JavaScript**
* **Node.js**
* **Cypress** - Framework principal para automação de testes E2E e de API.
* **@faker-js/faker** - Biblioteca para geração de massa de dados dinâmica e realista.

## Funcionalidades e cenários testados

A suíte de testes automatizados foi dividida em duas frentes principais: Frontend (E2E) e API, cobrindo os fluxos críticos da aplicação, incluindo cenários positivos e negativos.

### Testes de frontend (E2E)

* **Login (`login.cy.js`):** Valida os fluxos de autenticação para usuários administradores e comuns, além do tratamento de erro para credenciais inválidas (validando a resposta 401 da API).
* **Cadastro de Usuário (`cadastro.cy.js`):** Cobre o fluxo de criação de contas para perfis de administrador e comum. Inclui cenários negativos como tentativa de cadastro com campos obrigatórios em branco e com e-mail já existente (validando a resposta 400 da API).
* **Gerenciamento de Produtos (`cadastrarProduto.cy.js`):** Testa o ciclo de vida completo de um produto por um usuário administrador, incluindo a criação, a validação na listagem e a exclusão para limpeza do ambiente.
* **Logout (`logout.cy.js`):** Garante que o processo de encerramento de sessão funciona corretamente para todos os perfis de usuário, validando o redirecionamento para a página de login.
* **Busca de Produtos (`buscaEAddProduto.cy.js`):** Simula a jornada de um usuário comum ao buscar um produto, adicioná-lo à sua lista de compras e navegar entre as páginas.

### Testes de API (`servrest.api.cy.js`)

* **Leitura e Contrato (GET /usuarios):** Valida que o endpoint público de usuários está funcional e que a estrutura (schema) da resposta está correta.
* **Ciclo de Vida de um Recurso (POST -> PUT -> DELETE /produtos):** Um teste E2E completo que cria, altera e exclui um produto, garantindo a integridade de todas as operações CRUD em sequência.
* **Teste de Autenticação (POST /produtos - 401):** Garante que o endpoint de criação de produtos é protegido e não pode ser acessado sem um token de autorização.
* **Teste de Regra de Negócio (POST /produtos - 400):** Valida que a API impede a criação de produtos com nomes duplicados.
* **Teste de Autorização (DELETE /produtos - 403):** Garante que um usuário comum não pode executar ações destrutivas (excluir) restritas a administradores.

## Boas Práticas e Padrões de Projeto Aplicados

A construção deste projeto seguiu rigorosamente as melhores práticas do mercado para garantir a qualidade, manutenibilidade e robustez do código.

* **Page Object Model (POM):** Toda a interação com as páginas foi abstraída em classes específicas, mantendo os testes limpos e focados no comportamento.
* **Dados de Teste Dinâmicos:** Uso da biblioteca `@faker-js/faker` para gerar dados únicos a cada execução.
* **Gerenciamento de Dados Sensíveis:** As senhas e e-mails de teste são gerenciados através de variáveis de ambiente (`cypress.env.json`), com o arquivo devidamente incluído no `.gitignore` para não ser versionado.
* **Sincronização com a Rede (`cy.intercept`):** Os testes aguardam explicitamente por requisições de API antes de realizar asserções na interface, eliminando a instabilidade ("flakiness").
* **Separação de Dados (Fixtures):** Dados de teste não-sensíveis (personas de usuários) são gerenciados em arquivos de fixture (`users.json`).
* **`npm Scripts`:** Scripts customizados no `package.json` para facilitar a execução de diferentes suítes de teste (completa, apenas frontend, apenas API) tanto em modo headless quanto interativo.

## Estrutura de Arquivos

A estrutura do projeto está organizada da seguinte forma:
```text
/DESAFIO-QA-MOUTS
|-- cypress
|   |-- e2e
|   |   |-- api/
|   |   |   `-- servrest.api.cy.js
|   |   `-- frontend/
|   |       |-- buscaEAddProduto.cy.js
|   |       |-- cadastrarProduto.cy.js
|   |       |-- cadastro.cy.js
|   |       |-- login.cy.js
|   |       `-- logout.cy.js
|   |-- fixtures/
|   |   `-- users.json
|   `-- support/
|       |-- pageObjects/
|       |   |-- CadastrarProdutosPage.js
|       |   |-- CadastroPage.js
|       |   |-- HomePage.js
|       |   |-- ListarProdutosPage.js
|       |   `-- LoginPage.js
|       |-- commands.js
|       `-- e2e.js
|-- .gitignore
|-- cypress.config.js
|-- cypress.env.json
|-- package.json
`-- README.md
```


## Como Rodar o Projeto Localmente

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

3.  **Configure as Variáveis de Ambiente (Passo Essencial):**
    Este projeto utiliza um arquivo `cypress.env.json` para armazenar credenciais. Como este arquivo não é versionado, você precisa criá-lo manualmente na raiz do projeto.

    Crie um arquivo chamado `cypress.env.json` e cole o seguinte conteúdo (certifique-se de que o usuário comum existe e não é admin):
    ```json
    {
      "ADMIN_EMAIL": "fulano@qa.com",
      "ADMIN_PASSWORD": "teste",
      "COMMON_USER_EMAIL": "seu_usuario_comum@qa.com",
      "COMMON_USER_PASSWORD": "sua_senha_comum"
    }
    ```

4.  **Execute os Testes usando os `npm scripts`:**

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




