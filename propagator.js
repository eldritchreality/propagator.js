var Cell = require("./propagator-cell.js")
var probe = require("./probe.js")
var assert = require("assert")

function coerceToArray(object) {
    if (!(object instanceof Array)) return [object];
    else return object;
}

function mergeByUpdate(prev,update) {
    return update;
}

function Propagator(func,input,output,mergeStrategy) {
      var self = this
      
      assert(func && input && output, "You need to call the propagator constructor with all three of a function, input cell and output cell")
      assert(func instanceof Function, "You need to call a propagator with a function as the first argument")
      assert(input instanceof Cell || input instanceof Array,  "Propagators read from cells or lists of cells, not " + typeof input)
      assert(output instanceof Cell, "Propagators output to single cells, not " + typeof output)
      assert(input !== output, "Propagators shouldn't write out to the same cell they read from.")
      if (input instanceof Array) input.forEach( (cell) => assert(cell instanceof Cell,"All inputs need to be cells, not " + typeof cell ) );
      if (typeof mergeStrategy != "undefined") {
          assert(mergeStrategy instanceof Function, "your merge callback "+ mergeStrategy.toString() + " must be a function not a " + typeof mergeStrategy)
      }
     
      this.input = coerceToArray(input);
      this.output = output;
    
      function applyFuncToInputs() {
          var inputs = self.input.map((cell) => cell.getContents())
          var output = {"value" : undefined, "usable" : false}
          
          inputs.fullyPopulated = inputs.every((value) => typeof value !== "undefined")
         
          if(inputs.fullyPopulated) {
              output.value = func.apply(null,inputs);
              output.usable = true;
          }
          
          return output;
      }
    
      this.merge = mergeStrategy || mergeByUpdate
      
      this.propagate = function propagate() {
          
          var outputValues = applyFuncToInputs();
          if (outputValues.usable) self.output.update(outputValues.value, self)
      }
    
      this.input.forEach( (cell) => cell.addListener(self.propagate) ) 
}

Propagator.makeCell = function makeCell() {return new Cell};
Propagator.prototype.makeCell = Propagator.makeCell;

Propagator.addProbe = probe
Propagator.prototype.addProbe = Propagator.addProbe

module.exports = Propagator