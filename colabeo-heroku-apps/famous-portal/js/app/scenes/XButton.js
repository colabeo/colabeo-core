define(function(require, exports, module) {  	
    // Famous
 	var FamousSurface = require('famous/Surface'); 
 	var FM = require('famous/Matrix');  	
    var FT = require('famous/Modifier');
    var Modifier = require('famous/Modifier');
    var Engine = require('famous/Engine');
    
    var Easing = require('famous-animation/Easing');
    var KeyCodes = require('famous-utils/KeyCodes');
    var Utils = require('famous-utils/Utils');
    var TorqueRenderable = require('app/widgets/TorqueRenderable');
    var SplitImages = require('app/widgets/SplitImages');
    var Lasers = require('famous-feedback/Circle');
    var SceneTransitions = require('app/SceneTransitions'); 

    // COUNTER!
    var CounterView = require('app/scenes/CounterView');

    // Scene
 	var Scene = require('famous-scene/Scene');

    // UI 
    var Interface = require('core/Interface');
    
    function XButtonScene() {
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

        this.initLasers();
        this.initButton();
        this.initUI();

        // feedback
        
        this.events();
    }
    XButtonScene.prototype = Object.create(Scene.prototype);
	XButtonScene.prototype.constructor = XButtonScene;

    XButtonScene.NAME = 'The Big X';
    XButtonScene.IMAGE = 'img/splitImage/xButton.svg';

    XButtonScene.DEFAULT_OPTIONS = { 
        torqueSize: [400, 400]
    }

    XButtonScene.prototype.events = function  () {

        this.torque.on('forceApplied', CounterView.add.bind( CounterView, 1));
        this.split.pipe( this.lasers );
        Engine.on('resize', Utils.debounce( this.setTorquePos.bind(this), 150));

    }

    XButtonScene.prototype.setTorquePos = function () {
        this.torque.setTransform( FM.translate( 
            window.innerWidth * 0.5 - this.options.torqueSize[0] * 0.5, 
            window.innerHeight * 0.5 - this.options.torqueSize[1] * 0.5), { 
                curve: 'inOutBackNorm',
                duration: 500
        });
    }

    XButtonScene.prototype.initButton = function  () {

        this.split = new SplitImages({
            images: [
                'img/splitImage/0.svg',
                'img/splitImage/1.svg',
                'img/splitImage/2.svg',
            ],
            depth: 20,
            size: this.options.torqueSize 
        });

        // torque
        this.torque = new TorqueRenderable({
            views: [this.split],
            torqueStrength: 0.0,
            forceStrength: 0.6
        });

        this.setTorquePos();

        this.node.add( this.torque );
        
    }

    XButtonScene.prototype.initUI = function  () {
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

    XButtonScene.prototype.initLasers = function  () {

        this.lasers = new Lasers();
        this.node.add( this.lasers );
        
    }

    XButtonScene.prototype.activate = function ( callback ) {
        SceneTransitions.sceneFadeInLeft( callback );
    }

    XButtonScene.prototype.deactivate = function ( callback ) {
        SceneTransitions.sceneFadeLeft( callback );
    }

    module.exports = XButtonScene;
});
