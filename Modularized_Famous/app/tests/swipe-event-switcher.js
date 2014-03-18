var Engine = require('famous/engine');
var EventArbiter = require('famous/event-arbiter');
var OptionsManager = require('famous/options-manager');
var Utility = require('famous/utilities/utility');
var EventHandler = require('famous/event-handler');

var GenericSync = require('famous/input/generic-sync');
var MouseSync = require('famous/input/mouse-sync');
var TouchSync = require('famous/input/touch-sync');

//var CustomSync = require('custom-sync');

/*
 *  @constructor
 *  @description
 *      Takes an incoming event system and uses an event Arbiter to choose
 *      where to pipe based on the direction of the incoming swipes.
 */
function SwipeEventSwitcher ( options ) {

    this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
    this.optionsManager = new OptionsManager(this.options);
    if(options) this.setOptions(options);

    this.eventArbiter = new EventArbiter();

    this.pos = [0,0];
    var sync = new GenericSync(function(){
        return this.pos;
    }.bind(this),{syncClasses:[MouseSync,TouchSync]
    });

    EventHandler.setInputHandler(this, sync.eventInput);
    EventHandler.setOutputHandler(this, sync.eventOutput);

    this.on('start', this.handleStart);
    this.on('update', this.handleUpdate);
    this.on('end', this.handleEnd);

    this.clearArbiter = this._clearArbiter.bind(this);

}

SwipeEventSwitcher.DEFAULT_OPTIONS = {
    syncClasses: ['Touch', 'Mouse']
}

SwipeEventSwitcher.prototype.handleStart = function ( e ) {
    console.log('start', e);
    this.pos=[0,0];
    this._directionChosen = false;

}

SwipeEventSwitcher.prototype.handleUpdate = function ( e ) {
    this.pos = e.p;
    console.log('update', e );
    if( !this._directionChosen ) {

        this.pipe( this.eventArbiter );
        var direction = this._getDirection( );
        this.setDirection(direction);
        this._directionChosen = true;
        this.eventArbiter.forMode( direction ).emit('start', {count: 1, touch: 0});

    }
}

SwipeEventSwitcher.prototype.handleEnd = function ( e ) {
    console.log('end', e );
    Engine.nextTick( this.clearArbiter );

}

/*
 *  @name SwipeEventSwitcher#_clearArbiter
 *  @description
 *      This unpipes the events, and resets the event arbiter. This is done to allow
 *      the last end event to fire before unpiping.
 */
SwipeEventSwitcher.prototype._clearArbiter = function () {
    this.eventArbiter.setMode( undefined );
    this.unpipe( this.eventArbiter );
}

/*
 *  @name SwipeEventSwitcher#setLeftRight
 *  @param {function} handler - function that will receive the piped events
 *
 *  @description
 *      The left/right handler gets events only when it's detected that this is a
 *      horizontal swipe
 */
SwipeEventSwitcher.prototype.setLeftRight = function ( handler ) {

    var arbiterHandler = this.eventArbiter.forMode( Utility.Direction.X);
    arbiterHandler.pipe( handler );

}

/*
 *  @name SwipeEventSwitcher#setUpDown
 *  @param {function} handler - function that will receive the piped events
 *
 *  @description
 *      The up/down handler gets events only when it's detected that this is a
 *      vertiacl swipe
 */
SwipeEventSwitcher.prototype.setUpDown = function ( handler ) {

    var arbiterHandler = this.eventArbiter.forMode( Utility.Direction.Y);
    arbiterHandler.pipe( handler );

}

/*
 *  @name SwipeEventSwitcher#_getDirection
 *  @param {Array.number} coord - x , y coordinate
 *  @returns {number} 0 or 1, whichever direction has more change.
 */
SwipeEventSwitcher.prototype._getDirection = function ( ) {

    var diffX = Math.abs( this.pos[0] ),
        diffY = Math.abs( this.pos[1] );

    return diffX > diffY ? Utility.Direction.X : Utility.Direction.Y;

}

/*
 *  @name SwipeEventSwitcher#setDirection
 *  @param {number} dir - x or y ( 0 or 1 )
 *  @description
 *      Actually set the eventArbiter.
 */
SwipeEventSwitcher.prototype.setDirection = function ( dir ) {

    this.eventArbiter.setMode( dir );

}



module.exports = SwipeEventSwitcher;
