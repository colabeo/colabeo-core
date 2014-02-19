define(function(require, exports, module) {        
    var Utils = require('famous-utils/Utils');     
    var View = require('famous/View');
    var FamousWebGLSurface = require('famous/WebGLSurface'); 
    var FamousSurface = require('famous/Surface'); 
    var Modifier = require('famous/Modifier'); 

    function GLScene(args)
    {                        
        View.apply(this, arguments);
        this.width = Utils.getWidth(); 
        this.height = Utils.getHeight();      
        this.mouseDown = false;                
        this.callbacks = {};         

        this.gl = null;
        this.glReady = false;         
        this.contextInitAttempts = 0; 
        this.glSurface = new FamousWebGLSurface({
            size: [this.width, this.height], 
            glOptions: { antialias: true }
        });                
        
        this.node.add(this.glSurface);  
        this.bindEvents();                   
    }        
    
    GLScene.prototype = Object.create( View.prototype );
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
            this.eventInput.on(keys[i], this.callbacks[keys[i]]);                     
        }
    };

    GLScene.prototype.unbindEvents = function()
    {        
        var keys = Object.keys(this.callbacks); 

        for(var i = 0; i < keys.length; i++)
        {
            this.eventInput.unbind(keys[i], this.callbacks[keys[i]]);                          
        }
    };

    GLScene.prototype.unbindEvent = function(key)
    {                
        if(this.callbacks[key] !== undefined)
        {
           this.eventInput.unbind(key, this.callbacks[key]);                          
        }
    }; 

    GLScene.prototype.setup = function(gl)
    {

    };

    GLScene.prototype.__update = function()
    {        
        if(this.initGL())
        {        
            this.eventInput.unbind('prerender', this.callbacks['prerender']);
            this.callbacks['prerender'] = this._update.bind(this);          
            this.eventInput.on('prerender', this.callbacks['prerender']);         
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

    GLScene.prototype._resize = function(event)
    {
        var ratio = Utils.getDevicePixelRatio(); 
        this.width = Utils.getWidth(); 
        this.height = Utils.getHeight();             
        this.glSurface.setSize([this.width, this.height]);         
        if(this.gl)
        {
            this.gl.viewportWidth = this.width * ratio; 
            this.gl.viewportHeight = this.height * ratio;                                     
            this.resize(event);    
        }
        else
        {
            this.errorSurfaceSize = [this.width, this.height]; 
            this.errorSurface.setSize(this.errorSurfaceSize);     
            this.errorSurface.setProperties({
                'line-height' : this.errorSurfaceSize[1]+'px',  
                'font-size' :  this.errorSurfaceSize[0]*.05+'px',
                'width': this.errorSurfaceSize[0]+'px'
            }); 
        }        
    };

    GLScene.prototype.initGL = function()
    {
        var gl = this.glSurface.getContext({antialias:true});
        this.contextInitAttempts++;         
        if(gl != null && Utils.supportsWebGL())
        {
            this.gl = gl;
            var ratio = Utils.getDevicePixelRatio();             
            this.gl.viewportWidth = this.width * ratio;
            this.gl.viewportHeight = this.height * ratio;                        
            this.glReady = true;             
            this.setup(this.gl);         
        }           
        else if(this.contextInitAttempts > 3)
        {
            this.eventInput.unbind('prerender', this.callbacks['prerender']);                                    

            this.errorSurfaceSize = [this.width, this.height]; 
            this.errorSurface = new FamousSurface({
                size: this.errorSurfaceSize,
                content: 'A WebGL enabled browser is required',                
                properties:{
                    'background-color': 'rgba(0, 0, 0, 1.0)',
                    'color': 'white',
                    'text-align': 'center',
                    'vertical-align': 'center',
                    'line-height' : this.errorSurfaceSize[1]+'px',  
                    'font-size' :  this.errorSurfaceSize[0]*.05+'px',
                    'border-radius': '0px 0px 0px 0px',
                    'font-family': 'Avenir Next W10 Thin', 
                    'width': this.errorSurfaceSize[0]+'px'
                }
            }); 

            this.errorSurfaceModifier = new Modifier(); 
            this.node.add(this.errorSurfaceModifier).link(this.errorSurface);         
        }
        return this.glReady; 
    };

    GLScene.prototype.activate = function( callback )
    {
       if(callback) callback(); 
    };

    GLScene.prototype.update = function()
    {    
        
    };

    GLScene.prototype.render = function()
    {        
        return this.node.render();        
    };

    GLScene.prototype.deactivate = function( callback )
    {
       if(callback) callback(); 
    };

    GLScene.prototype.touchstart = function(event)
    {
        
    };

    GLScene.prototype.touchmove = function(event)
    {
        
    };

    GLScene.prototype.touchend = function(event)
    {
        
    };   
    
    GLScene.prototype._mousedown = function(event)
    {
        this.mouseDown = true;         
        this.mousedown(event);         
    };   

    GLScene.prototype._mousemove = function(event)
    {    
        if(this.mouseDown === true)
        {            
            this.mousedrag(event); 
        }
        else
        {        
            this.mousemove(event);       
        }        
    };

    GLScene.prototype._mouseover = function(event)
    {
        this.mouseover(event); 
    };

    GLScene.prototype._mouseup = function(event)
    {
        this.mouseDown = false;        
        this.mouseup(event);          
    };    

    GLScene.prototype._mouseout = function(event)
    {
        this.mouseout(event); 
    };

    GLScene.prototype.mousedown = function(event)
    {

    };

    GLScene.prototype.mouseup = function(event)
    {

    };

    GLScene.prototype.mousemove = function(event)
    {
        
    };

    GLScene.prototype.mouseover = function(event)
    {

    };

    GLScene.prototype.mouseout = function(event)
    {

    };

    GLScene.prototype.mousedrag = function(event)
    {

    };

    GLScene.prototype.keypress = function(event)
    {             

    };

    GLScene.prototype.keydown = function(event)
    {             

    };

    GLScene.prototype.keyup = function(event)
    {             

    };

    GLScene.prototype.keypress = function(event)
    {             

    };

    GLScene.prototype.resize = function(event) 
    {
        
    };

    GLScene.prototype.setController = function ( controller ) 
    {
        this.controller = controller; 
    };
    
    module.exports = GLScene;
});
