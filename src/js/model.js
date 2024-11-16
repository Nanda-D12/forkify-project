import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    state.bookmarks.some(bookmark =>
      state.recipe.id === bookmark.id
        ? (state.recipe.bookmarked = true)
        : (state.recipe.bookmarked = false)
    );
  } catch (err) {
    throw err;
  }
};

const persistBookmarks = function (data) {
  localStorage.setItem('bookmarks', JSON.stringify(data));
};

const getBookmarks = function () {
  return localStorage.getItem('bookmarks');
};

export const searchRecipe = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    const { recipes } = data.data;
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        title: rec.title,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getRecipesForPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateRecipeServing = function (serving) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * serving) / state.recipe.servings)
  );
  state.recipe.servings = serving;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks(state.bookmarks);
};

export const deleteBookmark = function (id) {
  const ind = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(ind, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks(state.bookmarks);
};

export const updloadRecipe = async function (data) {
  console.log(data);
  try {
    const dataArr = Object.entries(data);
    const ingredients = dataArr
      .filter(ent => ent[0].startsWith('ingredient') && ent[1] !== '')
      .map(ing => {
        const ingArr = ing[1]
          .split(' ')
          .map(word => word.trim(' '))
          .join(' ')
          .split(',');
        if (ingArr.length < 3)
          throw new Error(
            'Invalid input. Please provide the ingredient inputs in the format!'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: data.title,
      publisher: data.publisher,
      source_url: data.sourceUrl,
      image_url: data.image,
      servings: +data.servings,
      cooking_time: +data.cookingTime,
      ingredients,
    };

    const result = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(result);
    console.log(state.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const init = function () {
  if (getBookmarks()) state.bookmarks = JSON.parse(getBookmarks());
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();
