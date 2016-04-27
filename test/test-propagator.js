var expect = require("chai").expect
var Propagator = require("../propagator.js")
var Cell = require("../propagator-cell.js")

describe("The propagator constructor",function() {
    
    it("should make a new cell when .makeCell is called on it", function(){
        var testCell = Propagator.makeCell()
        
        expect(testCell instanceof Cell).to.be.true
    })
    
    it("should make a new propagator when correctly called", function() {
        var mockInputCell = Propagator.makeCell()
        var mockOutputCell = Propagator.makeCell()
        var identityFunc = ((x) => x)
        
        mockInputCell.update(5)
        
        var testPropagator = new Propagator(identityFunc,mockInputCell,mockOutputCell);
        
        expect(testPropagator instanceof Propagator).to.be.true
    }) 
    
    it("should change values in an output cell when an input cell is changed", function() {
        var mockInputCell = Propagator.makeCell()
        var mockOutputCell = Propagator.makeCell()
        var add1to = ((x) => x+1)
        
        mockInputCell.update(5)
        
        var testPropagator = new Propagator(add1to,mockInputCell,mockOutputCell);
        mockInputCell.update(10)
        
        expect(mockOutputCell.getContents()).to.equal(add1to(10))
    })
    
     it("should cope with functions of arbitrary arity", function() {
        var mockInputCell1 = Propagator.makeCell().update(1)
        var mockInputCell2 = Propagator.makeCell().update(1)
        var mockInputCell3 = Propagator.makeCell().update(1)
        var mockOutputCell = Propagator.makeCell()
        var addValuesTogether = ((x,y,z) => x+y+z)
        
        var testPropagator = new Propagator(addValuesTogether,[mockInputCell1,mockInputCell2,mockInputCell3],mockOutputCell);
        mockInputCell1.update(10)
        
        expect(mockOutputCell.getContents()).to.equal(addValuesTogether(10,1,1))
    }) 
     
    it("should throw an error when the constructor is called with no arguments",function(){
        
        expect( () => new Propagator() ).to.throw(Error)
    }) 
    
    it("should throw an error when the constructor is called something other than a function and cells", function(){
        
        expect( () => new Propagator((x) => x,"not a cell",["really not a cell"]) ).to.throw(Error)
        expect( () => new Propagator((x) => x,Propagator.makeCell(),["really not a cell"]) ).to.throw(Error)
        expect( () => new Propagator((x) => x,["really not a cell","me either"],Propagator.makeCell()) ).to.throw(Error)
        expect( () => new Propagator((x) => x,[Propagator.makeCell(),"still not a cell yet"],Propagator.makeCell()) ).to.throw(Error)
        
    })
    
})


