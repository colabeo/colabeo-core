define(function(require, exports, module) { 
    var Counter = require('./Counter');
    var ColorPalettes = require('famous-color/ColorPalettes');
    
    /*
     * @constructor
     */
    function ColoredCounter () {
        Counter.apply(this, arguments);
    }

    ColoredCounter.prototype = Object.create( Counter.prototype );
    ColoredCounter.prototype.constructor = ColoredCounter;

    ColoredCounter.DEFAULT_OPTIONS = Counter.DEFAULT_OPTIONS;
    ColoredCounter.DEFAULT_OPTIONS.colorPalette = ColorPalettes.getRandomPalette();

    ColoredCounter.prototype._setToValue = function ( surface ) {
        var color = this.options.colorPalette.getColor(
            this.value % this.options.colorPalette.colors.length
        );
        surface.setProperties({
            color: color.hex
            });
        surface.setContent( this.value + '' );
        
    }

    module.exports = ColoredCounter;
});
