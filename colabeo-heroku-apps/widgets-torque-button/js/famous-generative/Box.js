define(function(require, exports, module) {
    var FamousSurface = require('famous/Surface');
    var FM = require('famous/Matrix');
    var Utils = require('famous-utils/Utils'); 
    var FamousRenderNode = require('famous/RenderNode'); 

    /** @constructor */
    function Box(width, height, depth)
    {       
        this.nodes = [];    
        this.result = [];      
        this.top = new FamousSurface({size:[width, depth]});         
        this.bottom = new FamousSurface({size:[width,depth]});         
        this.left = new FamousSurface({size:[depth, height]});         
        this.right = new FamousSurface({size:[depth, height]});         
        this.front = new FamousSurface({size:[width, height]});         
        this.back = new FamousSurface({size:[width, height]});         
        this.top.addClass('box-top'); 
        this.bottom.addClass('box-bottom'); 
        this.left.addClass('box-left'); 
        this.right.addClass('box-right'); 
        this.front.addClass('box-front'); 
        this.back.addClass('box-back'); 
        this.sides = [this.top, this.bottom, this.left, this.right, this.front, this.back]; 
    
        //Top
        this.result.push({
                transform: FM.multiply(FM.translate(0.0,0.0,height*.5),FM.rotateX(Math.PI*.5)), 
                opacity: 1.0, 
                target: this.add(this.top).execute()
            });

        //Bottom
        this.result.push({
                transform: FM.multiply(FM.translate(0.0,0.0,height*.5),FM.rotateX(-Math.PI*.5)), 
                opacity: 1.0, 
                target: this.add(this.bottom).execute()
            });              
        
        //Left 
        this.result.push({
                transform: FM.multiply(FM.translate(0.0,0.0,width*.5),FM.rotateY(-Math.PI*.5)), 
                opacity: 1.0, 
                target: this.add(this.left).execute()
            });              
        
        //Right
        this.result.push({
                transform: FM.multiply(FM.translate(0.0,0.0,width*.5),FM.rotateY(Math.PI*.5)), 
                opacity: 1.0, 
                target: this.add(this.right).execute()
            });              
        
        //Front
        this.result.push({
                transform: FM.translate(0.0,0.0,depth*.5),
                opacity: 1.0, 
                target: this.add(this.front).execute()
            });              
        
        //Back
        this.result.push({
                transform: FM.translate(0.0,0.0,-depth*.5),
                opacity: 1.0, 
                target: this.add(this.back).execute()
            });              
    }

    Box.prototype.setColor = function(red, green, blue, alpha)
    {
        for(var i = 0; i < this.sides.length; i++)
        {
            this.sides[i].setProperties({backgroundColor: Utils.color(red, green, blue, alpha)});         
        }
    }

    Box.prototype.setFrontColor = function(red, green, blue, alpha)
    {
        this.front.setProperties(Utils.backgroundColor(red, green, blue, alpha));
    }

    Box.prototype.setBackColor = function(red, green, blue, alpha)
    {
        this.back.setProperties(Utils.backgroundColor(red, green, blue, alpha));   
    }

    Box.prototype.setRightColor = function(red, green, blue, alpha)
    {
        this.right.setProperties(Utils.backgroundColor(red, green, blue, alpha));      
    }

    Box.prototype.setLeftColor = function(red, green, blue, alpha)
    {
        this.left.setProperties(Utils.backgroundColor(red, green, blue, alpha));   
    }

    Box.prototype.setTopColor = function(red, green, blue, alpha)
    {
        this.top.setProperties(Utils.backgroundColor(red, green, blue, alpha));   
    }

    Box.prototype.setBottomColor = function(red, green, blue, alpha)
    {
        this.bottom.setProperties(Utils.backgroundColor(red, green, blue, alpha));   
    }
    

    Box.prototype.add = function(obj) {
        var node = new FamousRenderNode();
        this.nodes.push(node); 
        node.from(obj);
        return node; 
    };

    Box.prototype.render = function() {         
        return this.result;
    };

    module.exports = Box;
});