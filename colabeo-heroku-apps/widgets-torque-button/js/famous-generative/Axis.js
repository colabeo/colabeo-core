define(function(require, exports, module) {	
    var FamousSurface = require('famous/Surface');    
    var FM = require('famous/Matrix');
 	var Box = require('./Box'); 

    /** @constructor */
    function Axis()
    {   
		this.radius = 256;
        this.box = new Box(this.radius, this.radius, this.radius); 
        
        this.xyPlane = new FamousSurface({size:[this.radius, this.radius]}); 
        this.xyPlane.addClass('plane-xy'); 
        this.xyTransform = FM.rotateX(Math.PI/2.0); 

        this.zxPlane = new FamousSurface({size:[this.radius, this.radius]}); 
        this.zxPlane.addClass('plane-zx'); 
        this.zxTransform = FM.rotateY(Math.PI/2.0); 

        this.yzPlane = new FamousSurface({size:[this.radius, this.radius]}); 
        this.yzPlane.addClass('plane-yz'); 
        this.yzTransform = FM.rotateZ(Math.PI/2.0); 

        this.transform = FM.identity; 
        this.opacity = 1.0;    

        this.results = []; 

		this.results.push({
            transform: this.transform, 
            opacity: this.opacity, 
            target: this.box.render()
        }); 

        this.results.push({
            transform: this.xyTransform, 
            opacity: this.opacity, 
            target: this.xyPlane.render()
        }); 

        this.results.push({
            transform: this.zxTransform, 
            opacity: this.opacity, 
            target: this.zxPlane.render()
        }); 

        this.results.push({
            transform: this.yzTransform, 
            opacity: this.opacity, 
            target: this.yzPlane.render()
        });                            
    }

    Axis.prototype.render = function() 
    {         
        return this.results;
    };

    module.exports = Axis;
});