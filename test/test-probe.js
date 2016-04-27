var expect = require("chai").expect
var Cell = require("../propagator-cell.js")
var probe = require("../probe.js")

describe("The probe function",function() {
    
    it("should add a probe to a cell",function(){
        var testCell = new Cell()
        
        probe("test Cell",testCell);
        expect(testCell.listeners.size).to.equal(1)
    })
    
})

