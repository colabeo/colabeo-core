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

    function TestScene(){
        Scene.apply(this, arguments);

        this.mod = new Modifier({
            origin:[0.5,0.5]
        });
        var surface = new Surface({
            size:[100,100],
            properties:{
                backgroundColor: "yellow"
            }
        });
        this.position=[0,0];

        var sync = new GenericSync(function(){
            return this.position
        },{syncClasses:[MouseSync,TouchSync]
        });

        surface.pipe(sync);

        this._link(this.mod).link(surface);
        window.tt=this;


    };

    TestScene.prototype = Object.create(View.prototype);
    TestScene.prototype.constructor = TestScene;

    TestScene.prototype.startTouch = function(){
//        return this.position;
    }
    TestScene.prototype.updateTouch = function(){
        this.mod.setTransform(FM.translate(this.position[0],this.position[1],0))
    }
    TestScene.prototype.endTouch = function(){
//        this.mod.setTransform()
    }



    module.exports = TestScene;
});

