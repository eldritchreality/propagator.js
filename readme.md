[![Build Status](https://travis-ci.org/eldritchreality/propagator.js.svg?branch=master)](https://travis-ci.org/eldritchreality/propagator.js) [![Coverage Status](https://coveralls.io/repos/github/eldritchreality/propagator.js/badge.svg?branch=master)](https://coveralls.io/github/eldritchreality/propagator.js?branch=master)


#### Cells
Found at propagator-cell.js  
Cells carry a value and a list of propagators to update when the value changes  

methods:

*   constructor: returns a new cell with no value
*   update: changes the value stored at this cell and runs every attached propagator, optionally takes a second argument to identify the caller and lock the cell to that caller only.
*   addListener: adds a new propagator to the list to update, should only be called from within a propagator instance
*   getContents: returns the value stored at this cell

#### Probes
Found at probe.js  
Attaches a console.log probe to a cell so you can see when that cell changes.  

usage: `probe(string name,Cell cell)`
output: `name : value`


#### Propagators
Found at propagator.js  
Propagators do something with a value when it has changed. They carry no state, they are purely a function of cells. Propagators will not run until all their upstream cells hold values.  
This is the primary interface to the module, you can access all constructors as methods on the Propagator object.

methods:

*   constructor: takes a function, a list of input cells, an output cell, and optionally a merge-strategy function. Registers a function on the input cells that sets the output cells whenever the input cells change value.
*   makeCell: returns a newly created blank cell.
*   addProbe: adds a probe with a "name" to a Cell. Api as listed for probe.js

##### Merge Strategy Function:

A function (optionally) passed to the propagator constructor. It is called by the cell when the propagator tries to update a cell that already holds a value, and merges the new value with the old value to provide a new value for the cell.  

* It is given three arguments (previousValue, UpdatedValue and cellHistory), it should return a new value for the cell.  
* If no merge-strategy is passed to the propagator constuctor, the default merge strategy (called update) is used. Update simply overwrites the old value with the new value.



#### Constants
*Not implemented yet*  
Constants are propagators which only set a scalar value to their output cells.  
Can easily be created by making a propagator with an function that always returns a single value and attaching it to an internal cell.  

methods:

*   constructor: takes a value and a list of cells. Creates a function that always returns that value, and binds that function to its output cells.