define(function(require, exports, module) { 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
 	var Surface = require('famous/Surface'); 
    var Modifier = require('famous/Modifier');
    var Easing = require('famous-animation/Easing');

    // Physics!!
    var Transitionable  = require('famous/Transitionable');
    var PhysicsTrans    = require('famous-physics/utils/PhysicsTransition');
    Transitionable.registerMethod('physics', PhysicsTrans);

    /*
     * @constructor
     */
    function Counter () {
        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );

        // 
        this.surfaces   = [];
        this.mods       = [];

        this._positions = {
            prev: 0,
            curr: 1,
            next: 2
        }

        // STATE
        this._currSelected = 1;
        this.value = this.options.defaultValue;

        if( localStorage ) { 
            var stored =  localStorage.getItem( this.options.localStorageId );
            if( stored ) { 
                this.value = parseInt( stored );
            }
        }

        initRotations.call( this );
        init.call( this );
    }

    Counter.prototype = Object.create( View.prototype );
    Counter.prototype.constructor = Counter;

    Counter.prototype.getSize = function  () {
        return this.currNumber.getSize();
    }

    Counter.DEFAULT_OPTIONS = { 
        size: [200, 60],
        numberClasses: [ 'counter-number' ],
        numberProperties: { 
            'textAlign': 'right',
        },
        radius: 75,
        curve: {
            method: 'physics',
            spring: { 
                period : 700, 
                dampingRatio : 0.25
            },
            wall: false,
            v: -0.001
            
        },
        rotation: Math.PI * .25,
        defaultValue: 0,
        localStorageId: 'famous-counter',
        useLocalStorage: true
    }

    function init () {
        var positions = [ this.rotations.prev, this.rotations.curr, this.rotations.next ] 
        for( var i = 0; i < 3; i++ ) {

            var surface = new Surface({
                size: this.options.size,
                properties: this.options.numberProperties,
                content: this.value + '' ,
                classes: this.options.numberClasses
            });

            var mod = new Modifier({
                transform: positions[i],
                opacity: 0
            });

            this.node.add( mod ).link( surface );

            this.surfaces.push( surface );
            this.mods.push( mod );
        }

        // show initial 
        this.mods[this._currSelected].setOpacity( 1, this.options.curve );
    }

    function initRotations () {
        var rotation = this.options.rotation;
        this.rotations = { 
            prev    : FM.aboutOrigin([0,0,-this.options.radius], FM.rotateX( rotation )),
            curr    : FM.aboutOrigin([0,0,-this.options.radius], FM.rotateX( 0 )), 
            next    : FM.aboutOrigin([0,0,-this.options.radius], FM.rotateX( -rotation )) 
        }
    }

    // public methods
    Counter.prototype.subtract = function ( num ) {

        this.value -= num;

        this._setNextToValue();

        var prev = currentToPrev.call( this );
        var curr = nextToCurrent.call( this );
        var next = prevToNext.call( this );

        this._currSelected = curr;

        this._storage();
    }

    Counter.prototype.add = function ( num ) {

        this.value += num;

        this._setPrevToValue();

        var prev = nextToPrevious.call( this );
        var curr = prevToCurrent.call( this );
        var next = currentToNext.call( this );

        this._currSelected = curr;

        this._storage();
    }

    Counter.prototype._storage = function  () {
        
        if( localStorage ) { 
            localStorage.setItem( this.options.localStorageId, this.value ); 
        }

    }

    Counter.prototype.addOne = function () {
        this.add( 1 );
    }

    Counter.prototype.subOne = function  () {
        this.subtract( 1 ); 
    }

    Counter.prototype.get = function  () {
        return this._value; 
    }

    // content sets
    Counter.prototype._setToValue = function ( surface ) {
        surface.setContent( this.value + '' ); 
    }

    Counter.prototype._setPrevToValue = function () {
        var surface = this.surfaces[ getPrev.call(this) ]; 
        this._setToValue( surface );
    }

    Counter.prototype._setNextToValue = function () {
        var surface = this.surfaces[ getNext.call(this) ]; 
        this._setToValue( surface );
    }

    Counter.prototype.getSize = function () {
        return this.options.size; 
    }


    // private methods
    function getPrev () {
        var index =  (this._currSelected - 1 ) % 3;
        return index == -1 ? 2 : index;
    }
    function getNext () {
       return ( this._currSelected + 1 ) % 3; 
    }
    // adding animations
    function currentToNext ( callback ) {
        var current = this.mods[ this._currSelected ];
        current.halt();
        current.setTransform( this.rotations.next, this.options.curve, callback );
        current.setOpacity( 0, this.options.curve );

        return this._currSelected;
    }

    function prevToCurrent ( callback ) {
        var index = getPrev.call( this );
        var prev = this.mods[ index ]; 

        prev.halt();
        prev.setTransform( this.rotations.curr, this.options.curve, callback );
        prev.setOpacity( 1, this.options.curve );

        return index;
    }

    function nextToPrevious ( ) {
        var index = getNext.call( this );
        var next = this.mods[ index ];

        next.halt();
        next.setTransform( this.rotations.prev );
        next.setOpacity( 0 );

        return index;
    }

    // subtracting animations
    function currentToPrev () {
        var current = this.mods[ this._currSelected ];
        current.halt();
        current.setTransform( this.rotations.prev, this.options.curve, callback );
        current.setOpacity( 0, this.options.curve );
    }

    function nextToCurrent () {
        var index = getNext.call( this );
        var next = this.mods[ index ];

        next.halt();
        next.setTransform( this.rotations.curr, this.options.curve, callback);
        next.setOpacity( 1, this.options.curve );

        return index;
    }

    function prevToNext () {
        var index = getPrev.call( this );
        var prev = this.mods[ index ]; 

        prev.halt();
        prev.setTransform( this.rotations.next );
        prev.setOpacity( 0 );

        return index;        
    }
    module.exports = Counter;
});
