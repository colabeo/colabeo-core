define(function(require, exports, module) { 
    var View         = require('famous/View');
    var FM           = require('famous/Matrix');
 	var Surface      = require('famous/Surface');
    var Utility      = require('famous/Utility');
    var Modifier     = require('famous/Modifier');

    var Easing       = require('famous-animation/Easing');

    var AutoUI       = require('famous-ui/AutoUI');
    var RotateButton = require('famous-ui/Buttons/RotateButton');

    var Time         = require('famous-utils/Time');
    var Utils        = require('famous-utils/Utils');
    

    /*
     * @constructor
     */
    function UI () {

        View.apply(this, arguments);

        this.buttonOpacity = 0.25;

        this.uiShowMatrix;
        this.uiHideMatrix;

        this.shownPositions;
        this.hiddenPositions;

        this.button;
        this.buttonModifier;

        this.ui;
        this.uiModifier;

        this._uiAdded = false;
        this._uiVisible = false;

        this.positions();

        this.initButton();
        this.initUI();

        this.events();
        this.show();

    }

    UI.prototype = Object.create( View.prototype );
    UI.prototype.constructor = UI;

    UI.DEFAULT_OPTIONS = { 
        buttonSize: [40, 40],
        offset: [20, 20],             
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
        }
    }

    UI.prototype.positions = function () {

        this.uiShowMatrix = FM.translate( 
            this.options.offset[0],
            this.options.offset[1] * 1.75 + this.options.buttonSize[1],
            0); 

        this.uiHideMatrix = FM.multiply(
            FM.scale(1.0, 0.0001, 1.0), 
            this.uiShowMatrix); 

        this.shownPositions = { 
            button: FM.translate( 
                this.options.offset[0], 
                this.options.offset[1], 
                0)
        };

        this.hiddenPositions = {
            button: FM.translate( 
                this.options.offset[0], 
                - (this.options.buttonSize[0] + this.options.offset[1]), 
                0)
        }

    }    
    // INITS
    UI.prototype.initButton = function () {

        this.button = new RotateButton({
            surfaceOptions: {
                properties: {
                    'background-color': 'rgba( 0, 0, 0, 0.0)',
                },
                content: '<img draggable="false" class="no-user-select" src="js/core/plus.svg" height="'+this.options.buttonSize[1]+'"></img>',
                size: this.options.buttonSize
            }
        }); 

        this.buttonModifier = new Modifier({
            size: this.options.buttonSize,
            transform: this.hiddenPositions.button,
            opacity: this.buttonOpacity
        });

        this.node.add( this.buttonModifier ).link( this.button );
    }

    UI.prototype.initUI = function () {

        this.ui = new AutoUI();

        this.uiModifier = new Modifier({             
            transform: this.uiHideMatrix,
            opacity: 0
        });

        this.node.add( this.uiModifier ).link( this.ui );

    }

    // EVENTS
    UI.prototype.events = function () {
        this.button.on( 'open', this.showUI.bind( this ) );  
        this.button.on( 'close', this.hideUI.bind( this ) ); 
    }

    UI.prototype.mousemove = function ( event, threshold ) {
        var buttonDistance = Utils.distance(event.x, event.y, this.buttonX, this.buttonY);
        if(buttonDistance < threshold || this.uiModifier.getOpacity() > 0.01)
        {
            if(this.buttonOpacity != 1.0)
            {
                this.buttonOpacity = 1.0; 
                this.buttonModifier.halt(); 
                this.buttonModifier.setOpacity(this.buttonOpacity, this.options.hoverTransition);   
            }            
        }    
        else
        {
            if(this.buttonOpacity != 0.5)
            {
                this.buttonOpacity = 0.5; 
                this.buttonModifier.halt(); 
                this.buttonModifier.setOpacity(this.buttonOpacity, this.options.hoverTransition);   
            }
        }
    }

    UI.prototype.resize = function(event) { 
        this.positions();
    }


    // SHOWS / HIDES
    UI.prototype.showAll = function () {
        if( this._uiVisible ) this.button.open(); 
        this.show();
    }

    UI.prototype.hideAll = function () {
        if( this._uiVisible ) this.button.close();
        this.hide();
    }
    
    UI.prototype.showUI = function () {
        this._uiVisible = true;
        this.uiModifier.halt();
        this.uiModifier.setTransform( this.uiShowMatrix, this.options.uiScaleTransition );
        this.uiModifier.setOpacity( 1, this.options.uiFadeTransition ); 
        this.eventOutput.emit('showUI');
    }; 
    
    UI.prototype.hideUI = function () {
        this._uiVisible = false;

        this.uiModifier.halt();
        this.uiModifier.setTransform( this.uiHideMatrix, this.options.uiScaleTransition );
        this.uiModifier.setOpacity( 0, this.options.uiFadeTransition ); 
        this.eventOutput.emit('hideUI');
    };    

    UI.prototype.show = function () {

        var mtx = this.shownPositions.button,
            buttonSize = this.options.buttonSize;

        this.buttonX = mtx[12] + buttonSize[0] * 0.5; 
        this.buttonY = mtx[13] + buttonSize[1] * 0.5;
        
        this.buttonModifier.halt(); 
        this.buttonModifier.setTransform( mtx, this.options.uiFadeTransition );                
    }

    UI.prototype.hide = function () {

        var mtx = this.hiddenPositions.button,
            buttonSize = this.options.buttonSize;

        this.buttonX = mtx[12] + buttonSize[0] * 0.5; 
        this.buttonY = mtx[13] + buttonSize[1] * 0.5;
        
        this.buttonModifier.halt(); 
        this.buttonModifier.setTransform( mtx, this.options.uiFadeTransition );                
    }
    // SETS
    UI.prototype.setCurrentObject = function (obj) {

        this.ui.setCurrentObject(obj); 

    }

    module.exports = UI;

});
