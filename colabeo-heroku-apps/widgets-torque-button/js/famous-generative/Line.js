define(function(require, exports, module) {
    var FamousSurface = require('famous/Surface');
    var FM = require('famous/Matrix');
    var Utils = require('famous-utils/Utils'); 
    var FamousRenderNode = require('famous/RenderNode'); 
    var Quaternion = require('famous-math/Quaternion'); 
    var Vector = require('famous-math/Vector'); 

    /** @constructor */
    function Line(opts)
    {
        if(!opts) opts = {};         
        this.result = [];             
        this.width = opts.width || 2.0; 
        this.opacity = opts.opacity || 1.0;         
        this.calculateTransform(
            (typeof opts.x1 === 'undefined') ? 0 : opts.x1,
            (typeof opts.y1 === 'undefined') ? 0 : opts.y1, 
            (typeof opts.z1 === 'undefined') ? 0 : opts.z1, 
            (typeof opts.x2 === 'undefined') ? 0 : opts.x2, 
            (typeof opts.y2 === 'undefined') ? 0 : opts.y2, 
            (typeof opts.z2 === 'undefined') ? 0 : opts.z2);             
        this.halfPi = Math.PI*.5; 
        this.surface = new FamousSurface({size:[500.0,500.0]}); 
        this.surface.addClass('line');        
        this.surface.setProperties({'background-color': 'rgba(255, 255, 255, 1.0)'});
    }

    Line.prototype.setProperties = function(properties)
    {
        this.surface.setProperties(properties); 
    }
    
    Line.prototype.setLineWidth = function(width)
    {
        this.width = width; 
        return this; 
    }

    Line.prototype.getLineWidth = function()
    {
        return this.width;         
    } 

    Line.prototype.setColor = function(red, green, blue, opacity)
    {
        this.surface.setProperties(Utils.backgroundColor(red, green, blue, 1.0));
        this.opacity = opacity; 
        return this; 
    }

    Line.prototype.setOpacity = function(opacity)
    {
        this.opacity = opacity; 
        return this; 
    }

    Line.prototype.render = function()
    {
        var result = {
                transform: this.transform, 
                opacity: this.opacity, 
                origin: [.5, .5],
                target: this.surface.render()
            };

        return result; 
    }

    Line.prototype.setP1 = function(x1, y1, z1)
    {
        this.calculateTransform(x1, y1, z1, this.x2, this.y2, this.z2); 
    }

    Line.prototype.setP2 = function(x2, y2, z2)
    {
        this.calculateTransform(this.x1, this.y1, this.z1, x2, y2, z2); 
    }

    Line.prototype.set = function(x1, y1, z1, x2, y2, z2)
    {
        this.calculateTransform(x1, y1, z1, x2, y2, z2); 
    }

    Line.prototype.setX1 = function(x1)
    {
        this.calculateTransform(x1, this.y1, this.z1, this.x2, this.y2, this.z2);             
    }

    Line.prototype.setY1 = function(y1)
    {
        this.calculateTransform(this.x1, y1, this.z1, this.x2, this.y2, this.z2);             
    }

    Line.prototype.setZ1 = function(z1)
    {
        this.calculateTransform(this.x1, this.y1, z1, this.x2, this.y2, this.z2);             
    }

    Line.prototype.setX2 = function(x2)
    {
        this.calculateTransform(this.x1, this.y1, this.z1, x2, this.y2, this.z2);             
    }

    Line.prototype.setY2 = function(y2)
    {
        this.calculateTransform(this.x1, this.y1, this.z1, this.x2, y2, this.z2);             
    }

    Line.prototype.setZ2 = function(z2)
    {
        this.calculateTransform(this.x1, this.y1, this.z1, this.x2, this.y2, z2);             
    }

    Line.prototype.setX = function(x1, x2)
    {
        this.calculateTransform(x1, this.y1, this.z1, x2, this.y2, this.z2);             
    }

    Line.prototype.setY = function(y1, y2)
    {
        this.calculateTransform(this.x1, y1, this.z1, this.x2, y2, this.z2);             
    }

    Line.prototype.setZ = function(z1, z2)
    {
        this.calculateTransform(this.x1, this.y1, z1, this.x2, this.y2, z2);             
    }

    Line.prototype.getX1 = function()
    {
        return this.x1;         
    }
    
    Line.prototype.getX2 = function()
    {
        return this.x2;         
    }

    Line.prototype.getY1 = function()
    {
        return this.y1;         
    }

    Line.prototype.getY2 = function()
    {
        return this.y2;         
    }

    Line.prototype.getZ1 = function()
    {
        return this.z1;         
    }

    Line.prototype.getZ2 = function()
    {
        return this.z2;         
    }

    Line.prototype.getX = function()
    {
        return [this.x1, this.x2]; 
    }    

    Line.prototype.getY = function()
    {
        return [this.y1, this.y2];         
    }

    Line.prototype.getZ = function()
    {
        return [this.z1, this.z2];         
    }

    Line.prototype.getP1 = function()
    {
        return [this.x1, this.y1, this.z1];
    }

    Line.prototype.getP2 = function()
    {
        return [this.x2, this.y2, this.z2];            
    }
    
    Line.prototype.getLength = function()
    {
        return this.length; 
    }

    Line.prototype.calculateTransform = function(x1, y1, z1, x2, y2, z2)
    {
        this.x1 = x1; 
        this.y1 = y1; 
        this.z1 = z1;

        this.x2 = x2; 
        this.y2 = y2;
        this.z2 = z2;  

        this.length = Utils.distance3D(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2);         

        this.lengthX = this.x2 - this.x1;       //A
        this.lengthY = this.y2 - this.y1;       //O
        this.lengthZ = this.z2 - this.z1;       //H

        this.centerX = (this.lengthX) * 0.5 + this.x1; 
        this.centerY = (this.lengthY) * 0.5 + this.y1; 
        this.centerZ = (this.lengthZ) * 0.5 + this.z1; 
        
        this.angleZ = Math.atan2(this.lengthY,this.lengthX); 
        this.angleY = Math.asin(this.lengthZ/this.length); 

        if(isNaN(this.angleZ))            
        {            
            this.angleZ = Math.PI*.5;             
        }

        if(isNaN(this.angleY))            
        {            
            this.angleY = Math.PI*.5;              
        }

        // var quat = new Quaternion(); 
        // quat.makeFromAngleAndAxis(3.14, new Vector(this.lengthX, this.lengthY, this.lengthZ)); 


        this.transform = FM.multiply(FM.identity, FM.rotateY(-this.angleY)); 
        this.transform = FM.multiply(this.transform, FM.rotateZ(this.angleZ));       
        this.transform = FM.multiply(this.transform, FM.translate(this.centerX, this.centerY, this.centerZ));         
        this.transform = FM.multiply(FM.scale(this.length/500.0, this.width/500.0, 1.0), this.transform);         
    }

    module.exports = Line;
});
