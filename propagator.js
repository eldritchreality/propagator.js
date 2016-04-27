var Cell = require("./propagator-cell.js")
var assert = require("assert")

function coerceToArray(object) {
    if (!(object instanceof Array)) return [object];
    else return object;
}

function Propagator(func,input,output) {
      var self = this
      
      assert(func && input && output, "You need to call the propagator constructor with all three of a function, input cell and output cell")
      assert(input instanceof Cell || input instanceof Array,  "Propagators read from cells or lists of cells, not", typeof input)
      assert(output instanceof Cell, "Propagators output to single cells, not", typeof output)
      assert(input !== output, "Propagators shouldn't write out to the same cell they read from.")
     
      this.input = coerceToArray(input);
      this.output = output;
    
      function applyFuncToInputs() {
          var inputValues = self.input.map((cell) => cell.getContents())
          
          return func.apply(null,inputValues);
          
      }
   
      this.propagate = function propagate() {
          
          var outputValues = applyFuncToInputs();
          self.output.update(outputValues, self)
      }
    
      this.input.forEach( (cell) => cell.addListener(self.propagate) ) 
}

Propagator.makeCell = function makeCell() {return new Cell};
Propagator.prototype.makeCell = Propagator.makeCell;

module.exports = Propagator