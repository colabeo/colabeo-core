define(function(require, exports, module) {
    var Scrollview = require('famous-views/Scrollview');
    var Surface = require('famous/Surface');
    var View = require('famous/View');
    var Util = require('famous/Utility');
    var Engine = require('famous/Engine');
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
    function TestScene(){
        View.apply(this, arguments);

        this.mod = new Modifier({
            origin:[0.5,0.5]
        });
        this.smallMod = new Modifier({
            origin:[-0.1,0.5],
            opacity: 1
        });
        this.smallSurface = new Surface({
            size:[50,50],
            properties:{
                backgroundColor: "blue"
            }
        });
        this.bigSurface = new Surface({
            size:[100,100],
            properties:{
                backgroundColor: "yellow"
            }
        });

        this.position=[0,0];

        var sync = new GenericSync(function(){
            return this.position
        }.bind(this),{syncClasses:[MouseSync,TouchSync]
        });

        var swipeBackTransition = {
            'curve' : Easing.outBounceNorm,
            'duration' : 1000
        };

        this.bigSurface.pipe(sync);
        sync.on('start', function(data) {
            this.position = [0,0];
//            console.log( data );
        }.bind(this));

        sync.on('update', function(data) {
            // set position to the current, so it can be added together.
            this.position = data.p;
            console.log(this.position);
            this.mod.setTransform(FM.translate(this.position[0], 0, 0));
            this.moveSmallSurface(this.position);
        }.bind(this));

        sync.on('end', function(data) {
//            this.mod.setOrigin([0.5,0.1],swipeBackTransition)
            this.mod.setTransform(FM.identity ,{
                method: 'spring',
                period: 500,
                dampingRatio: .01
            });
            this.moveSmallSurface(this.mod.transformTranslateState.state);
            this.smallMod.setOpacity(0, swipeBackTransition)
            this.smallMod.setOrigin([0.1,0.4], swipeBackTransition);

        }.bind(this));
        this._add(this.smallMod).link(this.smallSurface);
        this._add(this.mod).link(this.bigSurface);

        window.tt=this;


    };

    TestScene.prototype = Object.create(View.prototype);
    TestScene.prototype.constructor = TestScene;

    TestScene.prototype.moveSmallSurface = function(position){
        var distance = Math.pow(Math.pow(position[0],2) + Math.pow(position[1],2), 0.5);
        var opacity = Math.pow(distance / (4 * Math.pow(5000, 0.5)),2);
        this.smallMod.setOpacity(opacity);
//        console.log(opacity)
    };



    window.tt=this;

    module.exports = TestScene;
});

