define(function(require, exports, module) {        
    var FamousEngine = require('famous/Engine'); 
    var FamousSurface = require('famous/Surface');     
    var FamousWebGLSurface = require('famous/WebGLSurface'); 

    var FM = require('famous/Matrix');      
    var Utils = require('famous-utils/Utils'); 
    var Scene = require('./Scene'); 

    function GLScene(args)
    {                        
        Scene.apply(this, arguments);
        this.gl = null;
        this.glReady = false;         
        this.glSurface = new FamousWebGLSurface([this.width, this.height], { antialias: true });                 
    }        
    
    GLScene.prototype = Object.create(Scene.prototype);
    GLScene.prototype.constructor = GLScene;
    
    GLScene.prototype.bindEvents = function()
    {
        this.callbacks['prerender'] = this.__update.bind(this); 
        this.callbacks['touchstart'] = this.touchstart.bind(this); 
        this.callbacks['touchmove'] = this.touchmove.bind(this); 
        this.callbacks['touchend'] = this.touchend.bind(this); 
        this.callbacks['keypress'] = this.keypress.bind(this); 
        this.callbacks['resize'] = this._resize.bind(this); 
        this.callbacks['mousedown'] = this._mousedown.bind(this); 
        this.callbacks['mousemove'] = this._mousemove.bind(this); 
        this.callbacks['mouseover'] = this._mouseover.bind(this); 
        this.callbacks['mouseup'] = this._mouseup.bind(this); 
        this.callbacks['mouseout'] = this._mouseout.bind(this); 
        this.callbacks['keydown'] = this.keydown.bind(this);         
        this.callbacks['keyup'] = this.keyup.bind(this);  

        var keys = Object.keys(this.callbacks); 

        for(var i = 0; i < keys.length; i++)
        {
            FamousEngine.on(keys[i], this.callbacks[keys[i]]);                     
        }
    };

    GLScene.prototype.setup = function(gl)
    {

    };

    GLScene.prototype.__update = function()
    {        
        if(this.initGL())
        {        
            FamousEngine.unbind('prerender', this.callbacks['prerender']);
            this.callbacks['prerender'] = this._update.bind(this);          
            FamousEngine.on('prerender', this.callbacks['prerender']);         
        }
    };

    GLScene.prototype._update = function()
    {             
        this.update(this.gl); 
        this.draw(this.gl); 
    };

    GLScene.prototype.update = function(gl)
    {

    };

    GLScene.prototype.draw = function(gl)
    {

    };

    GLScene.prototype.render = function()
    {
        return {                
            transform: FM.identity,             
            opacity: 1.0, 
            target: this.glSurface.render()
        }
    };

    GLScene.prototype._resize = function(event)
    {
        var ratio = Utils.getDevicePixelRatio(); 
        this.width = Utils.getWidth(); 
        this.height = Utils.getHeight();     
        this.glSurface.setSize([this.width, this.height]);         
        this.gl.viewportWidth = this.width * ratio; 
        this.gl.viewportHeight = this.height * ratio;         
        this.resize(event);         
    };

    GLScene.prototype.initGL = function()
    {
        var gl = this.glSurface.getContext({antialias:true});
        
        if(gl != null)
        {
            this.gl = gl;
            var ratio = Utils.getDevicePixelRatio();             
            this.gl.viewportWidth = this.width * ratio;
            this.gl.viewportHeight = this.height * ratio;                        
            this.glReady = true;             
            this.setup(this.gl);         
        }           
        return this.glReady; 
    };

    GLScene.prototype.createShaderProgram = function(vertex, fragment)
    {        
        var gl = this.gl;         
        var vertexShader = this.initVertShader(vertex);
        var fragmentShader = this.initFragShader(fragment);

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        return shaderProgram; 
    };

    GLScene.prototype.initFragShader = function(str) 
    {    
        var gl = this.gl; 
        var shader = gl.createShader(gl.FRAGMENT_SHADER);            

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;        
    };

    GLScene.prototype.initVertShader = function(str) {
        
        var gl = this.gl; 

        var shader = gl.createShader(gl.VERTEX_SHADER);

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    };
    
    module.exports = GLScene;
});
