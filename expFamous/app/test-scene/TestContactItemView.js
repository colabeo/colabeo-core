var Surface = require('famous/Surface');
var View = require('famous/View');
var Scene = require('famous/scene');
var Modifier = require('famous/Modifier');
var GenericSync = require('famous-sync/GenericSync');
var MouseSync = require('famous-sync/MouseSync');
var TouchSync = require('famous-sync/TouchSync');
var FM = require('famous/Matrix');
var Easing = require('famous-animation/Easing');
var Transitionable   = require('famous/Transitionable');
var WallTransition   = require('famous-physics/utils/WallTransition');
var SpringTransition   = require('famous-physics/utils/SpringTransition');
Transitionable.registerMethod('wall', WallTransition);
Transitionable.registerMethod('spring', SpringTransition);

function TestContactItemView(){
    View.apply(this, arguments);

    this.itemSurface = this.createSurface([undefined,100],"yellow","item");
    this.deleteSurface = this.createSurface([50,50],"red","delete");
    this.favorSurface = this.createSurface([50,50],"blue","favor");
    this.callSurface = this.createSurface([50,50],"call","green");

    this.itemMod = this.createMod([0.5,0.5],1);
    this.deleteMod = this.createMod([-0.2,0.5],0);
    this.favorMod = this.createMod([-0.2,0.5],0);
    this.callMod = this.createMod([1.2,0.5],0);

    this._add(this.itemMod).link(this.itemSurface);
    this._add(this.deleteMod).link(this.deleteSurface);
    this._add(this.favorMod).link(this.favorSurface);
    this._add(this.callMod).link(this.callSurface);

    this.posX = [0,0];
    this.showingLeftButtons = false;

    var sync = new GenericSync(function(){
        return this.posX
    }.bind(this),{syncClasses:[MouseSync,TouchSync]
    });

    var swipeBackTransition = {
        'curve' : Easing.outBackNorm,
        'duration' : 500
    };

    this.itemSurface.pipe(sync);
    sync.on('start', function(data) {
        this.posX = [0,0];
    });

    sync.on('update', function(data) {
        this.posX = data.p;  // the displacement of last frame.
        this.animateItem(this.posX);
        if (this.posX > 0) {
            this.animateLeftButtons()
        } else {
            this.animateRightButtons();
        }
    }.bind(this));

    sync.on('end', function(data) {
        this.itemMod.setTransform(FM.identity ,{
            method: 'wall',
            period: 500,
            dampingRatio: .1
        });
    }.bind(this));


    window.tt=this;


};

TestContactItemView.prototype = Object.create(View.prototype);
TestContactItemView.prototype.constructor = TestContactItemView;

TestContactItemView.prototype.createSurface = function(size,color,content){
    var surface = new Surface({
        content:content,
        size:size,
        properties:{
            backgroundColor:color
        }
    });
    return surface;
};

TestContactItemView.prototype.createMod= function(origin, opacity){
    var Mod = new Modifier({
        origin: origin,
        opacity:opacity
    });
    return Mod;
};

TestContactItemView.prototype.animateItem = function(position){
    this.itemMod.setTransform(FM.translate(position[0], 0, 0));
};

TestContactItemView.prototype.animateLeftButtons = function(){
    this.itemMod.setTransform(FM.translate(0, 0, 0));
};

TestContactItemView.prototype.animateRightButtons = function(){
    this.itemMod.setTransform(FM.translate(0, 0, 0));
};

window.tt=this;



