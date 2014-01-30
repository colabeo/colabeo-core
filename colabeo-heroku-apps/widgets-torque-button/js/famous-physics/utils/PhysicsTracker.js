define(function(require, exports, module) {
    var GenericSync = require('famous-sync/GenericSync');
    var FEH = require('famous/EventHandler');
    var Timer = require('famous-misc/Timer');

    /** @constructor */
    function PhysicsTracker(particle, opts){
        this.particle = particle;
        this.opts = {
            scale : 1
        };

        if (opts) this.setOpts(opts);

        this.genericSync = new GenericSync(function(){
            return this.particle.getPos();
        }.bind(this));

        this.eventOutput = new FEH();
        FEH.setInputHandler(this, this.genericSync);
        FEH.setOutputHandler(this, this.eventOutput);

        this.originalImmunity = particle.immunity;
        this.timer = Timer;
        this.moving = false;

        _bindEvents.call(this);
    }

    function _bindEvents() {
        this.genericSync.on('start', _handleStart.bind(this));
        this.genericSync.on('update', _handleUpdate.bind(this));
        this.genericSync.on('end', _handleEnd.bind(this));
    }

    function _handleStart(data) {
        var particle = this.particle;
        data.particle = particle;
        this.originalImmunity = particle.immunity;
        particle.immunity = true;
        particle.v.clear();
        this.eventOutput.emit('start', data);
    }

    function _handleUpdate(data) {
        this.moving = true;
        //TODO: update velocity for collisions
        var particle = this.particle;
        particle.setPos(data.p);
        particle.setVel(data.v, true);
        this.eventOutput.emit('update', data);

        //TODO: optimize repeated bind calls
        var debounce = function(cachedPosition){
//            var actualPosition = this.particle.p;
//            if (this.moving && cachedPosition[0] === actualPosition.x) {
                particle.v.clear();
                this.moving = false;
//            }
        };

        this.timer.after(debounce.bind(this, data.p), 2);
    }

    function _handleEnd(data) {
        this.moving = false;
        var particle = this.particle;
        data.particle = particle;
        var scale = this.opts.scale;
        particle.setVel([data.v[0]*scale, data.v[1]*scale], true);
        particle.immunity = this.originalImmunity;
        this.eventOutput.emit('end', data);
    }

    PhysicsTracker.prototype.setOpts = function(opts){
        for (var key in opts) this.opts[key] = opts[key];
    }

    module.exports = PhysicsTracker;

});