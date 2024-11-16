class SearchView {
  #parentElement = document.querySelector('.search');

  #clearInput() {
    this.#parentElement.querySelector('input').value = '';
    this.#parentElement.querySelector('input').blur();
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this.#parentElement.querySelector('input').value;
    this.#clearInput();
    return query;
  }
}

export default new SearchView();
