define(function(require, exports, module) { 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
 	var Surface = require('famous/Surface'); 
    var Modifier = require('famous/Modifier');
    var Easing = require('famous-animation/Easing');

    /*
     * @constructor
     */
    function EmptyClass () {
        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );
    }

    EmptyClass.prototype = Object.create( View.prototype );
    EmptyClass.prototype.constructor = EmptyClass;

    EmptyClass.DEFAULT_OPTIONS = { 

    }

    module.exports = EmptyClass;
});
