define(function(require, exports, module) {

    /**
     * @constructor
     */
    function Integrator(position, target, damping, velLimit, accLimit)
    {        
        this.targeting = true; 
        this.target = target || 0.0; 
        this.pos = position || 0.0; 
        this.delta = this.target - this.pos; 
        this.vel = 0.0; 
        this.acc = 0.0; 
        this.damping = damping || 0.125; 
        this.extForce = 0.0;  
        this.extForceInQue = false; 
        this.velLimit = velLimit || .125;      
        this.accLimit = accLimit || .0125;         
    };

    Integrator.prototype.setPhysics = function(damping, velLimit, accLimit)    
    {
        this.damping = damping; 
        this.velLimit = velLimit; 
        this.accLimit = accLimit;   
    }
  
    Integrator.prototype.update = function()    
    {        
        if(this.targeting)
        {
            this.acc = 0; 
            this.acc+=this.goToTarget(); 
            if(this.extForceInQue)
            {   
                this.acc+=this.extForce; 
                this.extForceInQue = false; 
                this.extForce = 0; 
            }            
            this.accLimitCheck(); 
            this.acc-=this.vel*this.damping;         
            this.vel+=this.acc; 
            this.velLimitCheck(); 
            this.pos+=this.vel;        
        }
        return this.pos;     
    }

    Integrator.prototype.setTarget = function(val)
    {
        this.target = val; 
    }

    Integrator.prototype.setTargetAndHome = function(val)
    {
        this.target = val; 
        this.pos = val; 
    }        

    Integrator.prototype.getValue = function()
    {
        return this.pos; 
    }
   
    Integrator.prototype.goToTarget = function()    
    {
        this.delta = this.target - this.pos;        
        return this.delta; 
    }   
    
    Integrator.prototype.addForce = function(extForce)  
    {
        this.extForceInQue = true; 
        this.extForce += extForce; 
    }

    Integrator.prototype.accLimitCheck = function()
    {
        if(Math.abs(this.acc) > this.accLimit)
        {
            if(this.acc > 0)
            {
                this.acc = this.accLimit; 
            }
            else {
                this.acc = -this.accLimit; 
            }
        }
    }

    Integrator.prototype.velLimitCheck = function()
    {
        if(Math.abs(this.vel) > this.velLimit)
        {
            if(this.vel > 0)
            {
                this.vel = this.velLimit; 
            }
            else {
                this.vel = -this.velLimit; 
            }
        }       
    }

    module.exports = Integrator;

});