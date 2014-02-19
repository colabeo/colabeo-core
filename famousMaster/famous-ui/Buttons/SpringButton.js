define(function(require, exports, module) { 
    var PhysicsEngine = require('famous-physics/PhysicsEngine');
    var View = require('famous/View');
    var Spring = require('famous-physics/forces/Spring');
    var Surface = require('famous/Surface');
    var Vector3 = require('famous-physics/famous-math/Vector');
    var Utils = require('famous-utils/Utils');

    function SpringButton (options) {
        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );

        this.PE = new PhysicsEngine();
        this.available = true;
        
        this.anchor = this.PE.createParticle({ 
            p: this.options.pos,
            v: this.options.vel,
            immunity: true
        });

        this.particle = this.PE.createParticle({ 
            p: this.options.pos,
            v: this.options.vel,
        });

        this.spring = new Spring({ 
            period          : this.options.springPeriod,
            dampingRatio    : this.options.springDampingRatio,
            length          : this.options.springLength,
            anchor          : this.options.pos,
            callback        : selection.bind(this)
        });

        this.PE.attach(this.spring, this.particle);

        this.surface = new Surface({
            size: this.options.size, 
            content: this.options.content,
            classes: this.options.classes,
            properties: this.options.properties
        });

        this.surface.on('click', _handleClick.bind(this));
    }
    
    SpringButton.prototype = Object.create(View.prototype);
    SpringButton.prototype.constructor = SpringButton;
    
    SpringButton.DEFAULT_OPTIONS = {
        size: [200, 200],
        pos: [0, 0, 0],
        vel: [0, 0, 0],
        springPeriod: 200,
        springDampingRatio: 0.8,
        springLength: 0,
        content: '', 
        properties: {},
        classes: [],
        limitTouches: false,
        forceMult: [10, 10, 10],
        callbackTolerance : 1e-4,
        clickForce: [0, 0, -0.005]
    }
    

    SpringButton.prototype.setPeriod = function (val) {
       this.spring.setPeriod(val);
    };   
    
    SpringButton.prototype.setDamping = function (val) {
       this.spring.setDampingRatio(val);
    };   
    
    SpringButton.prototype.setCallbackTolerance = function (val) {
       this.spring.opts.callbackTolerance = val;
    };

    SpringButton.prototype._addForce = function (_force) {

        var force = { x: 0, y: 0, z: 0 }; 

        if ( Utils.isArray( _force) ) { 
            force.x = _force[0] * this.options.forceMult[0];
            force.y = _force[1] * this.options.forceMult[1];
            force.z = _force[2] * this.options.forceMult[2];
        } else {
            force.x = _force.x * this.options.forceMult[0];
            force.y = _force.y * this.options.forceMult[1];
            force.z = _force.z * this.options.forceMult[2];
        }
        if(this.options.limitTouches) { 
            if(this.available) {
                this.particle.applyForce(force);
                this.available = false;

                this.eventOutput.emit('click');
            }

        } else { 
            this.particle.applyForce(force) 
            this.eventOutput.emit('click');
                
        }            
    };

    SpringButton.prototype.render = function () {

        this.PE.step();    

        return { 
            opacity: 1,
            transform: this.PE.getTransform(this.particle),
            target: this.surface.render()
        };
    };

    function _handleClick () {

        this._addForce( this.options.clickForce )   
        
    }

    function selection (e) {

        if( this.options.limitTouches ) { 
            this.available = true;
        }
        
    }
    module.exports = SpringButton;
});
