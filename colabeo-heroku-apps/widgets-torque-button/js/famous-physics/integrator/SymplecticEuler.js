define(function(require, exports, module) {

    /** @constructor */
    function SymplecticEuler(opts){
        this.opts = {
            vCap : Infinity,
            aCap : Infinity
        };

        if (opts) this.setOpts(opts);
    };

    SymplecticEuler.prototype.integrateVelocity = function(particle, dt){
        var v = particle.v,
            a = particle.a;

        if (a.isZero()) return;
        a.cap(this.opts.aCap, a);
        v.add(a.mult(dt), v);
    };

    SymplecticEuler.prototype.integratePosition = function(particle, dt){
        var p = particle.p,
            v = particle.v;

        if (v.isZero()) return;
        v.cap(this.opts.vCap, v);
        p.add(v.mult(dt), p);
    };

    SymplecticEuler.prototype.integrateAngularMomentum = function(particle, dt){
        var L = particle.L,
            t = particle.t;

        if (t.isZero()) return;
        L.add(t.mult(dt), L);
        t.clear();
    };

    SymplecticEuler.prototype.integrateOrientation = function(particle, dt){
        var q = particle.q,
            w = particle.w;

        if (w.isZero()) return;
        q.normalize();

        q.add(q.multiply(w).scalarMult(0.5 * dt), q);
    };

    SymplecticEuler.prototype.setOpts = function(opts){
        for (var key in opts) this.opts[key] = opts[key];
    };

    module.exports = SymplecticEuler;

});