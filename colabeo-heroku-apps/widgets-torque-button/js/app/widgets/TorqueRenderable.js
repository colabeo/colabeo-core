define(function(require, exports, module) { 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
    var Modifier = require('famous/Modifier');
    var RenderNode = require('famous/RenderNode');
    
    var PhysicsEngine = require('famous-physics/PhysicsEngine');
    var Vector = require('famous-physics/math/Vector');
    var Quaternion = require('famous-physics/math/Vector');
    var TorqueSpring = require('famous-physics/forces/TorqueSpring');
    var Spring = require('famous-physics/forces/Spring');
    var Drag = require('famous-physics/forces/Drag');
    var Utils = require('famous-utils/Utils');
    
    function TorqueRenderable( options ) {

        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );

        this.physicsMod = new Modifier({
            origin: [0.5, 0.5] 
        });
        
        this.physicsNode = new RenderNode();

        this.modifier = new Modifier({
            size: this.options.size
        });

        // render tree
        this.node.link( this.modifier )
            .link( this.physicsMod )
            .link( this.physicsNode );
         
        // Physics
        this.PE = new PhysicsEngine();

        this.body = this.PE.createBody ({ 
            shape : this.PE.BODIES.RECTANGLE,
            size : this.options.size
        });

        this.torqueSpring = new TorqueSpring({
            anchor : new Quaternion(0,0,0,0),
            period : this.options.torquePeriod,
            dampingRatio : this.options.torqueDamping
        });

        this.forceSpring = new Spring({
            anchor: [0,0,0],
            period: this.options.forceSpringPeriod,
            dampingRatio: this.options.forceSpringDamping
        });

        this.drag = new Drag({strength : this.options.drag });

        // Events
        //this.on('click', this.applyTorque.bind( this ));
        if( Utils.isWebkit() ) { 
            this.on('mousedown', _mouseTorque.bind(this));
        } else { 
            this.on('mousedown', _touchTorque.bind(this));
        }
        this.on('touchstart', _touchTorque.bind(this));

        this._torque = new Vector(0,0,-this.options.torqueStrength);
        this._force = new Vector(0,0,-this.options.forceStrength);

        this.PE.attach([ this.torqueSpring,  this.forceSpring ]);
        
        _initDefaultViews.call( this );
    }

    TorqueRenderable.prototype = Object.create( View.prototype );
    TorqueRenderable.prototype.constructor = TorqueRenderable;

    TorqueRenderable.DEFAULT_OPTIONS = { 
        pos: [ 0, 0, 0 ],
        vel: [ 0, 0, 0 ],
        torqueStrength: .02, 
        torquePeriod : 5,
        torqueDamping: 20,
        forceStrength: 0.02,
        forceSpringPeriod: 1000,
        forceSpringDamping: 0.8,
        zDepth : -300,
        size: [400, 400],
        drag: 0.01,
        views : []
    }

    function _initDefaultViews () {
        for (var i = 0; i < this.options.views.length; i++) {
            this.add( this.options.views[i] );
        };
    }

    function _mouseTorque ( e ) {
        this.applyTorque(  
            new Vector(
                (e.offsetX - this.body.size[0]/2),
               -(e.offsetY - this.body.size[1]/2),
                0
            )
        );
    }

    function _touchTorque ( e ) {
        for (var i = 0; i < e.touches.length; i++) {
            var x = e.touches[i].pageX,
                y = e.touches[i].pageY;

            this.applyTorque( 
                new Vector(
                    (x - this.offset[0] - this.body.size[0] / 2), 
                   -(y - this.offset[1] - this.body.size[1] / 2),
                     0                
                )
            );
        };
    }

    TorqueRenderable.prototype.setTransform = function ( transform, curve, callback ) {
        this.modifier.setTransform( transform, curve, callback );
        this.setOffset( FM.getTranslate( transform ) );
    }

    TorqueRenderable.prototype.setOffset = function ( offset ) {
        this.offset = offset;
    }

    TorqueRenderable.prototype.setSize = function ( size ) {
        this.body.setOptions({ size: size });
        this.modifier.setSize(size);
    }

    TorqueRenderable.prototype.applyTorque = function ( forceVector ) {

        this.body.applyTorque(forceVector.cross(this._torque));
        this.body.applyForce(this._force); 

        this.emit('forceApplied');
    }
    
    
    TorqueRenderable.prototype.add = function ( obj ) {
        this.physicsNode.add( obj );
        obj.pipe( this );
    }

    TorqueRenderable.prototype.render = function () {
        this.PE.step();
        var transform = this.body.getTransform();
        this.physicsMod.setTransform( transform );
        return this.node.render(); 
    }

    TorqueRenderable.prototype.setTorqueSpringOpts = function () {
        this.torqueSpring.setOpts({
            period : this.options.torquePeriod,
            dampingRatio : this.options.torqueDamping
        });
    }
    TorqueRenderable.prototype.setForceSpringOpts = function () {
        this.forceSpring.setOpts({
            period : this.options.forceSpringPeriod,
            dampingRatio : this.options.forceSpringDamping
        });
    }   

    TorqueRenderable.prototype.setForce = function ( arg ) {
        this.options.forceStrength = arg;
        this._force = new Vector(0,0,-this.options.forceStrength);
    }

    TorqueRenderable.prototype.setTorque = function ( arg ) {
        this.options.torqueStrength = arg;
        this._torque = new Vector(0,0,-this.options.torqueStrength);
    }

    module.exports = TorqueRenderable;
});
