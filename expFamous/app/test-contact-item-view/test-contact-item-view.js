var Surface = require('famous/surface');
var View = require('famous/view');
var Modifier = require('famous/modifier');
var GenericSync = require('famous/input/generic-sync');
var MouseSync = require('famous/input/mouse-sync');
var TouchSync = require('famous/input/touch-sync');
var FM = require('famous/transform');
var Easing = require('famous/transitions/easing');
var Transitionable   = require('famous/transitions/transitionable');
var WallTransition   = require('famous/transitions/wall-transition');
var SpringTransition   = require('famous/transitions/spring-transition');
Transitionable.registerMethod('wall', WallTransition);
Transitionable.registerMethod('spring', SpringTransition);

function TestContactItemView(){
    View.apply(this, arguments);

    this.buttonSize = 100;

    this.deleteSurface = this.createSurface([this.buttonSize,this.buttonSize],"red","delete");
    this.favorSurface = this.createSurface([this.buttonSize,this.buttonSize],"blue","favor");
    this.callSurface = this.createSurface([this.buttonSize,this.buttonSize],"green","call");
    this.itemSurface = this.createSurface([400,this.buttonSize],"yellow","item");

    this.itemMod = this.createMod([0.5,0.5],1,0);
    this.deleteMod = this.createMod([0,0.5],0,0);
    this.favorMod = this.createMod([0,0.5],0,100);
    this.callMod = this.createMod([1,0.5],0,0);

    this._add(this.itemMod).link(this.itemSurface);
    this._add(this.deleteMod).link(this.deleteSurface);
    this._add(this.favorMod).link(this.favorSurface);
    this._add(this.callMod).link(this.callSurface);

    this.pos = [0,0];
    this.showingLeftButtons = false;

    var sync = new GenericSync(function(){
        return this.pos
    }.bind(this),{syncClasses:[MouseSync,TouchSync]
    });

    this.returnZeroOpacityTransition = {
        'curve' : Easing.outBackNorm,
        'duration' : 500
    };

    this.itemSurface.pipe(sync);
    sync.on('start', function(data) {
        this.pos = [0,0];
        if (this.showingLeftButtons) this.pos = [2*this.buttonSize,0]

    }.bind(this));

    sync.on('update', function(data) {
        this.pos = data.p;  // the displacement from the start touch point.
        this.animateItem();
        if (this.pos[0] > 0) {
            this.animateLeftButtons()
        } else {
            this.animateRightButtons();
        }
    }.bind(this));

    sync.on('end', function(data) {
        if (this.showingLeftButtons == false && this.pos[0] > 2*this.buttonSize){
            this.showingLeftButtons = true;
        }
        this.animateItemEnd();
        this.animateLeftButtonsEnd();
        this.animateRightButtonsEnd();
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

TestContactItemView.prototype.createMod= function(origin, opacity, translateX){
    var Mod = new Modifier({
        origin: origin,
        opacity:opacity,
        transform:FM.translate(translateX,0,0)
    });
    return Mod;
};

TestContactItemView.prototype.animateItem = function(){
    if (this.pos[0] > 0){
        this.itemMod.setTransform(FM.translate(Math.min(this.pos[0],window.innerWidth), 0, 0));
    } else {
        this.itemMod.setTransform(FM.translate(Math.max(this.pos[0],-window.innerWidth), 0, 0));
    }
};

TestContactItemView.prototype.animateItemEnd = function(){
    if (this.showingLeftButtons) {
        this.itemMod.setTransform(FM.translate(2*this.buttonSize,0,0) ,{
            method: 'wall',
            period: 500,
            dampingRatio: .1
        });
    } else {
        this.itemMod.setTransform(FM.identity ,{
            method: 'wall',
            period: 500,
            dampingRatio: .1
        });
    }
};

TestContactItemView.prototype.animateLeftButtons = function(){
    if (this.pos[0] > 0){
        this.deleteMod.setOpacity(Math.min(this.pos[0]/this.buttonSize, 1));
        this.favorMod.setOpacity(Math.min((this.pos[0]-this.buttonSize)/this.buttonSize, 1));
    }

};

TestContactItemView.prototype.animateLeftButtonsEnd = function(){
    if (this.showingLeftButtons) {
        this.deleteMod.setOpacity(1);
        this.favorMod.setOpacity(1)
    } else {
        this.deleteMod.setOpacity(0, this.returnZeroOpacityTransition);
        this.favorMod.setOpacity(0, this.returnZeroOpacityTransition)
    }
};

TestContactItemView.prototype.animateRightButtons = function(){
    if (this.pos[0] < 0) {
        console.log(Math.min(-1*this.pos[0]/this.buttonSize,1))
        this.callMod.setOpacity(Math.min(-1*this.pos[0]/this.buttonSize,1));
    }
};

TestContactItemView.prototype.animateRightButtonsEnd = function(){
    this.callMod.setOpacity(0, this.returnZeroOpacityTransition)

};

window.tt=this;

module.exports = TestContactItemView;

