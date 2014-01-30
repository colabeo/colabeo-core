define(function(require, exports, module) {  	
    // Famous
 	var Surface = require('famous/Surface'); 
 	var RenderNode = require('famous/RenderNode'); 
 	var FM = require('famous/Matrix');  	
    var FT = require('famous/Modifier');
    var Easing = require('famous-animation/Easing');
    var KeyCodes = require('famous-utils/KeyCodes');
    var Modifier = require('famous/Modifier');
    var Engine = require('famous/Engine');
    var Utils = require('famous-utils/Utils');
    var Time = require('famous-utils/Time');

    // Widgets
    var TorqueRenderable = require('app/widgets/TorqueRenderable');
    var SplitImages = require('app/widgets/SplitImages');
    var Lasers = require('famous-feedback/Lasers');
    var GridLayout = require('app/widgets/GridLayout');

    // Scene
 	var Scene = require('famous-scene/Scene');
    var SceneTransitions = require('app/SceneTransitions'); 

    // UI 
    var AutoUI = require('famous-ui/AutoUI');
    
    function TorqueScene() {
        document.body.style.backgroundColor = '#eee';
        
        Scene.apply(this, arguments);
        
        this.autoUI;
        this.labelProperties;
        this.descriptionProperties;

        //this.initUI();
        
        //this.ui = new AutoUI({ defaultSelected: this });

        this.torqueMod =  new Modifier({ 
            origin: [0.5, 0.5]
        });
        this.lasers = new Lasers();
        
        this.node.add( this.lasers );

        this.layout = new GridLayout({ 
            useScrollview: false,
            columnWidth: this.options.size[0],
            rowHeight: this.options.size[1]
        });
        var w = ~~(window.innerWidth / (this.options.size[0] - this.layout.options.topMargin));
        var h = ~~(window.innerHeight / (this.options.size[1] - this.layout.options.bottomMargin));
        this.options.numTiles = w * h;

        this.tileButtons();
            
    }

    TorqueScene.prototype = Object.create(Scene.prototype);
	TorqueScene.prototype.constructor = TorqueScene;

    TorqueScene.NAME = 'THE WARHOL';

    TorqueScene.DEFAULT_OPTIONS = { 
        size: [200, 200],
        torqueSize: [400, 400],
        numTiles : 50
    }

    TorqueScene.prototype.tileButtons = function  () {

        this.nodes = [];
        
        this._numNode = 0;

        for (var i = 0; i < this.options.numTiles; i++) {
            addNode.call( this );
        };

        function addNode () {
            var split = new SplitImages({
                images: [
                    'img/splitImage2/0.svg',
                    'img/splitImage2/1.svg',
                    'img/splitImage2/2.svg',
                    'img/splitImage2/3.svg',
                    'img/splitImage2/4.svg',
                    'img/splitImage2/5.svg',
                    'img/splitImage2/6.svg',
                    'img/splitImage2/7.svg'
                ],
                depth: 5,
                size: this.options.torqueSize,
                size: this.options.size
            });
            
            var torque = new TorqueRenderable({
                views: [split],
                size: this.options.size 
            });

            var node = new RenderNode();
            node.link( torque ).link( split );
            this.nodes.push( node );
            this.layout.append( node );
             
        }

        this.node.add( this.layout );
    }

    TorqueScene.prototype.initUI = function() { 
        this.labelProperties = { 
            'border-bottom' : '1px solid white',
            'color' : 'rgba( 255, 255, 255, 1 )',
            'font-size': '16px'      
        }

        this.descriptionProperties = { 
            'color' : 'rgba( 200, 200, 200, 1 )',
            'font-size': '14px'      
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
                    name: 'Torque Period',
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
                    name: 'Torque Strength',
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
    }
        
    TorqueScene.prototype.activate = function ( callback ) {
        SceneTransitions.sceneFadeInLeft( callback );
    }

    TorqueScene.prototype.deactivate = function ( callback ) {
        SceneTransitions.sceneFadeLeft( callback );
    }

    module.exports = TorqueScene;
});
