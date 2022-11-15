const { expect } = require('chai');
const {Recipe, Diet, conn} = require('../../src/db');

const dummyRecipe = {
    name: 'Pochoclo',
    summary: 'es pochoclo',
    health_score: 5,
    step_by_step:'cocina el pochoclo'
}
const dummyDiet ={
    name:'seafood diet. I sea-food, i eat it'
}

describe('associations', ()=>{
    before(() => conn.authenticate()
    .catch((err) => {
      console.error('Test enviromnet setup error:', err);
    }));

    it('should allow the setting and getting of associated elements', ()=>{
        Promise.all([Recipe.create(dummyRecipe), Diet.create(dummyDiet)])
        .then(([recipe,diet]) =>
            recipe.setDiets([diet])
            .then(()=> expect(recipe.getDiets).to.equal([diet]))
        );
    });
})