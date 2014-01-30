define(function(require, exports, module) 
{
    var Vector = require('famous-math/Vector');

    /** @constructor */
    function Particle()
    {
        this.theta = 0.0; 
        this.speed = .01; 
        this.home = new Vector(0.0,0.0,0.0); 
        this.ppos = new Vector(0.0,0.0,0.0); 
        this.pos = new Vector(0.0,0.0,0.0); 
        this.vel = new Vector(0.0,0.0,0.0); 
        this.acc = new Vector(0.0,0.0,0.0);         

        this.velLimit = 10.0; 
        this.accLimit = .25; 
        this.radius = .5;         
    }

    Particle.prototype.update = function() 
    {        
        this.ppos.set(this.pos);        
        this.ppos.sub(this.pos, this.vel);  
        this.vel.add(this.acc.cap(this.accLimit), this.vel);
        this.pos.add(this.vel.cap(this.velLimit), this.pos); 
    };



    module.exports = Particle;
});
