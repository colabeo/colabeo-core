define(function(require, exports, module) {     
    var Surface    = require('famous/Surface');
    var View       = require('famous/View');
    var FM         = require('famous/Matrix');
    var Modifier   = require('famous/Modifier');
    var Easing     = require('famous-animation/Easing');
    var ButtonBase = require('./ButtonBase');

    function RotateButton ( options ) {
        ButtonBase.apply( this, arguments );

        this.transform.setOrigin([ 0.5, 0.5 ]);
        this._state = false;
        
    }

    RotateButton.prototype = Object.create( ButtonBase.prototype );
    RotateButton.prototype.constructor = RotateButton;

    RotateButton.DEFAULT_OPTIONS = {
        surfaceOptions: {},
        openState: FM.identity,
        closeState: FM.rotateZ( Math.PI * 0.75 ),
        transition: { 
            curve: Easing.inOutBackNorm,
            duration: 500
        }
    }; 

    RotateButton.prototype._handleClick = function (e ) {
        e.stopPropagation();
        this.toggle(); 
    }

    RotateButton.prototype.getSize = function () {
        return this.surface.getSize(); 
    };

    RotateButton.prototype.toggle = function (e) {
        if( this._state == false ) {
            this.open(); 
        } else { 
            this.close();
        }
    };

    RotateButton.prototype.open = function () {
        this._state = true;
        this.transform.halt();
        this.emit('open');
        this.transform.setTransform( this.options.closeState, this.options.transition);
    }; 

    RotateButton.prototype.close = function () {
        this._state = false;
        this.transform.halt();
        this.emit('close');
        this.transform.setTransform( this.options.openState, this.options.transition);
    };

    module.exports = RotateButton;
});
