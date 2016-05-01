var Cell = require("./propagator-cell.js")
var assert = require("assert")


var probe = function addProbe (name,cell) {
    assert(typeof name === "string","You have to name a probe with a string, you can't name it with a",typeof name);
    assert(cell instanceof Cell, "You need to attach the probe to a Cell object");
    
    cell.addListener(function probe() {
            console.log(name,":",cell.getContents());
        });
}

module.exports = probe;