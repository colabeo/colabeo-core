define(function(require, exports, module) { 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
 	var Surface = require('famous/Surface'); 
 	var ImageSurface = require('famous/ImageSurface'); 
    var Modifier = require('famous/Modifier');
    var Easing = require('famous-animation/Easing');

    function SplitRenderable () {
        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );

        this.modifiers = [];
        _initImages.call( this );
    }

    SplitRenderable.prototype = Object.create( View.prototype );
    SplitRenderable.prototype.constructor = SplitRenderable;

    SplitRenderable.DEFAULT_OPTIONS = { 
        content: [],
        size: [ 400, 400 ],
        depth: 50
    }

    function _initImages () {
        for (var i = 0; i < this.options.images.length; i++) {
            this.addContent( this.options.content[i] ) ;
        };
        this.setDepth( this.options.depth );
    }

    SplitRenderable.prototype.setDepth = function ( arg ) {
        for (var i = 0; i < this.modifiers.length; i++) {
            this.modifiers[i].halt();
            this.modifiers[i].setTransform( 
                FM.translate( 0, 0, arg * i ),
                { curve: Easing.outCubicNorm, duration: 400 });

            if( i == this.modifiers.length - 1 ) { 
                this._maxDepth = arg * i;
            }

        };
    }

    SplitRenderable.prototype.getSize = function  () {
        return this.options.size;    
    }

    SplitRenderable.prototype.getMaxDepth = function  () {
        return this._maxDepth; 
    }

    SplitRenderable.prototype.addContent = function ( obj ) {
        var len = this.modifiers.length;
        var modifier = new Modifier({ 
            transform: FM.translate( 0, 0, len * this.options.depth ) 
        });

        obj.pipe( this );

        this.modifiers.push( modifier);
        this.node.add( modifier ).link( obj );
    }
    

    module.exports = SplitRenderable;
});

