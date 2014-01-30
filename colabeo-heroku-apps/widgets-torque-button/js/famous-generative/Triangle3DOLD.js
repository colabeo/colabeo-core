define(function(require, exports, module) {
    var FamousSurface = require('famous/Surface');
    var FM = require('famous/Matrix');
    var Utils = require('famous-utils/Utils'); 
    var FamousRenderNode = require('famous/RenderNode'); 
    var Quaternion = require('famous-math/Quaternion'); 
    var Vector = require('famous-math/Vector'); 
    var Line = require('famous-generative/Line'); 

    /** @constructor */
    function Triangle3D(opts)
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
        this.surface = new FamousSurface([this.size,this.size]); 
        this.surface.addClass('Triangle3D');         
        this.surface.setProperties({
            'background-color': 'rgba(0, 0, 0, 0.0)',
            'border-radius': '0px',
            'border-top': '0px solid',
            'border-right': this.size*.5+'px solid red',
            'border-left': this.size*.5+'px solid blue',
            'border-bottom': this.size+'px solid rgba('+this.red+', '+this.green+', '+this.blue+', 1.0)'
        });                                 

        this.normal = new Line({width:4, opacity:1.0}); 
        this.line1 = new Line({width:4, opacity:1.0}); 
        this.line2 = new Line({width:4, opacity:1.0}); 
        this.line3 = new Line({width:4, opacity:1.0}); 
        this.line4 = new Line({width:4, opacity:1.0}); 
        this.line5 = new Line({width:4, opacity:1.0}); 
        this.line6 = new Line({width:4, opacity:1.0});         
        
        this.normal.setColor(255, 0, 0, 1.0); 
        this.line1.setColor(255, 255, 0, 1.0); 
        this.line2.setColor(255, 0, 255, 1.0); 
        this.line3.setColor(0, 255, 255, 1.0); 
        this.line4.setColor(255, 0, 0, 1.0); 
        this.line5.setColor(0, 0, 0, 1.0);         
        this.line5.setColor(0, 0, 0, 1.0);                 
        
        var style = 'font-size: 24px; ';    
        style+= 'line-height: '+30+'px; '; 
        style+= 'margin: 0px; '; 

        var opacity = .750;
        var size = 30; 

        this.p1Surf = new FamousSurface([size,size]); 
        this.p1Surf.setProperties(Utils.backgroundColor(255, 255, 255, 1.0));
        this.p1Surf.setProperties(Utils.borderRadius(size)); 
        this.p1Surf.setContent('<p class="triangleIndex" style="'+style+'">'+'1'+'</p>');
        this.p1Surf.mtx = FM.identity; 
        this.p1Surf.opacity = opacity;  

        this.p2Surf = new FamousSurface([size,size]); 
        this.p2Surf.setProperties(Utils.backgroundColor(255, 255, 255, 1.0));
        this.p2Surf.setProperties(Utils.borderRadius(size)); 
        this.p2Surf.setContent('<p class="triangleIndex" style="'+style+'">'+'2'+'</p>')
        this.p2Surf.mtx = FM.identity;         
        this.p2Surf.opacity = opacity; 

        this.p3Surf = new FamousSurface([size,size]); 
        this.p3Surf.setProperties(Utils.backgroundColor(255, 255, 255, 1.0));
        this.p3Surf.setProperties(Utils.borderRadius(size)); 
        this.p3Surf.setContent('<p class="triangleIndex" style="'+style+'">'+'3'+'</p>')
        this.p3Surf.mtx = FM.identity; 
        this.p3Surf.opacity = opacity;

        this.p4Surf = new FamousSurface([size,size]); 
        this.p4Surf.setProperties(Utils.backgroundColor(255, 0, 0, 1.0));
        this.p4Surf.setProperties(Utils.borderRadius(size)); 
        this.p4Surf.setContent('<p class="triangleIndex" style="'+style+'">'+'C'+'</p>')
        this.p4Surf.mtx = FM.identity; 
        this.p4Surf.opacity = opacity;
        
        this.p5Surf = new FamousSurface([size,size]); 
        this.p5Surf.setProperties(Utils.backgroundColor(0, 255, 0, 1.0));
        this.p5Surf.setProperties(Utils.borderRadius(size)); 
        this.p5Surf.setContent('<p class="triangleIndex" style="'+style+'">'+'M'+'</p>')
        this.p5Surf.mtx = FM.identity; 
        this.p5Surf.opacity = opacity;

        this.p6Surf = new FamousSurface([size,size]); 
        this.p6Surf.setProperties(Utils.backgroundColor(0, 0, 255, 1.0));
        this.p6Surf.setProperties(Utils.borderRadius(size)); 
        this.p6Surf.setContent('<p class="triangleIndex" style="'+style+'">'+'V'+'</p>')
        this.p6Surf.mtx = FM.identity; 
        this.p6Surf.opacity = opacity;
    
        this.calculateTransform();         
    }


    Triangle3D.prototype.setProperties = function(properties)
    {
        this.surface.setProperties(properties); 
    }
        
    Triangle3D.prototype.setColor = function(red, green, blue, opacity)
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

    Triangle3D.prototype.setOpacity = function(opacity)
    {
        this.opacity = opacity; 
        return this; 
    }

    Triangle3D.prototype.render = function()
    {
        var result = [{                                                 
                transform: this.mtx,                 
                opacity: this.opacity, 
                target: this.surface.render()
            }];

        result.push(this.normal.render()); 
        result.push(this.line1.render()); 
        result.push(this.line2.render()); 
        result.push(this.line3.render()); 
        result.push(this.line4.render()); 
        result.push(this.line5.render()); 
        result.push(this.line6.render());         

        result.push({
            transform: this.p1Surf.mtx, 
            opacity: this.p1Surf.opacity, 
            target: this.p1Surf.render()
        })      
        
        result.push({
            transform: this.p2Surf.mtx, 
            opacity: this.p2Surf.opacity, 
            target: this.p2Surf.render()
        })      

        result.push({
            transform: this.p3Surf.mtx, 
            opacity: this.p3Surf.opacity, 
            target: this.p3Surf.render()
        })      

        result.push({
            transform: this.p4Surf.mtx, 
            opacity: this.p4Surf.opacity, 
            target: this.p4Surf.render()
        })      

        result.push({
            transform: this.p5Surf.mtx, 
            opacity: this.p5Surf.opacity, 
            target: this.p5Surf.render()
        })   

        result.push({
            transform: this.p6Surf.mtx, 
            opacity: this.p6Surf.opacity, 
            target: this.p6Surf.render()
        })   
            
        return result; 
    }

    Triangle3D.prototype.setP1 = function(x1, y1, z1)
    {
        this.set(x1, y1, z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3); 
    }

    Triangle3D.prototype.setP2 = function(x2, y2, z2)
    {
        this.set(this.x1, this.y1, this.z1, x2, y2, z2, this.x3, this.y3, this.z3);  
    }

    Triangle3D.prototype.setP3 = function(x3, y3, z3)
    {
        this.set(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, x3, y3, z3); 
    }

    Triangle3D.prototype.set = function(x1, y1, z1, x2, y2, z2, x3, y3, z3)
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
    
    Triangle3D.prototype.getP1 = function()
    {
        return [this.x1, this.y1, this.z1];
    }

    Triangle3D.prototype.getP2 = function()
    {
        return [this.x2, this.y2, this.z2];            
    }

    Triangle3D.prototype.getP3 = function()
    {
        return [this.x3, this.y3, this.z3];
    }
    
    Triangle3D.prototype.getLength = function()
    {
        return this.length; 
    }

    Triangle3D.prototype.calculateTransform = function()
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

        var a = 0.0;    //Area  
        var b = 0.0;    //Base
        var h = 0.0;    //Height
        var l = 0.0;    //Left Length 
        var r = 0.0;    //Right Length

        var hInvert = 1.0; 
        var wInvert = 1.0;

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
                  
        var p1 = new Vector(p1x,p1y,p1z); 
        var p2 = new Vector(p2x,p2y,p2z); 
        var p3 = new Vector(p3x,p3y,p3z); 

        var m = new Vector(p1x+p2x,p1y+p2y,p1z+p2z); 
        m.mult(.5, m); 

        var m1 = new Vector(); 
        m1.add(p1).sub(m,m1); 

        this.line5.set(m.x, m.y, m.z, m.x+m1.x, m.y+m1.y, m.z+m1.z); 

        this.p5Surf.mtx = FM.translate(m.x, m.y, m.z); 

        this.p1Surf.mtx = FM.move(FM.identity, [p1x, p1y, p1z]);
        this.p2Surf.mtx = FM.move(FM.identity, [p2x, p2y, p2z]);
        this.p3Surf.mtx = FM.move(FM.identity, [p3x, p3y, p3z]);
  

        var center = new Vector(p1x+p2x+p3x, p1y+p2y+p3y, p1z+p2z+p3z); 
        center.mult(1.0/3.0, center); 

        var v21 = new Vector(); 
        v21.add(p2).sub(p1,v21);
        
        var v23 = new Vector();         
        v23.add(p3).sub(p2,v23);

        var v13 = new Vector();  
        v13.add(p3).sub(p1,v13);        

        var cross = new Vector(); 
        v21.cross(v23, cross);         


        a = 0.5*cross.norm(); 
        h = 2.0*a/b; 

        var mc = new Vector(); 
        mc = m1.cross(cross, mc); 
        mc.normalize(h/2.0, mc); 

        this.line6.set(m.x, m.y, m.z, m.x+mc.x, m.y+mc.y, m.z+mc.z);         

        var diff = new Vector(m.x+mc.x, m.y+mc.y, m.z+mc.z); 

        this.p6Surf.mtx = FM.translate(diff.x, diff.y, diff.z);

        var theta1 = Math.asin( h / v13.getLength() ); 
        var theta2 = Math.asin( h / v23.getLength() );        
        
        var l = ( h / Math.tan(theta2) ) / b;         
        var r = ( h / Math.tan(theta1) ) / b;       
        
        cross.normalize(150.0, cross);        
        this.line4.set(center.x, center.y, center.z, center.x + cross.x, center.y + cross.y, center.z + cross.z); 
     
        this.p4Surf.mtx = FM.translate(center.x, center.y, center.z);

        // rotateZ first, then rotateX and rotateY
        var theta = Math.acos(v21.dot(v23) / (v21.norm() * v23.norm())); // angle between v21 and v23
        var thetaY = Math.atan2(cross.x, Math.sqrt(cross.z*cross.z + cross.y*cross.y));
        var thetaX = Math.atan2(-cross.y, cross.z); 

        this.surface.setProperties({            
            'border-radius': '0px',
            'border-right': this.size*r+'px solid red',
            'border-left': this.size*l+'px solid green',            
            'border-bottom': this.size+'px solid rgba('+this.red+', '+this.green+', '+this.blue+', 1.0)'
        });
                
        var xOff = center.x - (center.x-diff.x); 
        var yOff = center.y - (center.y-diff.y); 
        var zOff = center.z - (center.z-diff.z);  
        
        this.line1.setLineWidth(10); 
        this.line1.set(0, 0, 0, center.x, center.y, center.z);        

        this.mtx = FM.scale(this.invSize*b, this.invSize*h, 1.0);     
        this.mtx = FM.multiply(this.mtx, FM.rotateZ(-theta+Math.PI*.5), FM.rotate(thetaX, thetaY, 0));                        
        this.mtx = FM.move(this.mtx, [xOff, yOff, zOff]);                        
    }

    module.exports = Triangle3D;
});