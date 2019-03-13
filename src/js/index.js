import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {elements, renderLoader, clearLoader} from './views/base';


/** Global state of the app
 * - search objects
 * - current recipe object
 */

const state = {};
window.state = state;

/** 
 * SEARCH CONTROLLER 
 * */
const controlSearch = async () =>{
    // 1. Get query from view
    const query = searchView.getInput();

    if(query){
        console.log(query);
        // 2. Create new search object && add state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearReslts();
        renderLoader(elements.searchRes);
        try{
            // 4. Search for recipes
            await state.search.getResults();
    
            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(error){
            console.log(error);
            clearLoader(); 
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchRes.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const btnDirection = parseInt(btn.dataset.btndirection, 10);
        searchView.clearReslts();
        searchView.renderResults(state.search.result, btnDirection);
    }
});

/** 
 * RECIPE CONTROLLER 
 * */
const controllRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace('#', '');

    if(id){
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        if(state.search){
            searchView.highlightSelected(id);
        }

        // create new recipe object
        state.recipe = new Recipe(id);
        
        try{
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngridients();
   
            // calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcSercings();
   
            // render recipe
            clearLoader(); 
            recipeView.renderRecipe(state.recipe);
        }
        catch(error){
            console.log(error);
        }
    }
};

['hashchange', 'load'].forEach(el => window.addEventListener(el, controllRecipe));


/** 
 * SHOPPING LIST CONTROLLER 
 * */
const controlList = () => {
    // create new list is there in not yet
    if(!state.list){
        state.list = new List();
    }

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

};

// handle delete and update item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete from state
        state.list.deleteItem(id);

        // delete from ui
        listView.deleteItem(id);
    }
    // handle count update
    else if(e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});



/** 
 * handling recipe button clicks 
 * */
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
});

