define(function(require, exports, module) {
    var Constraint = require('famous-physics/constraints/Constraint');
    var Vector = require('famous-math/Vector');
    var Wall = require('famous-physics/constraints/Wall');

    /** @constructor */
    function Walls(opts){
        this.opts = {
            sides   : Walls.TWO_DIMENSIONAL,
            size    : [window.innerWidth, window.innerHeight, 0],
            origin  : [.5,.5,.5],
            k       : 0,
            restitution : 0.5,
            onContact   : Walls.ON_CONTACT.REFLECT
        };

        this.sides = {};
        this.createSides(opts.sides || this.opts.sides);
        if (opts) this.setOpts(opts);
    };

    Walls.prototype = Object.create(Constraint.prototype);
    Walls.prototype.constructor = Constraint;

    Walls.LEFT   = 0;
    Walls.RIGHT  = 1;
    Walls.TOP    = 2;
    Walls.BOTTOM = 3;
    Walls.FRONT  = 4;
    Walls.BACK   = 5;

    var SIDE_NORMALS = {
        0 : new Vector( 1, 0, 0),
        1 : new Vector(-1, 0, 0),
        2 : new Vector( 0, 1, 0),
        3 : new Vector( 0,-1, 0),
        4 : new Vector( 0, 0, 1),
        5 : new Vector( 0, 0,-1)
    };

    function _getDistance(side, size, origin){
        var distance;
        switch (parseInt(side)){
            case Walls.LEFT:
                distance = size[0] * origin[0];
                break;
            case Walls.TOP:
                distance = size[1] * origin[1];
                break;
            case Walls.FRONT:
                distance = size[2] * origin[2];
                break;
            case Walls.RIGHT:
                distance = size[0] * (1 - origin[0]);
                break;
            case Walls.BOTTOM:
                distance = size[1] * (1 - origin[1]);
                break;
            case Walls.BACK:
                distance = size[2] * (1 - origin[2]);
                break;
        }
        return distance;
    };

    Walls.TWO_DIMENSIONAL   = [Walls.LEFT, Walls.RIGHT, Walls.TOP, Walls.BOTTOM];
    Walls.THREE_DIMENSIONAL = [Walls.LEFT, Walls.RIGHT, Walls.TOP, Walls.BOTTOM, Walls.FRONT, Walls.BACK];

    Walls.ON_CONTACT = Wall.ON_CONTACT;

    Walls.prototype.setOpts = function(opts){
        var resizeFlag = false;
        if (opts.restitution !== undefined) this.setOptsForEach({restitution : opts.restitution});
        if (opts.k !== undefined) this.setOptsForEach({k : opts.k});
        if (opts.size !== undefined) resizeFlag = true;
        if (opts.sides !== undefined) this.opts.sides = opts.sides;
        if (opts.onContact !== undefined) this.setOnContact(opts.onContact)
        if (opts.origin !== undefined) resizeFlag = true;
        if (resizeFlag) this.setSize(opts.size, opts.origin);
    };

    Walls.prototype.createSides = function(sides){
        this.sides = {};
        this.opts.sides = [];
        for (var i = 0; i < sides.length; i++){
            var side = sides[i];
            this.sides[i] = new Wall({
                n : SIDE_NORMALS[side].clone(),
                d : _getDistance(side, this.opts.size, this.opts.origin)
            });
            this.opts.sides[i] = side;
        };
    };

    Walls.prototype.setSize = function(size, origin){
        origin = origin || this.opts.origin;
        if (origin.length < 3) origin[2] = 0.5;

        this.forEach(function(wall, side){
            var d = _getDistance(side, size, origin);
            wall.setOpts({d : d});
        });

        this.opts.size   = size;
        this.opts.origin = origin;
    };

    Walls.prototype.setOptsForEach = function(opts){
        this.forEach(function(wall){ wall.setOpts(opts) });
        for (var key in opts) this.opts[key] = opts[key];
    };

    Walls.prototype.setOnContact = function(onContact){
        this.forEach(function(wall){
            wall.setOpts({onContact : onContact});
        });

        var sides = this.sides;
        switch (onContact){
            case Walls.ON_CONTACT.REFLECT:
                break;
            case Walls.ON_CONTACT.WRAP:
                this.forEach(function(wall){
                    wall.setOpts({onContact : onContact});
                    wall.on('wrap', function(data){
                        var particle = data.particle
                        var n = wall.opts.n;
                        var d = wall.opts.d;
                        switch (wall){
                            case Walls.RIGHT:
                                var d2 = sides.LEFT.opts.d;
                                break;
                            case Walls.LEFT:
                                var d2 = sides.TOP.opts.d;
                                break;
                            case Walls.TOP:
                                var d2 = sides.BOTTOM.opts.d;
                                break;
                            case Walls.BOTTOM:
                                var d2 = sides.TOP.opts.d;
                                break;
                        }
                        particle.p.add(n.mult(d + d2), particle.p);
                    });
                });
                break;
            case Walls.ON_CONTACT.ABSORB:
                break;
        };
        this.opts.onContact = onContact;
    };

    Walls.prototype.applyConstraint = function(particles, source, dt){
        this.forEach(function(wall){
            wall.applyConstraint(particles, source, dt);
        });
    };

    Walls.prototype.forEach = function(fn){
        for (var key in this.sides) fn(this.sides[key], key);
    };

    Walls.prototype.rotateZ = function(theta){
        this.forEach(function(wall){
            var n = wall.opts.n;
            n.rotateZ(theta).put(n);
        });
    };

    Walls.prototype.rotateX = function(theta){
        this.forEach(function(wall){
            var n = wall.opts.n;
            n.rotateX(theta).put(n);
        });
    };

    Walls.prototype.rotateY = function(theta){
        this.forEach(function(wall){
            var n = wall.opts.n;
            n.rotateY(theta).put(n);
        });
    };

    module.exports = Walls;
});