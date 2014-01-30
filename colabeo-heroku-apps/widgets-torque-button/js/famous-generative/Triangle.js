define(function(require, exports, module) {
    var FamousSurface = require('famous/Surface');
    var FM = require('famous/Matrix');
    var Utils = require('famous-utils/Utils'); 
    var FamousRenderNode = require('famous/RenderNode'); 
    var Quaternion = require('famous-math/Quaternion'); 
    var Vector = require('famous-math/Vector'); 
    var Line = require('./Line'); 

    /** @constructor */
    function Triangle(opts)
    {
        if(!opts) opts = {}; 
        
        this.x1 = (opts.x1 || 0); 
        this.y1 = (opts.y1 || 0); 
        this.z1 = (opts.z1 || 0);

        this.x2 = (opts.x2 || 0); 
        this.y2 = (opts.y2 || 0);
        this.z2 = (opts.z2 || 0);  

        this.x3 = (opts.x3 || 0); 
        this.y3 = (opts.y3 || 0); 
        this.z3 = (opts.z3 || 0);        
        
        this.mtx = FM.identity; 
        this.result = [];                     

        this.red = (typeof opts.red === 'undefined') ? 255 : opts.red;
        this.green = (typeof opts.green === 'undefined') ? 255 : opts.green; 
        this.blue = (typeof opts.blue === 'undefined') ? 255 : opts.blue;
        this.opacity = (typeof opts.opacity === 'undefined') ? 1.0 : opts.opacity;

        this.size = 1000.0; 
        this.halfSize = this.size*.5; 
        this.invSize = 1.0/this.size;         
        this.halfPi = Math.PI*.5; 
        this.surface = new FamousSurface({size:[this.size,this.size]}); 
        this.surface.addClass('Triangle');         
        this.surface.setProperties({
            'background-color': 'rgba(0, 0, 0, 0.0)',
            'border-radius': '0px',
            'border-top': '0px solid',
            'border-right': this.size*.5+'px solid transparent',
            'border-left': this.size*.5+'px solid transparent',
            'border-bottom': this.size+'px solid rgba('+this.red+', '+this.green+', '+this.blue+', 1.0)'
        });                                 
        this.calculateTransform();          
    }

    Triangle.prototype.setProperties = function(properties)
    {
        this.surface.setProperties(properties); 
    }
        
    Triangle.prototype.setColor = function(red, green, blue, opacity)
    {
        this.red = Math.abs(Math.floor(red)); 
        this.green = Math.abs(Math.floor(green)); 
        this.blue = Math.abs(Math.floor(blue));         
        this.opacity = opacity; 
        this.surface.setProperties({
            'border-bottom': this.size+'px solid rgba('+this.red+', '+this.green+', '+this.blue+', 1.0)'
        });                                         
        return this; 
    }

    Triangle.prototype.setOpacity = function(opacity)
    {
        this.opacity = opacity; 
        return this; 
    }

    Triangle.prototype.render = function()
    {
        var result = {                                        
                transform: this.mtx,                 
                opacity: this.opacity, 
                origin: [.5, .5],
                target: this.surface.render()
            };
            
        return result; 
    }

    Triangle.prototype.setP1 = function(x1, y1, z1)
    {
        this.set(x1, y1, z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3); 
    }

    Triangle.prototype.setP2 = function(x2, y2, z2)
    {
        this.set(this.x1, this.y1, this.z1, x2, y2, z2, this.x3, this.y3, this.z3);  
    }

    Triangle.prototype.setP3 = function(x3, y3, z3)
    {
        this.set(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, x3, y3, z3); 
    }

    Triangle.prototype.set = function(x1, y1, z1, x2, y2, z2, x3, y3, z3)
    {
        this.x1 = x1; 
        this.y1 = y1; 
        this.z1 = z1;

        this.x2 = x2; 
        this.y2 = y2;
        this.z2 = z2;  

        this.x3 = x3; 
        this.y3 = y3; 
        this.z3 = z3;        

        this.calculateTransform(); 
    }
    
    Triangle.prototype.getP1 = function()
    {
        return [this.x1, this.y1, this.z1];
    }

    Triangle.prototype.getP2 = function()
    {
        return [this.x2, this.y2, this.z2];            
    }

    Triangle.prototype.getP3 = function()
    {
        return [this.x3, this.y3, this.z3];
    }
    
    Triangle.prototype.getLength = function()
    {
        return this.length; 
    }

    Triangle.prototype.calculateTransform = function()
    {                
        var p1x = 0.0; 
        var p1y = 0.0; 
        var p1z = 0.0; 

        var p2x = 0.0; 
        var p2y = 0.0; 
        var p2z = 0.0; 

        var p3x = 0.0; 
        var p3y = 0.0; 
        var p3z = 0.0; 

        var p1p2 = Utils.distance3D(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2); 
        var p1p3 = Utils.distance3D(this.x1, this.y1, this.z1, this.x3, this.y3, this.z3); 
        var p2p3 = Utils.distance3D(this.x2, this.y2, this.z2, this.x3, this.y3, this.z3); 

        var b = 0.0; 

        if(p1p2 > p1p3)            
        {
            if(p1p2 > p2p3)
            {            
                if(this.y1 < this.y2)
                {
                    p1x = this.x1; p1y = this.y1; p1z = this.z1;                 
                    p2x = this.x2; p2y = this.y2; p2z = this.z2;                 
                }
                else
                {
                    p1x = this.x2; p1y = this.y2; p1z = this.z2;                 
                    p2x = this.x1; p2y = this.y1; p2z = this.z1; 
                }

                p3x = this.x3; p3y = this.y3; p3z = this.z3; 
                b = p1p2;                 
            }
            else
            {                
                if(this.y2 < this.y3)
                {
                    p1x = this.x2; p1y = this.y2; p1z = this.z2;                 
                    p2x = this.x3; p2y = this.y3; p2z = this.z3; 
                }
                else
                {
                    p1x = this.x3; p1y = this.y3; p1z = this.z3;                 
                    p2x = this.x2; p2y = this.y2; p2z = this.z2; 
                }

                p3x = this.x1; p3y = this.y1; p3z = this.z1; 
                b = p2p3; 
            }
        }
        else 
        {
            if(p1p3 >  p2p3)
            {
                if(this.y1 < this.y3)
                {
                    p1x = this.x1; p1y = this.y1; p1z = this.z1;                 
                    p2x = this.x3; p2y = this.y3; p2z = this.z3;                
                }
                else
                {
                    p1x = this.x3; p1y = this.y3; p1z = this.z3;                 
                    p2x = this.x1; p2y = this.y1; p2z = this.z1;            
                }

                p3x = this.x2; p3y = this.y2; p3z = this.z2;
                b = p1p3; 
            }
            else
            {
                if(this.y2 < this.y3)
                {
                    p1x = this.x2; p1y = this.y2; p1z = this.z2;                 
                    p2x = this.x3; p2y = this.y3; p2z = this.z3;
                }
                else
                {
                    p1x = this.x3; p1y = this.y3; p1z = this.z3;                 
                    p2x = this.x2; p2y = this.y2; p2z = this.z2;                    
                }

                p3x = this.x1; p3y = this.y1; p3z = this.z1;
                b = p2p3; 
            }
        }

        if(p1x <= p2x)
        {            
            var tX = p1x; 
            var tY = p1y; 
            var tZ = p1z; 

            p1x = p2x;
            p1y = p2y;
            p1z = p2z;

            p2x = tX; 
            p2y = tY; 
            p2z = tZ;         
        }
 
        var hInvert = 1.0; 
        var wInvert = 1.0; 
        var angleZ = Math.atan((p2y - p1y)/(p2x - p1x));        
                
        var s = ( p1p2 + p1p3 + p2p3 ) * 0.5; 
        var a = Math.sqrt( s * (s-p1p2) * (s-p1p3) * (s-p2p3) ); 
        var h = ( 2.0 * a ) / b;

        var theta1 = Math.asin( h / Utils.distance3D(p1x,p1y,p1z,p3x,p3y,p3z) ); 
        var theta2 = Math.asin( h / Utils.distance3D(p2x,p2y,p2z,p3x,p3y,p3z) );        
        
        var l = ( h / Math.tan(theta2) ) / b;         
        var r = ( h / Math.tan(theta1) ) / b;

        var v21 = new Vector(p2x-p1x, p2y - p1y, p2z-p1z); 
        var v23 = new Vector(p2x-p3x, p2y - p3y, p2z-p3z); 
        var cross = new Vector(); 
        v21.cross(v23, cross); 
        
        if(cross.z > 0)
        {              
            hInvert = -1.0;                             
        }
        
        if(p1x == p2x)
        {
            hInvert *= -1.0;             
            var temp = r; 
            r = l; 
            l = temp; 
        }
        
        var height = this.invSize*h; 
        var width = this.invSize*b; 
    
        rot = FM.multiply(FM.identity, FM.rotateZ(angleZ));                             

        this.surface.setProperties({            
            'border-radius': '0px',
            'border-right': this.size*r+'px solid transparent',
            'border-left': this.size*l+'px solid transparent',            
            'border-bottom': this.size+'px solid rgba('+this.red+', '+this.green+', '+this.blue+', 1.0)'
        });   
                         
        var cX = (p1x+p2x+p3x)/3.0; 
        var cY = (p1y+p2y+p3y)/3.0; 
        var cZ = (p1z+p2z+p3z)/3.0; 

        var xOff = (p1x+p2x)*.5 - hInvert*h*.5*Math.sin(-angleZ); 
        var yOff = (p1y+p2y)*.5 - hInvert*h*.5*Math.cos(Math.abs(angleZ)); 
                
        this.mtx = FM.multiply(FM.identity, FM.scale(width*wInvert, height*hInvert, 1.0), rot, FM.move(FM.identity, [xOff,yOff,0]));                 
    }

    module.exports = Triangle;
});
