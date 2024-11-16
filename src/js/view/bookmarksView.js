import { mark } from 'regenerator-runtime';
import { View } from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _data;
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!';

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    const markup = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    return markup;
  }

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
