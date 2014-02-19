define(function(require, exports, module) {
    var Constraint = require('famous-physics/constraints/Constraint');
    var Vector = require('famous-math/Vector');

    /** @constructor */
    function Rod(opts){

        this.opts = {
            length      : 0,
            anchor      : undefined,
            stiffness   : 1
        };

        if (opts) this.setOpts(opts);

        //registers
        this.disp = new Vector();
        this.push = new Vector();

    };

    Rod.prototype = Object.create(Constraint.prototype);
    Rod.prototype.constructor = Constraint;

    Rod.prototype.setOpts = function(opts){
        if (opts.anchor !== undefined){
            if (opts.anchor.p instanceof Vector) this.opts.anchor = opts.anchor.p;
            if (opts.anchor   instanceof Vector)  this.opts.anchor = opts.anchor;
            if (opts.anchor   instanceof Array)  this.opts.anchor = new Vector(opts.anchor);
            delete opts.anchor;
        }
        for (var key in opts) this.opts[key] = opts[key];
    };

    Rod.prototype.applyConstraint = function(targets, source, dt){

        var opts            = this.opts;
        var disp            = this.disp;
        var push            = this.push;
        var targetLength    = opts.length;
        var stiffness       = opts.stiffness;
        var anchor          = opts.anchor || source.p;

        var particle = targets[0];
        var p = particle.p;

        disp.set(p.sub(anchor));
        var currLength = disp.norm();

        var stretch = (targetLength - currLength) / currLength;

        if (Math.abs(stretch) > 0){
            push.set(disp.mult(stretch * 0.5 * stiffness));

            particle.setPos(p.add(push));
            particle.setVel(particle.v.add(push.div(dt)));

            if (source && !source.hasImmunity('agents')){
                source.setPos(source.p.sub(push));
                source.setVel(source.v.sub(push.div(dt)));
            }
        };

    };

    module.exports = Rod;

});