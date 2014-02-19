define(function(require, exports, module) {
    var EventHandler = require('./EventHandler');

    /*
     *  @constructor 
     *  @name OptionsManager
     *
     *  @description
     *  Used in {@link View} to manage the default options and customization of the view. 
     *
     *  **** WARNING **** 
     *  You can only pass through objects that will compile into valid JSON. 
     *
     *  Valid options: 
     *      Strings,
     *      Arrays,
     *      Objects,
     *      Numbers,
     *      Nested Objects,
     *      Nested Arrays
     *
     *  This excludes: 
     *      Document Fragments,
     *      Functions
     *
     */

    function OptionsManager(value) {
        this._value = value;
        this.eventOutput = null;
    };

    function _createEventOutput() {
        this.eventOutput = new EventHandler();
        this.eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this.eventOutput);
    };

    OptionsManager.prototype.patch = function() {
        var myState = this._value;
        for(var i = 0; i < arguments.length; i++) {
            var patch = arguments[i];
            for(var k in patch) {
                if((k in myState) && (patch[k].constructor === Object) && (myState[k].constructor === Object)) {
                    if(!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k]);
                    this.key(k).patch(patch[k]);
                    if(this.eventOutput) this.eventOutput.emit('change', {id: k, value: this.key(k).value()});
                }
                else this.set(k, patch[k]);
            }
        }
        return this;
    };
    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

    OptionsManager.prototype.key = function(key) {
        var result = new OptionsManager(this._value[key]);
        if(!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
        return result;
    };

    OptionsManager.prototype.get = function(key) {
        return this._value[key];
    };
    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

    OptionsManager.prototype.set = function(key, value) {
        var originalValue = this.get(key);
        this._value[key] = value;
        if(this.eventOutput && value !== originalValue) this.eventOutput.emit('change', {id: key, value: value});
        return this;
    };

    OptionsManager.prototype.value = function() {
        return this._value;
    };

    /* These will be overridden once this.eventOutput is created */
    OptionsManager.prototype.on = function() { _createEventOutput.call(this); return this.on.apply(this, arguments); }
    OptionsManager.prototype.unbind = function() { _createEventOutput.call(this); return this.unbind.apply(this, arguments); }
    OptionsManager.prototype.pipe = function() { _createEventOutput.call(this); return this.pipe.apply(this, arguments); }
    OptionsManager.prototype.unpipe = function() { _createEventOutput.call(this); return this.unpipe.apply(this, arguments); }

    module.exports = OptionsManager;
});
