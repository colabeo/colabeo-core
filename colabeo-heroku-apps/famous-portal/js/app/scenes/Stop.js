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
    
    function StopScene() {
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

        this.initButton();
        this.initUI();
        this.initLasers();
        this.events();

    }

    StopScene.prototype = Object.create(Scene.prototype);
	StopScene.prototype.constructor = StopScene;

    StopScene.NAME = 'Stop Sign';
    StopScene.IMAGE = 'img/splitImage3/stop.svg';

    StopScene.DEFAULT_OPTIONS = { 
        torqueSize: [400, 400]
    }

    StopScene.prototype.events = function  () {

        this.torque.on('forceApplied', CounterView.add.bind( CounterView, 1));
        Engine.on('resize', Utils.debounce( this.setTorquePos.bind(this), 150));
        this.split.pipe( this.lasers );

    }

    StopScene.prototype.initButton = function  () {
        this.split = new SplitImages({
            images: [
                'img/splitImage3/0.svg',
                'img/splitImage3/1.svg'
            ],
            depth: 20,
            size: this.options.torqueSize 
        });
        
        this.torque = new TorqueRenderable({
            views: [this.split]
        }); 

        this.setTorquePos();

        this.node.add( this.torque );
        
    }

    StopScene.prototype.setTorquePos = function  () {
        this.torque.setTransform( FM.translate( 
            window.innerWidth * 0.5 - this.options.torqueSize[0] * 0.5, 
            window.innerHeight * 0.5 - this.options.torqueSize[1] * 0.5), { 
                curve: 'inOutBackNorm',
                duration: 500
        });
    }
    StopScene.prototype.initUI = function  () { 

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
    };

    StopScene.prototype.initLasers = function  () {

        this.lasers = new Lasers();
        this.node.add( this.lasers );
        
    }

    StopScene.prototype.activate = function ( callback ) {
        SceneTransitions.sceneFadeInLeft( callback );
    }

    StopScene.prototype.deactivate = function ( callback ) {
        SceneTransitions.sceneFadeLeft( callback );
    }

    module.exports = StopScene;
});
