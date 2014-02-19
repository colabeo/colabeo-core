define(function(require, exports, module) {     
    var Surface = require('famous/Surface'); 
    var View = require('famous/View');
    var FM = require('famous/Matrix');      
    var Modifier = require('famous/Modifier');
    var Easing = require('famous-animation/Easing');

    function ButtonBase ( options ) {
        View.apply( this, arguments );
        this.eventInput.pipe( this.eventOutput );

        this.surface = new Surface(this.options.surfaceOptions); 

        this.surface.pipe(this); 

        this.transform = new Modifier({ 
            size: this.surface.getSize() 
        });

        this.node.link( this.transform ).link( this.surface );

        this.surface.pipe( this );

        this.surface.on('click', this._handleClick.bind(this));

        this._state = false;
        
    }
    ButtonBase.prototype = Object.create( View.prototype );
    ButtonBase.prototype.constructor = ButtonBase;

    ButtonBase.DEFAULT_OPTIONS = {
        surfaceOptions: {},
        openState: FM.identity,
        closeState: FM.rotateZ( Math.PI * 0.75 ),
        transition: { 
            curve: Easing.inOutBackNorm,
            duration: 500
        }
    }; 

    ButtonBase.prototype._handleClick = function () {
        
    }

    ButtonBase.prototype.halt = function () {
        this.transform.halt();
    }    

    ButtonBase.prototype.setTransform = function () {
        this.transform.setTransform.apply( this.transform, arguments ); 
    }
    ButtonBase.prototype.setOpacity = function () {
        this.transform.setOpacity.apply( this.transform, arguments ); 
    }
    

    ButtonBase.prototype.getSize = function () {
        return this.surface.getSize(); 
    };

    module.exports = ButtonBase;
});
