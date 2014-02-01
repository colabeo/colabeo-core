define(function(require, exports, module) {
    var Surface = require('./Surface');

    /**
     * @class Surface
     *
     * @description A famous surface designed to contain WebGL
     *   
     * @name WebGLSurface
     * @extends Surface
     * @constructor
     */
    function WebGLSurface(options) {        
        this.glOptions = options.glOptions; 
        this._canvas = document.createElement('canvas');
        Surface.call(this, options);
        this.setContent(this._canvas);
        this.setSize(options.size); 
    }

    WebGLSurface.prototype = Object.create(Surface.prototype);

    /**
     * Returns the canvas element's WebGL context
     *
     * @name WebGLSurface#getContext
     * @function
     */
    WebGLSurface.prototype.getContext = function() {
        return (this._canvas.getContext('webgl', this.glOptions) || this._canvas.getContext('experimental-webgl', this.glOptions)); 
    };

    WebGLSurface.prototype.setSize = function(size) {        
        Surface.prototype.setSize.apply(this, arguments);        
        this._canvas.style.width = size[0] + "px";
        this._canvas.style.height = size[1] + "px";
        var ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;        
        this._canvas.width = size[0] * ratio; 
        this._canvas.height = size[1] * ratio; 
    };

    module.exports = WebGLSurface;
});

