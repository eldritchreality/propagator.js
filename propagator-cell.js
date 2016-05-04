var assert = require("assert")

function Cell () {
    "use strict";
    var self = this
    
    this.contents = undefined 
    this.listeners = new Set()
    this.updateHistory = []
    
    function updateListeners(caller) {
        caller = caller || false
        self.listeners.forEach((elem) => {if(caller !== elem) elem()}) ;
    }
   
 
    
    this.update = function update(newVal,caller) {
        
        function doUpdate() {

            if (self.contents === undefined) self.contents = newVal
            else if(typeof caller === "string") self.contents = newVal //not sure about this, it's deliberately permissive
            else if(typeof caller !== "undefined" && caller.merge instanceof Function) {
                self.contents = caller.merge(self.contents,newVal,self.updateHistory.slice()) // make the caller sort out the merge conflict
                assert(typeof self.contents !== "undefined","This merge strategy failed to return a value: "+ caller.merge.toString()) // insist the caller actually does sort out the merge conflict
            }
            else throw new Error("You need to identify yourself to change an existing value. Pass either an identifying string, or a propagator object.") //caller is not a string or a valid propagator therefore caller is improperly defined

        } 
        
        //check invariants
        if (typeof newVal !== "undefined","Tried to update a cell without sending a value") 
        caller = caller || false
        
        //Do update
        if (newVal === self.contents) return;
        else doUpdate();
        
        //append to history
        self.updateHistory.push({"caller":caller,"value":self.contents})
        
        updateListeners(caller)
        return self
        
    }
    
    this.addListener = function addListener(listener) {
        assert(typeof listener == "function", "Tried to add a propagator to a cell that wasn't a function")
        self.listeners.add(listener)        
        updateListeners()
        return self
    }
    
    this.getContents = function getContents() {
        return self.contents;
    }
}

module.exports = Cell