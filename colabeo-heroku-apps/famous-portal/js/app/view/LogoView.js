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
    var SoundPlayer = require('famous-audio/SoundPlayer');
    var FontFeedback = require('famous-feedback/FontFeedback');
    var Easing = require('famous-animation/Easing');

    function LogoView() {
        Scene.apply(this, arguments);

        // Button
        this.split;
        this.torque;
        this.lasers;

        this.node.add(this.lasers );

        this.audio = new SoundPlayer([
            'sounds/punch_01.wav'
        ]);

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

        this.initLasers();

        this.setTorquePos();

        this.node.add( this.torque );

        this.events();
        this.torque.pipe( this.lasers );

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
        this.torque.on('forceApplied', this.audio.playSound.bind(this.audio, 0, 1 ));
    }


    LogoView.prototype.setTorquePos = function  () {
        this.torque.setTransform( FM.translate(
            150,
            window.innerHeight * 0.6 - this.options.torqueSize[1] * 0.5), {
            duration: 100
        });
    }

    LogoView.prototype.initLasers= function  () {

        this.lasers = new FontFeedback({
            fontContent: [
                'Jeff','Chapman','Lab','Bon','Shawn'
            ],
            fontProperties: {
                //'background-color': 'rgba( 255, 255, 255, 0.7)',
                //'background-color': '#a07cb7',
                'textAlign': 'center',
                'padding': '15px',
                'borderRadius': '5px',
                //'color': '#d94626'
                'color': '#51c8ee'
            },
            size: [320, 320],
            curve: {
                curve: Easing.outBackNorm,
                duration: 2000
            },
            opacityCurve: {
                curve: Easing.outSineNorm,
                duration: 2200
            },
            zDepth: 10
        });

        this.node.add(this.lasers );

    }

    module.exports = LogoView;
});