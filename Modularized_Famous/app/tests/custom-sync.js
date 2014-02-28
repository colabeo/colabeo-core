var EventHandler = require('famous/event-handler');
var Utility = require('famous/utilities/utility');

// Sync Classes
var MouseSync = require('famous/input/mouse-sync');
var PinchSync = require('famous/input/pinch-sync');
var RotateSync = require('famous/input/rotate-sync');
var ScaleSync = require('famous/input/scale-sync');
var ScrollSync = require('famous/input/scroll-sync');
var TouchSync = require('famous/input/touch-sync');
var TwoFingerSync = require('famous/input/two-finger-sync');

var SYNCS = {
    'Mouse'     : MouseSync,
    'Pinch'     : PinchSync,
    'Rotate'    : RotateSync,
    'Scale'     : ScaleSync,
    'Scroll'    : ScrollSync,
    'Touch'     : TouchSync,
    'TwoFinger' : TwoFingerSync
}

/*
 *  @name
 *  CustomSync:
 *
 *  @description
 *  A sync registry that allows you to choose exactly
 *  which sync classes you want, with custom or default
 *  options.
 *
 *  @example
 *  Creating a sync with simple options:
 *
 *  @description
 *  This will use the default sync options for all of the
 *  syncs you would like to register.
 *
 *  ****
 *
 *  var pos = [0,0];
 *
 *  function updatePos ( data ) {
 *      pos = data.p
 *  }
 *
 *  var customSync = new CustomSync(updatePos, [
 *      'Touch', 'Mouse'
 *  ]);
 *
 *  ****
 *
 *  @example
 *  Creating a CustomSync with complex options:
 *
 *  @description
 *  If you needed to set custom options for each registered
 *  sync, you can use an example like this.
 *
 *  ****
 *
 *  var pos = [0,0];
 *  function updatePos ( data ) {
 *      pos = data.p
 *  }
 *  var customSync = new CustomSync(updatePos, [
 *      {
 *          type: 'Touch',
 *          options: {}
 *      },
 *      {
 *          type: 'Mouse',
 *          options: {}
 *      }
 *  ]);
 *
 *  ****
 *
 *  @example
 *  Creating a CustomSync with complex mixed options:
 *
 *  @description
 *  You can mix and match complex and simple sync definitions.
 *
 *  ****
 *
 *  var pos = [0,0];
 *  function updatePos ( data ) {
 *      pos = data.p
 *  }
 *  var customSync = new CustomSync(updatePos, [
 *      'Mouse',
 *      'Touch',
 *      {
 *          type: 'Scroll',
 *          options: {
 *              scale: 5,
 *              stallTime: 25
 *          }
 *      }
 *  ]);
 *
 *  ****
 *
 *
 *  @example
 *  Listening to Events on any kind of CustomSync
 *
 *  ****
 *  var sync = new CustomSync(targetGet, ['mouse', 'touch']);
 *  sync.on('start', function ( data ) {
 *      console.log('start', data );
 *  });
 *
 *  sync.on('update', function ( data ) {
 *      console.log('update', data );
 *  });
 *
 *  sync.on('end', function ( data ) {
 *      console.log('end', data );
 *  });
 *
 */
function CustomSync ( classes, targetGet ) {

    this._handlers = [];
    this.targetGet;
    this._eventsBound = false;

    this.eventInput = new EventHandler();
    this.eventOutput = new EventHandler();

    EventHandler.setInputHandler(this, this.eventInput);
    EventHandler.setOutputHandler(this, this.eventOutput);

    this.setTargetGet( targetGet );
    this.setClasses( classes);

}

/*
 *  @private
 *  unbinds all handlers
 */
function _unbindHandlers () {

    for (var i = 0; i < this._handlers.length; i++) {
        this.eventInput.unpipe( this._handlers[i] );
        this._handlers[i].unpipe(this.eventOutput);
    };

    this._eventsBound = false;

}

function _bindHandlers () {

    for (var i = 0; i < this._handlers.length; i++) {

        this.eventInput.pipe( this._handlers[i] );
        this._handlers[i].pipe( this.eventOutput );

    };

    this._eventsBound = true;

}

CustomSync.prototype.setTargetGet = function ( fn ) {

    this.targetGet = fn;
    return this;

}

/*
 *  @name CustomSync#setHandler
 *  @description Assign an object emit / pipe / unpipe / on / unbind
 */
CustomSync.prototype.setHandler = function (obj) {

    EventHandler.setInputHandler( obj, this.eventInput );
    EventHandler.setOutputHandler( obj, this.eventOutput );

}

CustomSync.prototype.bindThis = function (obj) {

    this.eventOutput.bindThis( obj );
}

/*
 *  @name CustomSync#setClasses
 *  @classes {array}
 *      classes can contain either strings (no custom options) or
 *      objects (with custom options for that sync class).
 */
CustomSync.prototype.setClasses = function ( classes ) {

    // if there are handlers already bound, unbind them!
    if( this._handlers ) _unbindHandlers.call( this );

    // create handlers
    for (var i = 0; i < classes.length; i++) {

        var syncDefinition = classes[i];

        if( typeof syncDefinition === 'string' ) {

            simpleParse.call(this, syncDefinition);

        } else {

            complexParse.call(this, syncDefinition);

        }
    };

    // bind events to handlers
    _bindHandlers.call( this );

    return this;
}

function simpleParse ( string ) {
    var Handler = SYNCS[ string ];

    if( Handler == undefined ) console.warn( 'no such sync class' );

    var handler = new Handler();

    this._handlers.push( handler );
}

function complexParse ( syncDefinition ) {

    var Handler = SYNCS[syncDefinition.type];
    var opts = syncDefinition.options || {};

    if( Handler == undefined ) console.warn( 'no such sync class' );

    var handler = new Handler( opts, this.targetGet );

    this._handlers.push( handler );
}

/*
 *  @name CustomSync#setActive
 *  @description
 *      Actiate the syncs, resuming events.
 */
CustomSync.prototype.setActive = function () {
    if( !this._eventsBound ) _bindHandlers.call( this );
}

/*
 *  @name CustomSync#setInactive
 *  @description
 *      Temporarily set the syncs inactive, firing no events.
 */
CustomSync.prototype.setInactive = function () {
    if( this._eventsBound ) _unbindHandlers.call( this );
}

module.exports = CustomSync;
