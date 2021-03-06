var expect = require("chai").expect
var Propagator = require("../propagator.js")
var Cell = require("../propagator-cell.js")

describe("The propagator constructor",function() {
    
    it("should make a new cell when .makeCell is called on it", function(){
        var testCell = Propagator.makeCell()
        
        expect(testCell instanceof Cell).to.be.true
    })
    
    it("should add a probe to a cell when asked", function(){
        var testCell = Propagator.makeCell()
        
        Propagator.addProbe("Test Cell:",testCell)
        expect(testCell.listeners.size).to.equal(1)
    })
    
    it("should make a new propagator when correctly called", function() {
        var mockInputCell = Propagator.makeCell()
        var mockOutputCell = Propagator.makeCell()
        var identityFunc = ((x) => x)
        
        mockInputCell.update(5,"mocha test script")
        
        var testPropagator = new Propagator(identityFunc,mockInputCell,mockOutputCell);
        
        expect(testPropagator instanceof Propagator).to.be.true
    }) 
    
    it("should change values in an output cell when an input cell is changed", function() {
        var mockInputCell = Propagator.makeCell()
        var mockOutputCell = Propagator.makeCell()
        var add1to = ((x) => x+1)
        
        mockInputCell.update(5,"mocha test script")
        
        var testPropagator = new Propagator(add1to,mockInputCell,mockOutputCell);
        mockInputCell.update(10,"mocha test script")
        
        expect(mockOutputCell.getContents()).to.equal(add1to(10))
    })
    
     it("should cope with functions of arbitrary arity", function() {
        var mockInputCell1 = Propagator.makeCell().update(1)
        var mockInputCell2 = Propagator.makeCell().update(1)
        var mockInputCell3 = Propagator.makeCell().update(1)
        var mockOutputCell = Propagator.makeCell()
        var addValuesTogether = ((x,y,z) => x+y+z)
        
        var testPropagator = new Propagator(addValuesTogether,[mockInputCell1,mockInputCell2,mockInputCell3],mockOutputCell);
        mockInputCell1.update(10,"mocha test script")
        
        expect(mockOutputCell.getContents()).to.equal(addValuesTogether(10,1,1))
    }) 
     
    it("should not update an output cell unless all of its input cells have values",function(){
        var mockInputCell1 = Propagator.makeCell()
        var mockInputCell2 = Propagator.makeCell()
        var mockInputCell3 = Propagator.makeCell()
        var mockOutputCell = Propagator.makeCell()
        var addValuesTogether = ((x,y,z) => x+y+z)
        
        var testPropagator = new Propagator(addValuesTogether,[mockInputCell1,mockInputCell2,mockInputCell3],mockOutputCell);
        
        mockInputCell1.update(1,"mocha test script")
        expect(mockOutputCell.getContents()).to.be.undefined;
        
        mockInputCell2.update(10,"mocha test script")
        expect(mockOutputCell.getContents()).to.be.undefined;
        
        mockInputCell3.update(100,"mocha test script")
        expect(mockOutputCell.getContents()).to.equal(addValuesTogether(1,10,100))
    })
     
    it("should throw an error when the constructor is called with no arguments",function(){
        
        expect( () => new Propagator() ).to.throw(Error)
    }) 
    
    it("should throw an error when the constructor is called something other than a function, cells and optionally a merge strategy", function(){
        
        expect( () => new Propagator("I'm not a function",Propagator.makeCell(),Propagator.makeCell()) ).to.throw(Error)
        expect( () => new Propagator((x) => x,"not a cell",["really not a cell"]) ).to.throw(Error)
        expect( () => new Propagator((x) => x,Propagator.makeCell(),["really not a cell"]) ).to.throw(Error)
        expect( () => new Propagator((x) => x,["really not a cell","me either"],Propagator.makeCell()) ).to.throw(Error)
        expect( () => new Propagator((x) => x,[Propagator.makeCell(),"still not a cell yet"],Propagator.makeCell()) ).to.throw(Error)
        expect( () => new Propagator((x) => x,[Propagator.makeCell(),"still not a cell yet"],Propagator.makeCell()) ).to.throw(Error)
        expect( () => new Propagator((x) => x,Propagator.makeCell(),Propagator.makeCell(),"I'm not a function") ).to.throw(Error)
        
    })
    
    it("should cope when a merge strategy is defined as part of the arguments",function(){
        var mockInputCell = Propagator.makeCell()
        var mockOutputCell = Propagator.makeCell()
        var add1to = ((x) => x+1)
        var mergeByAdding = ((x,y) => x + y)
        
        expect( (() => new Propagator(add1to,mockInputCell,mockOutputCell,mergeByAdding)).bind(this) ).not.to.throw(Error);
        
    })
    
    it("should throw an error when the merge strategy fails to return a value",function(){
        var mockInputCell = Propagator.makeCell()
        var mockOutputCell = Propagator.makeCell()
        var add1to = ((x) => x+1)
        var mergeByMistake = function fail(x,y) { x + y } //no return
        
        mockInputCell.update(5,"mocha test script")
        mockOutputCell.update(500,"mocha test script")
        expect( (() => new Propagator(add1to,mockInputCell,mockOutputCell,mergeByMistake)).bind(this) ).to.throw(Error);
        
    })
    
    it("should successfully run a correctly defined merge strategy when updating a cell which already has a value",function(){
        var mockInputCell = Propagator.makeCell().update(5,"mocha test script")
        var mockOutputCell = Propagator.makeCell().update(10,"mocha test script")
        var add1to = ((x) => x+1)
        var mergeByAdding = ((x,y) => x + y)
        
        var testPropagator = new Propagator(add1to,mockInputCell,mockOutputCell,mergeByAdding)
        
        expect(mockOutputCell.getContents()).to.equal(16) // 10 + add1to(5)
        
    })
    
})


