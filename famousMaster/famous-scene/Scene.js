define(function(require, exports, module) {    
    var Utils = require('famous-utils/Utils'); 
    var KeyCodes = require('famous-utils/KeyCodes');     
    var FEH = require('famous/EventHandler');
    var View = require('famous/View');

    function Scene()
    {                       
        View.apply(this, arguments);
        this.width = Utils.getWidth(); 
        this.height = Utils.getHeight();      
        this.mouseDown = false;                
        this.callbacks = {};         
        this.bindEvents();                   
    }    

    Scene.prototype = Object.create( View.prototype );
    Scene.prototype.constructor = Scene;

    Scene.prototype.bindEvents = function()
    {
        this.callbacks['prerender'] = this.update.bind(this); 
        this.callbacks['touchstart'] = this.touchstart.bind(this); 
        this.callbacks['touchmove'] = this.touchmove.bind(this); 
        this.callbacks['touchend'] = this.touchend.bind(this); 
        this.callbacks['keypress'] = this.keypress.bind(this); 
        this.callbacks['resize'] = Utils.debounce(this.resize.bind(this), 333); 
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

    Scene.prototype.unbindEvents = function()
    {
        var keys = Object.keys(this.callbacks); 

        for(var i = 0; i < keys.length; i++)
        {
            this.eventInput.unbind(keys[i], this.callbacks[keys[i]]);                     
        }
    };

    Scene.prototype.activate = function( callback )
    {
       if(callback) callback(); 
    };

    Scene.prototype.update = function()
    {    
        
    };

    Scene.prototype.render = function()
    {        
        return this.node.render();        
    };

    Scene.prototype.deactivate = function( callback )
    {
       if(callback) callback(); 
    };

    Scene.prototype.touchstart = function(event)
    {
        
    };

    Scene.prototype.touchmove = function(event)
    {
        
    };

    Scene.prototype.touchend = function(event)
    {
        
    };   
    
    Scene.prototype._mousedown = function(event)
    {
        this.mouseDown = true;         
        this.mousedown(event);         
    };   

    Scene.prototype._mousemove = function(event)
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

    Scene.prototype._mouseover = function(event)
    {
        this.mouseover(event); 
    };

    Scene.prototype._mouseup = function(event)
    {
        this.mouseDown = false;        
        this.mouseup(event);          
    };    

    Scene.prototype._mouseout = function(event)
    {
        this.mouseout(event); 
    };

    Scene.prototype.mousedown = function(event)
    {

    };

    Scene.prototype.mouseup = function(event)
    {

    };

    Scene.prototype.mousemove = function(event)
    {
        
    };

    Scene.prototype.mouseover = function(event)
    {

    };

    Scene.prototype.mouseout = function(event)
    {

    };

    Scene.prototype.mousedrag = function(event)
    {

    };

    Scene.prototype.keypress = function(event)
    {             

    };

    Scene.prototype.keydown = function(event)
    {             

    };

    Scene.prototype.keyup = function(event)
    {             

    };

    Scene.prototype.keypress = function(event)
    {             

    };

    Scene.prototype.resize = function(event) 
    {
        this.width = Utils.getWidth(); 
        this.height = Utils.getHeight(); 
    };

    Scene.prototype.setController = function ( controller ) 
    {
        this.controller = controller; 
    };
    
    module.exports = Scene;
});
