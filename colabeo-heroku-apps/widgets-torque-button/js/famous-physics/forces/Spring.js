define(function(require, exports, module) {
	var Force = require('famous-physics/forces/Force');
    var Vector = require('famous-physics/math/Vector');

    /** @constructor */
    function Spring(opts){

        this.opts = {
            period        : 0,
            dampingRatio  : 0,
            length        : 0,
            lMin          : 0,
            lMax          : Infinity,
            anchor        : undefined,
            forceFunction : Spring.FORCE_FUNCTIONS.HOOK,
            callback      : undefined,
            callbackTolerance : 1e-7
        };

        if (opts) this.setOpts(opts);

        this.init();
        this._canFireCallback = undefined;

	    Force.call(this);

    };

	Spring.prototype = Object.create(Force.prototype);
	Spring.prototype.constructor = Force;

    Spring.FORCE_FUNCTIONS = {
        FENE : function (dist, rMax){
            var rMaxSmall = rMax * .99;
            var r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
            return r / (1 - r * r/(rMax * rMax))
        },
        HOOK : function(dist){
            return dist;
        }
    };

    function setForceFunction(fn){
        this.forceFunction = fn;
    };

    function setStiffness(opts){
        opts.stiffness = Math.pow(2 * Math.PI / opts.period, 2);
    };

    function setDamping(opts){
        opts.damping = 4 * Math.PI * opts.dampingRatio / opts.period ;
    };

    function getEnergy(strength, dist){
        return 0.5 * strength * dist * dist;
    };

    Spring.prototype.init = function(){
        var opts = this.opts;
        setForceFunction.call(this, opts.forceFunction);
        setStiffness.call(this, opts);
        setDamping.call(this, opts);
    };

    Spring.prototype.applyForce = function(targets, source){

        var force        = this.force;
        var opts         = this.opts;

        var stiffness    = opts.stiffness;
        var damping      = opts.damping;
        var restLength   = opts.length;
        var anchor       = opts.anchor || source.p;
        var callback     = opts.callback;

        for (var i = 0; i < targets.length; i++){

            var target = targets[i];

            var disp = anchor.sub(target.p);
            var dist = disp.norm() - restLength;

            if (dist == 0) return;

            //if dampingRatio specified, then override strength and damping
            var m      = target.m;
            stiffness *= m;
            damping   *= m;

            force.set(disp.normalize(stiffness * this.forceFunction(dist, this.opts.lMax)));

            if (damping)
                if (source) force.add(target.v.sub(source.v).mult(-damping), force);
                else        force.add(target.v.mult(-damping), force);

            target.applyForce(force);
            if (source) source.applyForce(force.mult(-1));

            if (this.opts.callback) {
                var energy = target.getEnergy() + getEnergy(stiffness, dist);
                this.fireCallback(target, callback, energy);
            };

        };

    };

    Spring.prototype.fireCallback = function(target, callback, energy){
        if (energy < this.opts.callbackTolerance){
            if (this._canFireCallback) callback.call(this, target)
            this._canFireCallback = false;
        }
        else this._canFireCallback = true;
    };

    Spring.prototype.getEnergy = function(target, source){
        var opts        = this.opts;
        var restLength  = opts.length,
            anchor      = opts.anchor || source.p,
            strength    = opts.stiffness;

        var displacement = anchor.sub(target.p);
        var dist = displacement.norm() - restLength;

        return 0.5 * strength * dist * dist;
    };

    Spring.prototype.setOpts = function(opts){
        if (opts.anchor !== undefined){
            if (opts.anchor.p instanceof Vector) this.opts.anchor = opts.anchor.p;
            if (opts.anchor   instanceof Vector)  this.opts.anchor = opts.anchor;
            if (opts.anchor   instanceof Array)  this.opts.anchor = new Vector(opts.anchor);
        }
        if (opts.period !== undefined) this.opts.period = opts.period;
        if (opts.dampingRatio !== undefined) this.opts.dampingRatio = opts.dampingRatio;
        if (opts.length !== undefined) this.opts.length = opts.length;
        if (opts.lMin !== undefined) this.opts.lMin = opts.lMin;
        if (opts.lMax !== undefined) this.opts.lMax = opts.lMax;
        if (opts.forceFunction !== undefined) this.opts.forceFunction = opts.forceFunction;
        if (opts.callback !== undefined) this.opts.callback = opts.callback;
        if (opts.callbackTolerance !== undefined) this.opts.callbackTolerance = opts.callbackTolerance;

        this.init();
    };

    module.exports = Spring;

});