define(function(require, exports, module) {
    var EventHandler = require('./EventHandler');

    /**
     * 
     * @class EventArbiter 
     * @description A switch which wraps several event 
     *    destinations and redirects received events to at most one of them. 
     *    Setting the 'mode' of the object dictates which one 
     *    of these destinations will receive events.  
     *    It is useful for transferring control among
     *    many actionable areas in the event tree (like 'pages'), only one of 
     *    which is currently visible.  
     * 
     * @name EventArbiter
     * @constructor
     * 
     * @example
     *    var eventArbiter = new EventArbiter(PAGES.COVER);
     *    var coverHandler = eventArbiter.forMode(PAGES.COVER);
     *    coverHandler.on('my_event', function(event) { 
     *      document.title = 'Cover'; 
     *    });
     *    var overviewHandler = eventArbiter.forMode(PAGES.OVERVIEW)
     *    overviewHandler.on('my_event', function(event) { 
     *      document.title = 'Overview'; 
     *    });
     *  
     *    function loadPage(page) {
     *      eventArbiter.setMode(page);
     *      eventArbiter.emit('my_event', {data: 123})
     *    };
     *
     *    loadPage(PAGES.COVER);
     * 
     * @param {number|string} startMode initial setting of switch,
     */
    function EventArbiter(startMode) {
        this.dispatchers = {};
        this.currMode = undefined;
        this.setMode(startMode);
    };

    /**
     * Set switch to this mode, passing events to the corresopnding 
     *   {@link EventHandler}.  If mode has changed, emits 'change' 
     *   event to the  old mode's handler and 'modein' event to the new 
     *   mode's handler, passing along object {from: startMode, to: endMode}.
     *   
     * @name EventArbiter#setMode
     * @function
     * @param {string|number} mode indicating which event handler to send to.
     */
    EventArbiter.prototype.setMode = function(mode) {
        if(mode != this.currMode) {
            var startMode = this.currMode;
            if(this.dispatchers[this.currMode]) this.dispatchers[this.currMode].emit('unpipe');
            this.currMode = mode;
            if(this.dispatchers[mode]) this.dispatchers[mode].emit('pipe'); 
            this.emit('change', {from: startMode, to: mode});
        }
    };

    /**
     * Return the existing {@link EventHandler} corresponding to this 
     *   mode, creating one if it doesn't exist. 
     * 
     * @name EventArbiter#forMode
     * @function
     * @param {string|number} mode mode to which this eventHandler corresponds
     * @returns {EventHandler} eventHandler behind this mode's "switch"
     */
    EventArbiter.prototype.forMode = function(mode) {
        if(!this.dispatchers[mode]) this.dispatchers[mode] = new EventHandler();
        return this.dispatchers[mode];
    };

    /**
     * Send event to currently selected handler.
     *
     * @name EventArbiter#emit
     * @function
     * @param {string} eventType
     * @param {Object} event
     * @returns {boolean} true if the event was handled by at a leaf handler.
     */
    EventArbiter.prototype.emit = function(eventType, event) {
        if(this.currMode == undefined) return false;
        if(!event) event = {};
        var dispatcher = this.dispatchers[this.currMode];
        if(dispatcher) return dispatcher.emit(eventType, event);
    };

    module.exports = EventArbiter;
});
