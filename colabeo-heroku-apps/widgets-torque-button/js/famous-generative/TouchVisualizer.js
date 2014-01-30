define(function(require, exports, module) {
    var Touch = require('./Touch');     
    
    function TouchVisualizer()
    {
        this.touches = []; 
        this.cachedTouches = []; 
        this.unActiveTouches = []; 
        this.activeIdentifies = []; 

        for (var i = 0; i < 20; i++) 
        {
            this.cachedTouches[i] = new Touch(this);             
            this.unActiveTouches[i] = this.cachedTouches[i]; 
        }      
    }

    TouchVisualizer.prototype.update = function()
    {
        for(var i = 0; i < this.activeIdentifies.length; i++)
        {
            var id = this.activeIdentifies[i]; 
            if(this.touches[id] != undefined)
            {
                this.touches[id].update();     
            }            
        }
    } 
    
    TouchVisualizer.prototype.render = function()
    {
        var result = [];     

        for(var i = 0; i < this.activeIdentifies.length; i++)
        {
            var id = this.activeIdentifies[i]; 
            if(this.touches[id] != undefined && this.touches[id].isAlive())
            {
                result.push(this.touches[id].render());                              
                result.push(this.touches[id].renderBack());                  
            }
            else
            {
                this.touchFreed(this.touches[id]); 
            }
        }

        return result;
    }

    TouchVisualizer.prototype.emit = function(type, event)
    {
        if(type == 'touchstart')        this.touchstart(event);
        else if(type == 'touchmove')    this.touchmove(event);
        else if(type == 'touchend')     this.touchend(event);
        else if(type == 'prerender')    this.update(event);    
    }
    
    TouchVisualizer.prototype.getCachedTouch = function()
    {
        return this.unActiveTouches.pop();     
    }

    TouchVisualizer.prototype.touchstart = function(event) 
    {    
        for(var i = 0; i < event.changedTouches.length; i++)
        {
            var id = event.changedTouches[i].identifier; 
            
            if(this.touches[id] == undefined && this.cachedTouches.length > 0)
            {                
                if(this.activeIdentifies.indexOf(id) == -1)
                {
                    this.activeIdentifies.push(id); 
                }
                this.touches[id] = this.getCachedTouch();                                 
                this.touches[id].setIdentifier(id);                                                            
            }           
            this.touches[id].touchstart(
                event.changedTouches[i].clientX, 
                event.changedTouches[i].clientY);                                        
        }
    }
    
    TouchVisualizer.prototype.touchmove = function(event) 
    {
        for(var i = 0; i < event.changedTouches.length; i++)
        {
            var id = event.changedTouches[i].identifier; 
            if(this.touches[id] != undefined)
            {
                this.touches[id].touchmove(
                    event.changedTouches[i].clientX, 
                    event.changedTouches[i].clientY);                 
            }
        }        
    }
    
    TouchVisualizer.prototype.touchend = function(event) 
    {
        for(var i = 0; i < event.changedTouches.length; i++)
        {
            var id = event.changedTouches[i].identifier; 
            if(this.touches[id] != undefined)
            {
                this.touches[id].touchend(); 
            }
        }
    }

    TouchVisualizer.prototype.touchFreed = function(touch)
    {    
        if(touch != undefined)
        {
            var id = touch.identifier;      
            var index = this.activeIdentifies.indexOf(id); 
            this.activeIdentifies.splice(index, 1); 
            this.unActiveTouches.push(touch);    
            this.touches[id] = undefined;            
        }
    } 
    
    module.exports = TouchVisualizer;
});