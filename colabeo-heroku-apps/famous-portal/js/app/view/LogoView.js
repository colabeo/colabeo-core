define(function(require, exports, module) {

    //Include Famous Repositories
    var FamousEngine = require('famous/Engine');
    var FM = require('famous/Matrix');

    //Include Physics: Engine, Forces, Utilties
    var PhysicsEngine = require('famous-physics/PhysicsEngine');

    var mainCtx = FamousEngine.createContext();

    var TorqueRenderable    = require('app/widgets/TorqueRenderable');
    var Scene               = require('famous-scene/Scene');
    var SplitImages         = require('app/widgets/SplitImages');
    var Utils               = require('famous-utils/Utils');

    function LogoView() {
        Scene.apply(this, arguments);

        // Button
        this.split;
        this.torque;

        this.split = new SplitImages({
            images: [
                'pics/0.svg',
                'pics/1.svg',
                'pics/2.svg',
                'pics/3.svg'
//                'img/splitImage4/4.svg'
            ],
            depth: 30,
            size: this.options.torqueSize
        });

        this.torque = new TorqueRenderable({
            views: [this.split],
            forceStrength: 0.50,
            forceSpringDamping: 1.35,
            forceSpringPeriod: 1100,
            torqueStrength: 0.1,
            torquePeriod: 3
        });

        this.setTorquePos();

        this.node.add( this.torque );

        this.events();
    }

    LogoView.prototype = Object.create(Scene.prototype);
    LogoView.prototype.constructor = LogoView;

    LogoView.DEFAULT_OPTIONS = {
        torqueSize: [400, 400],
        alarmDelay: 1000,
        alarmCurve: {
            curve: 'outSineNorm',
            duration: 1000
        }
    }

    LogoView.prototype.events = function  () {

    }

    LogoView.prototype.setTorquePos = function  () {
        this.torque.setTransform( FM.translate(
            150,
            window.innerHeight * 0.6 - this.options.torqueSize[1] * 0.5), {
            duration: 100
        });
    }

    module.exports = LogoView;
});