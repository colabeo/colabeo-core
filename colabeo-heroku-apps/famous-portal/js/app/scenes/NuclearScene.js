define(function(require, exports, module) {  	
    // Famous
    var Surface             = require('famous/Surface'); 
    var FM                  = require('famous/Matrix');  	
    var Modifier            = require('famous/Modifier');
    var Engine              = require('famous/Engine');
    // Utils
    var Utils               = require('famous-utils/Utils');
    // Feedback
    var Lasers              = require('famous-feedback/Circle');
    // Widgets
    var TorqueRenderable    = require('app/widgets/TorqueRenderable');
    var SplitImages         = require('app/widgets/SplitImages');
    // Scene
    var SceneTransitions    = require('app/SceneTransitions'); 
 	var Scene               = require('famous-scene/Scene');
    // Core UI
    var Interface           = require('core/Interface');
    // COUNTER!
    var CounterView         = require('app/scenes/CounterView');
    // Physics!!
    var Transitionable      = require('famous/Transitionable');
    var PhysicsTrans        = require('famous-physics/utils/PhysicsTransition');
    Transitionable.registerMethod('physics', PhysicsTrans);
    // SOUNDS
    var SoundPlayer = require('famous-audio/SoundPlayer'); 
    
    function NuclearScene() {
        document.body.style.backgroundColor = '#222';
        
        Scene.apply(this, arguments);

        // Button
        this.split;
        this.torque;

        // UI
        this.ui;
        this.autoUI;
        this.labelProperties;
        this.descriptionProperties;

        // Feedback
        this.lasers;

        // Alarm
        this.alarmSurface;
        this.alarmMod;
        this._shoudlHighlight;

        this.initLasers();
        this.initButton();
        this.initAlarm();
        this.initUI();

        this.events();
    }

    NuclearScene.prototype = Object.create(Scene.prototype);
	NuclearScene.prototype.constructor = NuclearScene;

    NuclearScene.NAME = 'The Countdown';
    NuclearScene.IMAGE = 'img/splitImage4/nuclear.svg';

    NuclearScene.DEFAULT_OPTIONS = { 
        torqueSize: [400, 400],
        alarmDelay: 1000,
        alarmCurve: { 
            curve: 'outSineNorm',
            duration: 1000
        }
    }

    NuclearScene.prototype.events = function  () {

        Engine.on('resize', Utils.debounce( this.setTorquePos.bind(this), 150));
        this.torque.on('forceApplied', CounterView.add.bind( CounterView, 1));
        this.split.pipe( this.lasers );
        
    }

    NuclearScene.prototype.setTorquePos = function  () {
        this.torque.setTransform( FM.translate( 
            window.innerWidth * 0.5 - this.options.torqueSize[0] * 0.5, 
            window.innerHeight * 0.5 - this.options.torqueSize[1] * 0.5), { 
                curve: 'inOutBackNorm',
                duration: 500
        });
    }

    NuclearScene.prototype.initLasers= function  () {

        this.lasers = new Lasers();
        this.node.add( this.lasers );

    }

    NuclearScene.prototype.initAlarm = function  () {

        this.alarmSurface = new Surface({
            classes: ['alarm-bg'],
            properties: { 
                'pointerEvents': 'none'
            }
        });

        this.alarmMod = new Modifier({
            opacity: 0,
            transform: FM.translate(0, 0, -1 )
        });

        this._shoudlHighlight = true;

        this.node.add( this.alarmMod ).link( this.alarmSurface );
        
        var highlight = (function () {
            var callback = this._shoudlHighlight ? unhighlight : undefined;
            this.alarmMod.setOpacity( 1, this.options.alarmCurve, callback ) 
        }).bind(this);

        var unhighlight = (function () {
            var callback = this._shoudlHighlight ? highlight : undefined;
            this.alarmMod.setOpacity( 0, this.options.alarmCurve, callback ) 
        }).bind(this);

        highlight();

    }

    NuclearScene.prototype.initButton = function  () {
        this.split = new SplitImages({
            images: [
                'img/splitImage4/0.svg',
                'img/splitImage4/1.svg',
                'img/splitImage4/2.svg',
                'img/splitImage4/3.svg',
                'img/splitImage4/4.svg'
            ],
            depth: 20,
            size: this.options.torqueSize 
        });
        
        this.torque = new TorqueRenderable({
            views: [this.split],
            forceStrength: 0.50,
            forceSpringDamping: 0.35,
            forceSpringPeriod: 1100,
            torqueStrength: 0.2,
            torquePeriod: 12
        });

        this.setTorquePos();

        this.node.add( this.torque );
    }

    NuclearScene.prototype.initUI = function  () {
        this.labelProperties = { 
            'borderBottom' : '1px solid white',
            'color' : 'rgba( 255, 255, 255, 1 )',
            'fontSize': '16px'      
        }   

        this.descriptionProperties = { 
            'color' : 'rgba( 200, 200, 200, 1 )',
            'fontSize': '14px'      
        }

        this.autoUI = [
            { 
                type: 'label',
                uiOptions: { 
                    content: 'IMAGE',
                    properties: this.labelProperties
                }
            },
            { 
                type: 'label',
                uiOptions: { 
                    content: 'This changes the scale of the layers of images.',
                    properties: this.descriptionProperties
                }
            },
            {
                type: 'slider',
                callback: this.split.setDepth.bind( this.split ), 
                uiOptions: {
                    range: [0, 100],
                    name: 'Depth',
                    defaultValue: this.split.options.depth
                }
            },
            { 
                type: 'label',
                uiOptions: { 
                    content: 'TORQUE SPRING',
                    properties: this.labelProperties
                }
            },
            { 
                type: 'label',
                uiOptions: { 
                    content: 'Torque controls the rotation of the button.',
                    properties: this.descriptionProperties
                }
            },
            {
                type: 'slider',
                object: this.torque.options,
                key: 'torquePeriod',
                callback: this.torque.setTorqueSpringOpts.bind( this.torque ), 
                uiOptions: {
                    range: [0.5, 15],
                    name: 'Duration',
                    defaultValue: this.torque.options.torquePeriod
                }
            },
            {
                type: 'slider',
                object: this.torque.options,
                key: 'torqueStrength',
                callback: this.torque.setTorque.bind( this.torque ), 
                uiOptions: {
                    range: [0.00005, 0.5],
                    name: 'Force',
                    defaultValue: this.torque.options.torqueStrength
                }
            },
            { 
                type: 'label',
                uiOptions: { 
                    content: 'FORCE SPRING',
                    properties: this.labelProperties
                }
            },
            { 
                type: 'label',
                uiOptions: { 
                    content: 'Force controls the depth of the button when it is clicked.',
                    properties: this.descriptionProperties
                }
            },
            {
                type: 'slider',
                object: this.torque.options,
                key: 'forceStrength',
                callback: this.torque.setForce.bind( this.torque ), 
                uiOptions: {
                    range: [0.05, 5],
                    name: 'Force Strength',
                    defaultValue: this.torque.options.forceStrength
                }
            },
            {
                type: 'slider',
                object: this.torque.options,
                key: 'forceSpringDamping',
                callback: this.torque.setForceSpringOpts.bind( this.torque ), 
                uiOptions: {
                    range: [0.00005, 0.9],
                    name: 'Force Spring Damping',
                    defaultValue: this.torque.options.forceSpringDamping
                }
            },
            {
                type: 'slider',
                object: this.torque.options,
                key: 'forceSpringPeriod',
                callback: this.torque.setForceSpringOpts.bind( this.torque ), 
                uiOptions: {
                    range: [100, 2000],
                    name: 'Force Spring Period',
                    defaultValue: this.torque.options.forceSpringPeriod
                }
            }
        ]        

        this.ui = new Interface();
        Engine.pipe( this.ui );
        this.ui.setCurrentObject( this );

        this.node.add( this.ui );
    }

    NuclearScene.prototype.activate = function ( callback, direction ) {
        if( direction == 'next' ) { 
            SceneTransitions.sceneFadeInLeft( callback );
        } else { 
            SceneTransitions.sceneFadeInRight( callback );
        }
    }

    NuclearScene.prototype.deactivate = function ( callback, direction ) {
        if( direction == 'next' ) { 
            SceneTransitions.sceneFadeLeft( callback );
        } else { 
            SceneTransitions.sceneFadeRight( callback );
        }
    }

    module.exports = NuclearScene;
});

