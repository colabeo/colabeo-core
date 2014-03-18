var RenderNode = require('famous/render-node');
var Surface = require('famous/surface');
var View = require('famous/view');
var Engine = require('famous/engine');
var Modifier = require('famous/modifier');
var GenericSync = require('famous/input/generic-sync');
var MouseSync = require('famous/input/mouse-sync');
var TouchSync = require('famous/input/touch-sync');
var Transform = require('famous/transform');
var Transitionable   = require('famous/transitions/transitionable');
var WallTransition   = require('famous/transitions/wall-transition');
var SpringTransition   = require('famous/transitions/spring-transition');
var EventArbiter = require('famous/event-arbiter');
var SwipeEventSwitcher   = require('swipe-event-switcher');
var CustomSync = require('custom-sync');
var Utility = require('famous/utilities/utility');

Transitionable.registerMethod('wall', WallTransition);
Transitionable.registerMethod('spring', SpringTransition);

function ItemView(msg){
    View.call(this);

    this.itemSurface = this.createSurface([undefined,100],"yellow",msg);
    this.itemMod = this.createMod([0.5,0],1);
    this._link(this.itemMod).link(this.itemSurface);
    this.setupEvent();
    window.ii=this;
}

ItemView.prototype = Object.create(View.prototype);
ItemView.prototype.constructor = ItemView;



ItemView.prototype.setupEvent = function(){
    this.pos = [0,0];
    var sync = new GenericSync(function(){
        return this.pos;
    }.bind(this),{syncClasses:[MouseSync,TouchSync]
    });
    sync.on('start', function() {
        this.pos = [0,0];
        this._directionChosen = false;
    }.bind(this));
    sync.on('update', function(data) {
        this.pos = data.p;  // the displacement of last frame.
        if( !this._directionChosen ) {
            var diffX = Math.abs( this.pos[0] ),
                diffY = Math.abs( this.pos[1] );
            this.direction = diffX > diffY ? Utility.Direction.X : Utility.Direction.Y;
            this._directionChosen = true;
            if (this.direction == Utility.Direction.X) {
                this.itemSurface.unpipe(this.eventOutput);
            }
            else {
                this.itemSurface.pipe(this.eventOutput);
            }
        } else {
            if (this.direction == Utility.Direction.X) {
                this.animateItem();
            }
        }
    }.bind(this));
    sync.on('end', function() {
        this.itemMod.setTransform(Transform.identity ,{
            method: 'wall',
            period: 500,
            dampingRatio: .1
        });
    }.bind(this));

    this.itemSurface.pipe(sync);
    this.itemSurface.pipe(this.eventOutput);

};

ItemView.prototype.createSurface = function(size,color,content){
    return (new Surface({
        content:content,
        size:size,
        properties:{
            color: "black",
            fontSize: 60,
            backgroundColor:color
        }
    }));
};

ItemView.prototype.createMod= function(origin, opacity){
    return( new Modifier({
        origin: origin,
        opacity:opacity
    }));
};

ItemView.prototype.animateItem = function(){
    this.itemMod.setTransform(Transform.translate(this.pos[0], 0, 0));
};

module.exports = ItemView;

