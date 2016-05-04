var expect = require("chai").expect;
var Cell = require("../propagator-cell.js")

describe("A propagator Cell",function(){

    it("should construct a new cell when called",function() {
        var testCell = new Cell()
        expect(testCell instanceof Cell).to.be.true;
    });
    
    
    it("should add a listener function when one tries to bind to it", function() {
        var testCell = new Cell()
        
        function mockListener() {
            5 + 5;
        }
       
        
        
        expect(testCell.addListener.bind(this,mockListener)).to.not.throw(Error);
    })

   it("should throw an exception when something that isn't a function tries to bind to it", function() {
      var testCell = new Cell()
      
      expect(testCell.addListener.bind(this,"This is a string not a function")).to.throw(Error)
      expect(testCell.addListener.bind(this,new Set())).to.throw(Error)
      expect(testCell.addListener.bind(this,[])).to.throw(Error)
      expect(testCell.addListener.bind(this,{"sample":"mistake"})).to.throw(Error)
      expect(testCell.addListener.bind(this,15)).to.throw(Error)
   })
   
   it("should update it's contents when update() is called",function() {
        var testCell = new Cell()
        var testValue = "test_value"
        
        testCell.update(testValue);
        var contents = testCell.getContents()
        expect(contents).to.equal(testValue);
    })

   it("should disallow updates to cells with existing values if the caller does not pass an identity",function() {
        var testCell = new Cell()
        var testValue = "test_value"
        var testUpdate = "new_value"
      
        testCell.update(testValue)
        expect(testCell.update.bind(testCell,testUpdate)).to.throw(Error)
   })
   
   it("should update its listeners when its content changes",function(){
       var testCell = new Cell()
       var testValue = 0;
       var expectedValue = 15;
       
       function updateTestValue() {
        testValue = testCell.getContents()
       }
       
       testCell.addListener(updateTestValue)
       testCell.update(15)
       
       expect(testValue).to.equal(expectedValue)   
   })

})

