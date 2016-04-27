var assert = require("assert")

function Cell () {
    "use strict";
    var self = this
    
    this.contents = undefined 
    this.listeners = new Set()
    this.lastUpdater = undefined
    
    function updateListeners(caller) {
        caller = caller || false
        self.listeners.forEach((elem) => {if(caller !== elem) elem()}) ;
    }
    
    this.update = function update(update,caller) {
        //check invariants
        assert(typeof update !== "undefined","Tried to update a cell without sending a value") 
        caller = caller || false
        
        //check permissions
        if (self.lastUpdater && caller != self.lastUpdater) throw new Error("Tried to change a value owned by another propagator")
        if (update === self.contents) return;
        
        //do update
        self.contents = update;
        self.lastUpdater = caller || self.lastUpdater 
        
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