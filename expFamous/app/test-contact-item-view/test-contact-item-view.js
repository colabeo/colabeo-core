var Surface = require('famous/surface');
var View = require('famous/view');
var Modifier = require('famous/modifier');
var GenericSync = require('famous/input/generic-sync');
var MouseSync = require('famous/input/mouse-sync');
var TouchSync = require('famous/input/touch-sync');
var Transform = require('famous/transform');
var Easing = require('famous/transitions/easing');
var Transitionable   = require('famous/transitions/transitionable');
var WallTransition   = require('famous/transitions/wall-transition');
var SpringTransition   = require('famous/transitions/spring-transition');
var Engine = require('famous/engine');

Transitionable.registerMethod('wall', WallTransition);
Transitionable.registerMethod('spring', SpringTransition);

function TestContactItemView(){
    View.apply(this, arguments);

    this.buttonSize = 100;
    this.origin = [0, 0.5];
    this.editingOrigin = [2*this.buttonSize/window.innerWidth, 0.5];
    this.endOrigin = [1, 0.5];
    this.curOrigin;

    this.deleteSurface = this.createButton([this.buttonSize,this.buttonSize],"red","delete");
    this.favorSurface = this.createButton([this.buttonSize,this.buttonSize],"blue","favor");
    this.callSurface = this.createButton([this.buttonSize,this.buttonSize],"green","call");
    this.itemSurface = this.createItem([true,this.buttonSize],"yellow","item");

    this.deleteMod = this.createMod(this.origin,0,0);
    this.favorMod = this.createMod(this.origin,0,this.buttonSize);
    this.callMod = this.createMod(this.endOrigin,0,0);
    this.itemMod = this.createMod(this.origin,1,0);

    this._add(this.deleteMod).link(this.deleteSurface);
    this._add(this.favorMod).link(this.favorSurface);
    this._add(this.callMod).link(this.callSurface);
    this._add(this.itemMod).link(this.itemSurface);

    this.pos = [0,0];
    this.isEditingMode = false;

    var sync = new GenericSync(function(){
            return this.pos;
        }.bind(this), {
            syncClasses:[MouseSync,TouchSync]
        }
    );

    this.returnZeroOpacityTransition = {
        'curve' : Easing.outBackNorm,
        'duration' : 500
    };

    this.wallTransition = {
        method: 'wall',
        period: 200,
        dampingRatio: .65
    };

    this.itemSurface.pipe(sync);

    sync.on('start', function(data) {
        this.pos = [0,0]; // reset the position
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
        if (this.pos[0] > 2*this.buttonSize){
            this.toggleEditing();
        } else {
            this.setEditingOff();
        }
    }.bind(this));

    Engine.on('resize', this.resizeItem.bind(this));

    window.tt=this;


};

TestContactItemView.prototype = Object.create(View.prototype);
TestContactItemView.prototype.constructor = TestContactItemView;

TestContactItemView.prototype.createItem = function(size,color,content){
    var surface = new Surface({
        content: '<div style="width: ' + window.innerWidth + 'px">' + content + '</div>',
        size:size,
        properties:{
            backgroundColor:color
        }
    });
    return surface;
};
TestContactItemView.prototype.createButton = function(size,color,content){
    var surface = new Surface({
        content: '<div>' + content + '</div>',
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
        transform:Transform.translate(translateX,0,0)
    });
    return Mod;
};

TestContactItemView.prototype.animateItem = function(){
    this.itemMod.setTransform(Transform.translate(this.pos[0], 0, 0));
};

TestContactItemView.prototype.animateItemEnd = function(){
    var translate = Transform.identity;
    if (this.isEditingMode) {
        this.itemMod.setOrigin(this.editingOrigin, this.wallTransition);
        this.itemMod.setOpacity(0.5);
//        translate = Transform.translate(2*this.buttonSize,0,0);
    } else {
        this.itemMod.setOrigin(this.origin, this.wallTransition);
        this.itemMod.setOpacity(1);
//        translate = Transform.translate(0,0,0);
    }
    this.itemMod.setTransform(translate , this.wallTransition);
};

TestContactItemView.prototype.animateLeftButtons = function(){
    if (this.isEditingMode) return;
    var opacity = Math.min(this.pos[0]/(2*this.buttonSize), 1);
    this.deleteMod.setOpacity(opacity);
    this.favorMod.setOpacity(opacity);
};

TestContactItemView.prototype.animateLeftButtonsEnd = function(){
    if (this.isEditingMode) {
        this.deleteMod.setOpacity(1);
        this.favorMod.setOpacity(1)
    } else {
        this.deleteMod.setOpacity(0, this.returnZeroOpacityTransition);
        this.favorMod.setOpacity(0, this.returnZeroOpacityTransition)
    }
};

TestContactItemView.prototype.animateRightButtons = function(){
    if (this.pos[0] < 0) {
        this.callMod.setOpacity(Math.min(-1*this.pos[0]/this.buttonSize,1));
    }
};

TestContactItemView.prototype.animateRightButtonsEnd = function(){
    this.callMod.setOpacity(0, this.returnZeroOpacityTransition)
};

TestContactItemView.prototype.resizeItem = function(){
    this.itemSurface._currTarget.children[0].style.width = window.innerWidth + 'px';
};

TestContactItemView.prototype.setEditingOn = function(){
    this.isEditingMode = true;
    this.animateItemEnd();
    this.animateLeftButtonsEnd();
    this.animateRightButtonsEnd();
};

TestContactItemView.prototype.setEditingOff = function(){
    this.isEditingMode = false;
    this.animateItemEnd();
    this.animateLeftButtonsEnd();
    this.animateRightButtonsEnd();
};

TestContactItemView.prototype.toggleEditing = function(){
    this.isEditingMode = !this.isEditingMode;
    this.animateItemEnd();
    this.animateLeftButtonsEnd();
    this.animateRightButtonsEnd();
};

module.exports = TestContactItemView;

