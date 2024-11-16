import { mark } from 'regenerator-runtime';
import { View } from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _data;
  _errorMessage = 'No results found for your query. Please try again!';

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    const markup = this._data
      .map(recipe => previewView.render(recipe, false))
      .join('');
    return markup;
  }
}

export default new ResultsView();
