define(function(require, exports, module) {
    var Particle = require('./Particle');
    var Vector = require('famous-physics/math/Vector');
    var Quaternion = require('famous-physics/math/Quaternion');
    var FM = require('famous/Matrix');

    function Body(opts){
        Particle.call(this, opts);

        this.q = (opts.q) ? new Quaternion(opts.q) : new Quaternion();  //orientation
        this.w = (opts.w) ? new Vector(opts.w) : new Vector();          //angular velocity
        this.L = (opts.L) ? new Vector(opts.L) : new Vector();          //angular momentum
        this.t = (opts.t) ? new Vector(opts.t) : new Vector();          //torque

        this.I    = [1,0,0,1,0,0,1,0,0];   //inertia tensor
        this.Iinv = [1,0,0,1,0,0,1,0,0];   //inverse inertia tensor
        this.w.w  = 0;                     //quaternify the angular velocity
    };

    Body.prototype = Object.create(Particle.prototype);
    Body.prototype.constructor = Body;

    Body.prototype.updateAngularVelocity = function(){
		var Iinv = this.Iinv;
	    var L = this.L;
	    var Lx = L.x, Ly = L.y, Lz = L.z;
	    var I0 = Iinv[0], I1 = Iinv[1], I2 = Iinv[2];

	    this.w.setXYZ(
		    I0[0] * Lx + I0[1] * Ly + I0[2] * Lz,
		    I1[0] * Lx + I1[1] * Ly + I1[2] * Lz,
		    I2[0] * Lx + I2[1] * Ly + I2[2] * Lz
	    );
    };

    Body.prototype.applyTorque = function(torque){
        if (this.getImmunity()) return;
        this.t.add(torque, this.t);
    };

    Body.prototype.getTransform = function(){
        return FM.move(this.q.getMatrix(), this.p.get());
    };

    module.exports = Body;

});
