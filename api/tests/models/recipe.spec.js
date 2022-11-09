const { Recipe, conn } = require('../../src/db.js');
const { expect } = require('chai');

const dummy = {
  name: 'Pochoclo',
  summary: 'es pochoclo',
  health_score: 5,
  step_by_step:'cocina el pochoclo'
}

describe('Recipe model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Recipe.sync({ force: true }));
    
  
  it('should work when all parameters are valid', () => {
    Recipe.create(dummy);
  });
  describe('name', ()=>{
    it('should throw an error if name is null', (done) => {
      Recipe.create({...dummy, name:null})
        .then(() => done(new Error('It requires a valid name')))
        .catch(() => done());
    });
    it('should not accept a non- string-coercible', (done)=>{
      Recipe.create({...dummy, name:[1,2]})
        .then((res) => done(new Error('It should not have accepted non string')))
        .catch(() => done());
    });
  });
  describe('id', ()=>{
    it('should auto-increment', ()=>{
      Recipe.create({dummy})
      .then(dummy1=>{
        Recipe.create({dummy})
        .then(dummy2 =>expect(dummy2.id).to.equal(dummy1.id+1))
      })
    });
  });
  describe('health_score', ()=>{
    it('should not accept a value under 0', (done)=>{
      Recipe.create({...dummy, health_score:-1})
        .then(() => done(new Error('It should require a value over 0')))
        .catch(() => done());
    });
    it('should not accept a value over 10', (done)=>{
      Recipe.create({...dummy, health_score:11})
        .then(() => done(new Error('It should require a value under 10')))
        .catch(() => done());
    });
  })
  });
  describe('step_by_step', ()=>{
    it('should not break even if value is null', ()=>{
      Recipe.create({...dummy, step_by_step:null})
    })
  })
});
