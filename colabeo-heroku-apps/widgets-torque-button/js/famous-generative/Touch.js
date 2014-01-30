define(function(require, exports, module) {
    var FamousSurface = require('famous/Surface');
    var FM = require('famous/Matrix');    
    var Vector = require('famous-math/Vector');
    var Integrator = require('./Integrator');     
    var Utils = require('famous-utils/Utils'); 
    /**
     * @constructor
     */
    function Touch(parent)
    {
        this.identifier = -1;      
        this.modAmp = 0.05; 
        this.modSpeed = 0.20; 
        this.angle = 0.0; 
        this.alive = false; 
        this.radius = 64.0; 
        this.surface = new FamousSurface({size:[this.radius*2.0, this.radius*2.0]}); 
        this.surface.addClass('touch'); 
        this.pos = new Vector(); 
        this.mtx = FM.identity;         
        this.opacity = 0.0;      
        this.damping = 0.3; 
        this.velLimit = 0.25; 
        this.accLimit = 0.10;    
        this.integrator = new Integrator(0.0, 0.0, this.damping, this.velLimit, this.accLimit);  
        this.modulator =  new Integrator(0.0, 0.0);  
        this.scale = 0.0; 

        this.surfaceBack = new FamousSurface({size:[this.radius*2.0, this.radius*2.0]});         
        this.surfaceBack.addClass('touch-back');         
        this.mtxBack = FM.identity;          
        this.opacityBack = 0.0; 
        this.backAlpha = 4.0; 
        this.backIntegrator = new Integrator(0.0, 0.0, .75, .25, .025); 
    }

    Touch.prototype.setIdentifier = function(id)
    {
        this.identifier = id; 
    }

    Touch.prototype.setRadius = function(r)
    {
        this.radius = r; 
        this.surface.setSize([this.radius*2.0, this.radius*2.0]); 
        this.surfaceBack.setSize([this.radius*2.0, this.radius*2.0]); 
    }

    Touch.prototype.isAlive = function()
    {
        if(this.alive || this.integrator.getValue() > 0.0000001)
        {
            return true; 
        }
        return false; 
    }

    Touch.prototype.update = function()
    {                 
        if(this.alive) 
        {
            this.angle += this.modSpeed*this.modulator.update(); 
            this.integrator.addForce(this.modAmp*Math.sin(this.angle));             
        }

        this.opacity = this.integrator.update();         
        this.scale = this.integrator.getValue(); 
        this.mtx = FM.multiply(FM.scale(this.scale, this.scale, 1.0), FM.move(FM.identity, this.pos.toArray()));                     
        var x = Utils.clamp(this.backIntegrator.update(), 0.0, 1.0);             
        this.opacityBack = -this.backAlpha*x*x + this.backAlpha*x; 
        this.mtxBack = FM.multiply(FM.scale(this.angle*.5, this.angle*.5, 1.0), FM.move(FM.identity, this.pos.toArray()));                                                
    }

    Touch.prototype.render = function()
    {
        return {
                    transform: this.mtx,  
                    origin: [.5, .5], 
                    opacity: this.opacity,                
                    target: this.surface.render()
                }; 
    }    

    Touch.prototype.renderBack = function()
    {
        return {
                    transform: this.mtxBack, 
                    origin: [.5, .5],                     
                    opacity: this.opacityBack,                     
                    target: this.surfaceBack.render()
                }; 
    }    

    Touch.prototype.touchstart = function(x, y)
    {
        this.angle = 0.0; 
        this.freed = false;         
        this.alive = true; 
        this.integrator.setTarget(1.0);       
        this.integrator.setPhysics(this.damping, this.velLimit, this.accLimit); 
        this.backIntegrator.setTarget(1.0);       
        this.modulator.setTarget(1.0);    
        x = x - Utils.getWidth()*.5 + this.radius;        
        y = y - Utils.getHeight()*.5 + this.radius;        
        this.pos.setXYZ(x-this.radius, y-this.radius, 0);                         
    }

    Touch.prototype.touchmove = function(x, y)
    {
        x = x - Utils.getWidth()*.5 + this.radius;        
        y = y - Utils.getHeight()*.5 + this.radius;       
        this.pos.setXYZ(x-this.radius, y-this.radius, 0);
    }

    Touch.prototype.touchend = function()
    {
        this.alive = false; 
        this.integrator.setTarget(0.0);        
        this.integrator.setPhysics(.10, .25, .0125); 
        this.modulator.setTargetAndHome(0.0);            
        this.backIntegrator.setTargetAndHome(0.0); 
    }

    module.exports = Touch;
});