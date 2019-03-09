import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
 * - search objects
 * - current recipe object
 */

const state = {};



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

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
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

