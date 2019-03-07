import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(query){
        const key = '';
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        }
        catch(error){
            console.log(error);
        }
    };    
}
