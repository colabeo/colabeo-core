define(function(require, exports, module) {    
    var View                = require('famous/View');
    var FM                  = require('famous/Matrix');
    var Modifier            = require('famous/Modifier'); 
    var Easing              = require('famous-animation/Easing');

    var PanelScrollview     = require('famous-ui/PanelScrollview');
    var BoolToggle          = require('famous-ui/Toggles/BoolToggle');
    var MultiBoolToggle     = require('famous-ui/Toggles/MultiBoolToggle');
    var MultiEasingToggle   = require('famous-ui/Easing/MultiEasingToggle');
    var Dropdown            = require('famous-ui/Dropdown/Dropdown');
    var Slider              = require('famous-ui/Slider');
    var ColorPicker         = require('famous-ui/ColorPicker/ColorPicker');

    var Label               = require('famous-ui/Text/Label');

    /*
     *  // Annotated components of a single UI Definition: 
     *  {
     *      // type of element, mapped to UI_ELEMENTS
     *      type: 'slider', 
     *
     *      // key in this.options to change.
     *      key: 'pivotLayer',
     *
     *      // if the ui element is controlling a child view, 
     *      // pass the reference to it here.
     *      object: this.tiltShift,
     *      
     *      // options that are directly passed into the creation of the UI Widget
     *      uiOptions: { 
     *          range: [0, 9],
     *          precision: 0,
     *          name: 'Pivot Layer'
     *      },
     *
     *      // callback when change events are fired,
     *      // passes the changed value directly.
     *      callback: function (value) { 
     *          console.log( this, value ); 
     *      }
     *  }
     *
     *
     *
     *  // Using an autoUI in an instance of a view: 
     *
     *  var View = require('famous/View');
     *  var Engine = require('famous/Engine');
     *  var mainCtx = Engine.createContext();
     *  mainCtx.setPerspective(1000);
     *
     *  function CustomView() {
     *      View.apply( this, arguments );
     *
     *      // the order of items in the autoUI definition 
     *      this.autoUI = [
     *          {
     *              type: 'slider', 
     *              key: 'value1',
     *              uiOptions: { 
     *                  range: [0, 10],
     *                  precision: 0,
     *                  name: 'Value 1'
     *              }
     *          },
     *          {
     *              type: 'toggle', 
     *              uiOptions: { 
     *                  defaultValue: false,
     *                  name: 'test'
     *              },
     *              callback: function (e) { 
     *                  console.log(e);
     *              }
     *          }
     *      ]
     *  }
     *
     *  CustomView.prototype = Object.create( View.prototype );
     *  CustomView.prototype.constructor = CustomView;
     *
     *  CustomView.DEFAULT_OPTIONS = { 
     *      value1: 10,
     *      value2: false
     *  }
     *
     *  // creating the autoUI:
     *  var AutoUI = require('famous-ui/AutoUI');
     *
     *  var yourView = new CustomView();
     *  var ui = new AutoUI();
     *  // the the autoUI where to find the autoUI definition
     *  ui.setCurrentObject( yourView );
     *
     *  mainCtx.add(yourView);
     *  mainCtx.add(ui);
     *
     */

    var _ID = 0;

    function AutoPanel ( options ) {
        View.apply( this, arguments );
        this.eventInput.pipe( this.eventOutput );
        
        this.panel = new PanelScrollview( this.options.panelOptions );
        this.pipe( this.panel );
        this.autoUIElements = [];
        this.autoUIElementsMap = { };

        this.panelModifier = new Modifier({ transform: this.options.defaultMatrix });
        this._add( this.panelModifier ).link( this.panel );

        if( this.options.defaultSelected ) {
            this.setCurrentObject( this.options.defaultSelected );
        }
    }

    AutoPanel.prototype = Object.create( View.prototype );
    AutoPanel.prototype.constructor = AutoPanel;

    AutoPanel.DEFAULT_OPTIONS = { 
        saveValues: false,
        panelOptions: { },
        defaultSelected: undefined,
        defaultMatrix: FM.translate( 0, 0 ),
    }
    
    AutoPanel.UI_ELEMENTS = {
        'slider'            : Slider,
        'dropdown'          : Dropdown,
        'colorPicker'       : ColorPicker,
        'toggle'            : BoolToggle,
        'multiBoolToggle'   : MultiBoolToggle,
        'easing'            : MultiEasingToggle,
        'label'             : Label
    }; 

    AutoPanel.prototype.setCurrentObject = function ( obj, uiDefinition ) {
        if( obj !== this.currentObj ) { 

            this.currentObject = obj;

            uiDefinition = uiDefinition ? uiDefinition : obj.autoUI;

            addUI.call( this, uiDefinition );
        }
    }; 

    AutoPanel.prototype.setScrollviewOptions = function ( opts ) {
        return this.panel.setOptions( opts );
    }

    // TODO: Export options as JSON
    AutoPanel.prototype.toJSON = function () {
        var json = [];
        for (var i = 0; i < this.autoUIElements.length; i++) {

        };
    };

    AutoPanel.prototype.reset = function () {
        this.panel.reset();
        this.autoUIElements = [];
        this.autoUIElementsMap = {}; 
    };

    AutoPanel.prototype.getSize = function () {
        return [this.panel.panelOpts.width, undefined]; 
    }

    AutoPanel.prototype.clear = function ( callback ) {

        this.reset();
        if( callback) callback();

    }; 

    function addUI ( uiDefinition ) {

        for (var i = 0; i < uiDefinition.length; i++) {

            var def = uiDefinition[i];

            if ( def.type ) { 
                this._optionToUI( def );
            }                 
        }
    }

    AutoPanel.prototype._optionToUI = function ( uiDefinition ) {

        // Create the UI
        var Element = AutoPanel.UI_ELEMENTS[ uiDefinition.type ]; 
        var ui = new Element( uiDefinition.uiOptions );

        this.panel.add( ui );
        this.autoUIElements.push( ui );

        if( !this.autoUIElementsMap[uiDefinition.key] ) { 
            this.autoUIElementsMap[uiDefinition.key] = ui;
        } else {
            this.autoUIElementsMap[uiDefinition.key + _ID++] = ui;
        }

        // if there is a supplied key to map to a this.options object, 
        // or a class with an options manager
        if( uiDefinition.key ) {

            // if supplied object, use that as a reference, otherwise use
            // the current object.
            var currentObject = uiDefinition.object ? 
                uiDefinition.object : 
                this.currentObject;

            ui.on('change', (function ( key, callback, arg) {

                // if there is an optionsManager, change the value through that.
                if( this.optionsManager ) {

                    this.optionsManager.set( key, arg.value );

                // if there is a setOptions function, change the value through that function
                } else if( this.setOptions !== undefined ) { 

                    this.setOptions({ key: arg.value });

                // otherwise, just change it.
                } else if( this.options[key] ) { 

                    this.options[key] = arg.value;

                }

                if( callback ) callback.call( this, arg.value );

            }).bind( currentObject, uiDefinition.key, uiDefinition.callback ));

        // no key supplied, but there is a callback to call on changes
        } else if ( uiDefinition.callback ) {
            
            ui.on( 'change', (function (callback, arg) {
                
                callback.call( this, arg.value );

            }).bind( this.currentObject, uiDefinition.callback ));

        }
    };

    AutoPanel.prototype.getUIElementsMap = function() {
        return this.autoUIElementsMap; 
    }; 


    AutoPanel.prototype.get = function ( key ) {
        return this.autoUIElementsMap[key];
    }

    module.exports = AutoPanel;
});
