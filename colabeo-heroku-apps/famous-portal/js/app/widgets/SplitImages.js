define(function(require, exports, module) { 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
 	var Surface = require('famous/Surface'); 
 	var ImageSurface = require('famous/ImageSurface'); 
    var Modifier = require('famous/Modifier');
    var Easing = require('famous-animation/Easing');

    function SplitImages () {
        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );
        this.modifiers = [];
        _initImages.call( this );
    }

    SplitImages.prototype = Object.create( View.prototype );
    SplitImages.prototype.constructor = SplitImages;

    SplitImages.DEFAULT_OPTIONS = { 
        images: [],
        size: [ 400, 400 ],
        depth: 50,
        classes: ['backface-visible', 'no-user-select']
    }

    function _initImages () {
        for (var i = 0; i < this.options.images.length; i++) {
            this.addImage( this.options.images[i] ) ;
        };
        this.setDepth( this.options.depth );
    }

    SplitImages.prototype.setDepth = function ( arg ) {
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

    SplitImages.prototype.getMaxDepth = function  () {
        return this._maxDepth; 
    }

    SplitImages.prototype.addImage = function ( src ) {
        var len = this.modifiers.length;
        var img = new Surface({
            content: '<img class="no-user-select", width="' + this.options.size[0] + '" draggable="false" src="' + src + '"></img>',
            size: this.options.size,
            classes: this.options.classes 
        });

        var modifier = new Modifier({ 
            transform: FM.translate( 0, 0, len * this.options.depth ) 
        });

        img.pipe( this );

        this.modifiers.push( modifier);
        this.node.add( modifier ).link( img );
    }
    

    module.exports = SplitImages;
});
