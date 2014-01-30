define(function(require, exports, module) {
    var Engine          = require('famous/Engine');
    var Surface         = require('famous/Surface');
    var Modifier        = require('famous/Modifier');
    var FM              = require('famous/Matrix');
    var Utility         = require('famous/Utility');

    var Scene           = require('famous-scene/Scene');
    var Utils           = require('famous-utils/Utils');
    var KeyCodes        = require('famous-utils/KeyCodes');

    var Easing          = require('famous-animation/Easing');
    var Time            = require('famous-utils/Time');

    // Physics!!
    var Transitionable  = require('famous/Transitionable');
    var PhysicsTrans    = require('famous-physics/utils/PhysicsTransition');
    Transitionable.registerMethod('physics', PhysicsTrans);

    var NextButton      = require('./NextButton');
    var Signup          = require('./Signup');
    var UI              = require('./UI');

    function Interface(options) 
    {        
        Scene.apply(this, arguments);              
        
        this.UI = new UI({ 
            offset: this.options.offset,
            buttonSize: this.options.buttonSize
        });

        this.nextButton = new NextButton({ 
            offset: this.options.offset,
            buttonSize: this.options.buttonSize
        });

        this.signup = new Signup({ 
            offset: this.options.offset,
            buttonSize: this.options.buttonSize,
            textInputScale: this.options.textInputScale,
            submitScale: this.options.submitScale
        });
    
        this._uiHidden = false;

        this.node.add( this.signup );
        this.node.add( this.nextButton ); 
        this.node.add( this.UI );

        this.nextButton.show(); 

        window.s = this;
    }
    
    Interface.prototype = Object.create(Scene.prototype);
	Interface.prototype.constructor = Interface;

    Interface.DEFAULT_OPTIONS = { 
        buttonSize: [40, 40],
        offset: [20, 20],             
        submitScale: 2,
        textInputScale: 6, 
        uiFadeTransition: {
            curve: Easing.inOutBackNorm,
            duration: 400
        }, 
        uiScaleTransition: {
            curve: Easing.inOutCubicNorm,
            duration: 400
        }, 
        hoverTransition: { 
            curve: Easing.inOutSineNorm, 
            duration: 800 
        },
        hideAllTransition: { 
            curve: Easing.inOutBackNorm,
            duration: 800
        },
    }


    Interface.prototype.hideAllUI = function () {
        this._uiHidden = true;

        this.signup.hideAll();
        this.UI.hideAll();
        this.nextButton.hideAll();
    }

    Interface.prototype.showAllUI = function () {
        this._uiHidden = false;

        this.signup.showAll();
        this.UI.showAll();
        this.nextButton.showAll();
    }

    Interface.prototype.setCurrentObject = function(obj) {

        this.UI.setCurrentObject( obj );

    };    

    Interface.prototype.resize = function(event) 
    {
        this.width = Utils.getWidth(); 
        this.height = Utils.getHeight();
        
        if( !this._uiHidden) {
            this.signup.showLogo(); 
        }
        
        this.nextButton.resize();
        this.signup.resize();
        this.UI.resize();
    }; 

    Interface.prototype.mousemove = function(event) 
    {        
        if (this._uiHidden) return;

        var threshold = Math.max(this.height/3.0, 
            this.options.buttonSize[0] * (this.options.textInputScale + this.options.submitScale) + 
            this.options.offset[0]*3);

        this.UI.mousemove( event, threshold );
        this.nextButton.mousemove( event, threshold );
        this.signup.mousemove( event, threshold );
        
    };

    Interface.prototype.update = function()
    {
        if(!this.initForm) {

            this.initForm = this.signup.formEvents() ?  true : false;

        }        
    }; 
    
    module.exports = Interface;
});
