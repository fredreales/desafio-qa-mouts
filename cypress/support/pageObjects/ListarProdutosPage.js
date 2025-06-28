class ListarProdutosPage {
  validarProdutoNaLista(nome, preco, descricao) {
    cy.contains('tr', nome).then(tableRow => {
      cy.wrap(tableRow).find('td').eq(1).should('contain.text', preco);
      cy.wrap(tableRow).find('td').eq(2).should('contain.text', descricao);
    });
  }
  excluirProdutoDaLista(nomeProduto) {
    cy.contains('tr', nomeProduto)
      .find('.btn-danger') 
      .click();
  }
}

export default new ListarProdutosPage();