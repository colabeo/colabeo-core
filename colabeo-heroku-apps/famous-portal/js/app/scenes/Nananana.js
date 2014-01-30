define(function(require, exports, module) {  	
    // Famous
    var FamousSurface = require('famous/Surface'); 
    var FM = require('famous/Matrix');  	
    var FT = require('famous/Modifier');
    var Modifier = require('famous/Modifier');
    var Engine = require('famous/Engine');
    
    var RegisterEasing = require('famous-animation/RegisterEasing');
    var KeyCodes = require('famous-utils/KeyCodes');
    var Utils = require('famous-utils/Utils');
    var TorqueRenderable = require('app/widgets/TorqueRenderable');
    var SplitImages = require('app/widgets/SplitImages');
    var SceneTransitions = require('app/SceneTransitions'); 
    var Interface = require('core/Interface');

    var FontFeedback = require('famous-feedback/FontFeedback');

    // Physics!!
    var Transitionable  = require('famous/Transitionable');
    var PhysicsTrans    = require('famous-physics/utils/PhysicsTransition');
    Transitionable.registerMethod('physics', PhysicsTrans);

    // SOUNDS
    var SoundPlayer = require('famous-audio/SoundPlayer'); 

    // Scene
 	var Scene = require('famous-scene/Scene');
    // COUNTER!
    var CounterView = require('app/scenes/CounterView');

    // UI 
    var AutoUI = require('famous-ui/AutoUI');
    
    function BatmanScene() {
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

        // Audio
        this.audio;

        this.initLasers();
        this.initAudio();
        this.initButton();
        this.initUI();

        this.events();
    }

    BatmanScene.prototype = Object.create(Scene.prototype);
	BatmanScene.prototype.constructor = BatmanScene;

    BatmanScene.NAME = 'Ono-mato-poeia';
    BatmanScene.IMAGE = 'img/splitImage5/batman.svg';

    BatmanScene.DEFAULT_OPTIONS = { 
        torqueSize: [400, 400]
    }

    BatmanScene.prototype.events = function  () {

        this.torque.on('forceApplied', CounterView.add.bind( CounterView, 1));

        this.torque.on('forceApplied', this.audio.playSound.bind(this.audio, 0, 1 ));

        this.torque.pipe( this.lasers );

        Engine.on('resize', Utils.debounce( this.setTorquePos.bind(this), 150));
        
    }

    BatmanScene.prototype.setTorquePos = function  () {
        this.torque.setTransform( FM.translate( 
            window.innerWidth * 0.5 - this.options.torqueSize[0] * 0.5, 
            window.innerHeight * 0.5 - this.options.torqueSize[1] * 0.5), { 
                curve: 'inOutBackNorm',
                duration: 500
        });
    }

    BatmanScene.prototype.initLasers= function  () {

        this.lasers = new FontFeedback({
            fontContent: [ 
                'h', 'j', 'k', 'l','q', 's', 'z', '0', '5', 'u', 'C', 'D', 'G', 'J', 'L'
            ],
            fontProperties: { 
                //'background-color': 'rgba( 255, 255, 255, 0.7)',
                //'background-color': '#a07cb7',
                'textAlign': 'center',
                'padding': '15px',
                'borderRadius': '5px',
                //'color': '#d94626'
                'color': '#51c8ee',
            },
            size: [320, 320],
            curve: { 
                curve: 'outBackNorm',
                duration: 2000
            },
            opacityCurve: { 
                curve: 'outSineNorm',
                duration: 2200
            },
            zDepth: 10
        });

        this.node.add(this.lasers );

    }

    BatmanScene.prototype.initAudio = function  () {

        this.audio = new SoundPlayer([
            'sounds/punch_02.wav'
        ]); 

    }

    BatmanScene.prototype.initButton = function  () {
        this.split = new SplitImages({
            images: [
                'img/splitImage5/0.svg',
                'img/splitImage5/1.svg'
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

    BatmanScene.prototype.initUI = function  () {
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

    BatmanScene.prototype.activate = function ( callback, direction ) {
        if( direction == 'next' ) { 
            SceneTransitions.sceneFadeInLeft( callback );
        } else { 
            SceneTransitions.sceneFadeInRight( callback );
        }
    }

    BatmanScene.prototype.deactivate = function ( callback, direction ) {
        if( direction == 'next' ) { 
            SceneTransitions.sceneFadeLeft( callback );
        } else { 
            SceneTransitions.sceneFadeRight( callback );
        }
    }

    module.exports = BatmanScene;
});
