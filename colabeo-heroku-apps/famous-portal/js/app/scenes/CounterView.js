define(function(require, exports, module) {  	
    var Counter = require('app/widgets/ColoredCounter');
    var Modifier = require('famous/Modifier');
    var FM = require('famous/Matrix');
    var Engine = require('famous/Engine');
    var Utils = require('famous-utils/Utils');
    var Easing = require('famous-animation/Easing');

    function CounterView ( ) {

        this.mod = new Modifier();
        this.counter = new Counter({
            localstorageId: 'famous-torque-counter'    
        });

        Engine.on('resize', Utils.debounce( this.placeMod.bind(this), 150));
        this.placeMod();
        
    }

    CounterView.prototype.setCtx = function (ctx) {
        ctx.add( this.mod ).link( this.counter );
    }

    CounterView.prototype.add = function ( num ) {
        return this.counter.add( num ); 
    }

    CounterView.prototype.placeMod = function () {
        this.mod.setTransform( 
            FM.translate( window.innerWidth - 20 - this.counter.getSize()[0] , window.innerHeight - 60 ),
            { curve: Easing.inOutBackNorm, duration: 400 } );
    }

    var counter = new CounterView();
    module.exports = counter;

});
