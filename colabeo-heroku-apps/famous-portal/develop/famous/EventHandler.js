define(function(require, exports, module) {
   
    /**
     * @class EventHandler 
     * @description This object gives the user the opportunity to explicitly 
     *   control event propagation in their application. EventHandler forwards received events to a set of 
     *   provided callback functions. It allows events to be captured, processed,
     *   and optionally piped through to other event handlers.
     *
     * @name EventHandler
     * @constructor
     * 
     * @example
     *   var Engine = require('famous/Engine');
     *   var Surface = require('famous/Surface');
     *   var EventHandler = require('famous/EventHandler');
     *
     *   var Context = Engine.createContext();
     *
     *   var surface = new Surface({
     *       size: [200,200],
     *       properties: {
     *           backgroundColor: '#3cf'
     *       },
     *       content: 'test'
     *   });
     *
     *   eventListener = new EventHandler();
     *   surface.pipe(eventListener);
     *
     *   Context.add(surface);
     *
     *   eventInput.on('click', function(){
     *     alert('received click');
     *   });
     * 
     */
    function EventHandler() {
        this.listeners = {};
        this.downstream = []; // downstream event handlers
        this.downstreamFn = []; // downstream functions
        this.owner = this;
    }

    /**
     * Send event data to all handlers matching provided 'type' key. If handler 
     *    is not set to "capture", pass on to any next handlers also. Event's 
     *    "origin" field is set to this object if not yet set.
     *
     * @name EventHandler#emit
     * @function
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event received event data
     * @returns {boolean} true if this event has been handled by any handler
     */
    EventHandler.prototype.emit = function(type, event) {
        if(!event) event = {};

        var handlers = this.listeners[type];
        var handled = false;
        if(handlers) {
            for(var i = 0; i < handlers.length; i++) {
                if(handlers[i].call(this.owner, event)) handled = true;
            }
        }

        return _emitNext.call(this, type, event) || handled;
    };

    /**
     * Send event data to downstream handlers responding to this event type.
     *
     * @name _emitNext
     * @function
     * @private
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event received event data
     * @returns {boolean} true if this event has been handled by any 
     *   downstream handler
     */
    function _emitNext(type, event) {
        var handled = false;
        for(var i = 0; i < this.downstream.length; i++) {
            handled = this.downstream[i].emit(type, event) || handled;
        }
        for(var i = 0; i < this.downstreamFn.length; i++) {
            handled = this.downstreamFn[i](type, event) || handled;
        }
        return handled;
    };

    /**
     * Add handler function to set of callback functions for the provided 
     *   event type.  
     *   The handler will receive the original emitted event data object
     *   as its sole argument.
     * 
     * @name EventHandler#on
     * @function
     * @param  {string} type event type key (for example, 'click')
     * @param  {function(string, Object)} handler handler function
     * @returns {EventHandler} this
     */
    EventHandler.prototype.on = function(type, handler) {
        if(!this.listeners[type]) this.listeners[type] = [];
        var index = this.listeners[type].indexOf(handler);
        if(index < 0) this.listeners[type].push(handler);
        return this;
    };

    /**
     * Remove handler function from set of callback functions for the provided 
     *   event type. 
     * Undoes work of {@link EventHandler#on}
     * 
     * @name EventHandler#unbind
     * @function
     * @param  {string} type event type key (for example, 'click')
     * @param  {function(string, Object)} handler
     */
    EventHandler.prototype.unbind = function(type, handler) {
        var index = this.listeners[type].indexOf(handler);
        if(index >= 0) this.listeners[type].splice(index, 1);
    };

    /** 
     * Add handler object to set of DOWNSTREAM handlers.
     * 
     * @name EventHandler#pipe
     * @function
     * @param {emitterObject} target target emitter object
     */
    EventHandler.prototype.pipe = function(target) {
        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if(index < 0) downstreamCtx.push(target);

        if(target instanceof Function) target('pipe');
        else target.emit && target.emit('pipe');

        return target;
    };

    /**
     * Remove handler object from set of DOWNSTREAM handlers.
     * Undoes work of {@link EventHandler#pipe}
     * 
     * @name EventHandler#unpipe
     * @function
     * @param {emitterObject} target target emitter object
     */
    EventHandler.prototype.unpipe = function(target) {
        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if(index >= 0) {
            downstreamCtx.splice(index, 1);
            if(target instanceof Function) target('unpipe');
            else target.emit && target.emit('unpipe');
            return target;
        }
        else return false;
    };

    /**
     * Call event handlers with this set to owner
     *
     * @name EventHandler#bindThis
     * @function
     * @param {Object} owner object this EventHandler belongs to
     */
    EventHandler.prototype.bindThis = function(owner) {
        this.owner = owner;
    };

    /**
     * Assign an event handler to receive an object's events. 
     *
     * @name EventHandler#setInputHandler
     * @static
     * @function
     * @param {Object} object object to mix in emit function
     * @param {emitterObject} handler assigned event handler
     */
    EventHandler.setInputHandler = function(object, handler) {
        object.emit = handler.emit.bind(handler);
    };

    /**
     * Assign an event handler to emit an object's events
     *
     * @name EventHandler#setOutputHandler
     * @static
     * @function
     * @param {Object} object object to mix in pipe/unpipe/on/unbind functions
     * @param {emitterObject} handler assigned event emitter
     */
    EventHandler.setOutputHandler = function(object, handler) {
        if(handler instanceof EventHandler) handler.bindThis(object);
        object.pipe = handler.pipe.bind(handler);
        object.unpipe = handler.unpipe.bind(handler);
        object.on = handler.on.bind(handler);
        object.unbind = handler.unbind.bind(handler);
    };

    module.exports = EventHandler;
});
