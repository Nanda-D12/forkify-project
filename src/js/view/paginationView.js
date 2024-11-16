import { View } from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const curPage = this._data.page;

    const prevPage = `
        <button class="btn--inline pagination__btn--prev" data-goto=${
          curPage - 1
        }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;

    const nextPage = `
        <button class="btn--inline pagination__btn--next" data-goto=${
          curPage + 1
        }>
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;

    if (this._data.results.length <= this._data.resultsPerPage) return '';
    if (curPage === 1) return nextPage;
    if (curPage === totalPages) return prevPage;
    return `${prevPage}${nextPage}`;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }
}

export default new PaginationView();
