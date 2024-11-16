import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';

import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // console.log(id);
    recipeView.renderSpinner();

    resultsView.update(model.getRecipesForPage());
    await model.loadRecipe(id);
    const { recipe } = model.state;
    // console.log(recipe);

    bookmarksView.update(model.state.bookmarks);
    recipeView.render(recipe);
  } catch (err) {
    console.log(`${err.message} BOOM`);
    recipeView.renderError();
  }
};

const controlRecipeBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlSearchRecipe = async function () {
  const query = searchView.getQuery();
  if (!query) return;

  await model.searchRecipe(query);
  resultsView.renderSpinner();
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getRecipesForPage());
  paginationView.render(model.state.search);
};

const controlGetResultsForPage = function (page) {
  resultsView.render(model.getRecipesForPage(page));
  paginationView.render(model.state.search);
};

const controlRecipeServings = function (serving) {
  model.updateRecipeServing(serving);
  recipeView.update(model.state.recipe);
};

const controlRecipeUpload = async function (dataArr) {
  try {
    addRecipeView.renderSpinner();

    const data = Object.fromEntries(dataArr);
    await model.updloadRecipe(data);

    recipeView.render(model.state.recipe);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    bookmarksView.render(model.state.bookmarks);

    addRecipeView.renderMessage();

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlRecipeServings);
  recipeView.addHandlerBookmark(controlRecipeBookmarks);
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerPagination(controlGetResultsForPage);
  addRecipeView.addHandlerUploadRecipe(controlRecipeUpload);
};

init();
