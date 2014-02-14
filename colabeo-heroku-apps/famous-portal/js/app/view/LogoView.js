define(function(require, exports, module) {

    //Include Famous Repositories
    var FM = require('famous/Matrix');

    //Include Physics: Engine, Forces, Utilties
    var PhysicsEngine = require('famous-physics/PhysicsEngine');
    var Surface      = require('famous/Surface');
    var View      = require('famous/View');
    var RenderNode      = require('famous/RenderNode');
    var TorqueRenderable    = require('app/widgets/TorqueRenderable');
    var Scene               = require('famous-scene/Scene');
    var Utils               = require('famous-utils/Utils');
    var SoundPlayer = require('famous-audio/SoundPlayer');
    var FontFeedback = require('famous-feedback/FontFeedback');
    var Easing = require('famous-animation/Easing');

    function LogoView() {
        Scene.apply(this, arguments);

        // Button

        this.node.add(this.lasers );

        this.audio = new SoundPlayer([
            'sounds/sharp-beep-single.mp3'
        ]);


        var sequence = "Beepe".split('').map(function(item, index){
            var view = new View();
            var surface = new Surface({
                content: item,
                classes: ['title']
            });
            surface.pipe(this.eventOutput);
            view._add(surface);
            return view;
        }.bind(this));

        this.torque = new TorqueRenderable({
            views: sequence,
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
        torqueSize: [260, 260],
        alarmDelay: 1000,
        alarmCurve: {
            curve: 'outSineNorm',
            duration: 1000
        }
    };

    LogoView.prototype.events = function  () {
        this.torque.on('forceApplied', this.audio.playSound.bind(this.audio, 0, 1 ));
    };


    LogoView.prototype.setTorquePos = function  () {
        this.torque.setTransform( FM.translate(
            150,
            window.innerHeight * 0.6 - this.options.torqueSize[1] * 0.5), {
            duration: 100
        });
    };

    LogoView.prototype.initLasers= function  () {

        this.lasers = new FontFeedback({
            fontContent: [
                '<p class = fa-envelope>Beepe</p>',
                '<i class="fa fa-envelope fa-lg"></i>',
                '<p class = fa-facebook-square>Beepe</p>',
                '<i class="fa fa-facebook-square fa-lg"></i>',
                '<p class = fa-google-plus-square>Beepe</p>',
                '<i class="fa fa-google-plus-square fa-lg"></i>',
                '<p class = fa-linkedin-square>Beepe</p>',
                '<i class="fa fa-linkedin-square fa-lg"></i>',
                '<p class = fa-github>Beepe</p>',
                '<i class="fa fa-github fa-lg"></i>'
            ],
            fontProperties: {
                'color': '#51c8ee'
            },
            fontClasses:['colabeo-logo-feedback-font'],
            size: [100, 50],
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

    };

    module.exports = LogoView;
});