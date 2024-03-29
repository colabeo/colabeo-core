define(function(require, exports, module) {
    var Scrollview  = require('famous-views/Scrollview');
        
    /*
     *  PanelScrollview takes UI widgets and puts them into a scrollview. 
     *
     *  UI WIDGET REQUIREMENTS:
     *  function init: initialize the widget, creating surfaces.
     *      This is a requirement so the PanelScrollview can auto size the widgets
     *      if they are not set in the user's options of each widget. This gives
     *      the user flexibility to not worry about sizing, or to customize it
     *      if needed. 
     *  function getSize: return the entire size of the widget.
     *  function setSize: set the [width, sliderHeight] of the widget.
     *  function pipe: pipe events to the scrollview.
     *  function render: render the widget.
     *  function get: return the current value of the widget.
     *  function set: set the value of the widget.
     */
    function PanelScrollview( panelOpts ) {

        this.panelOpts = Object.create(PanelScrollview.DEFAULT_OPTIONS)
        if (panelOpts) { this.setPanelOptions(panelOpts) };

        Scrollview.call( this, this.panelOpts.scrollviewOptions );

        this.uiItems = [];
        this._sequenced = false;

    }

    PanelScrollview.DEFAULT_OPTIONS = {
        scrollviewOptions: {
            direction: 'y',
            itemSpacing: 8
        },
        width: 256,
        sliderHeight: 16
    };

    PanelScrollview.prototype = Object.create( Scrollview.prototype );

    PanelScrollview.prototype.setPanelOptions = function(options) {
        for (var key in PanelScrollview.DEFAULT_OPTIONS) {
            if(options[key] !== undefined) this.panelOpts[key] = options[key];
        }
    }

    /**
     * Add a single object to the panel.
     * @private
     */
    function _addOne( obj ) {

        this.uiItems.push( obj );

        if( this._sequenced === false ) {
            this.sequenceFrom( this.uiItems );
            this._sequenced = true;
        }

        if( obj.getSize() === undefined && obj.setSize ) {
            obj.setSize([
                this.panelOpts.width,
                this.panelOpts.sliderHeight
                ]);
        }
        
        if( obj.init ) {
            obj.init();
        }

        if( obj.pipe ) {
            obj.pipe( this );
        }
    }

    PanelScrollview.prototype.reset = function () {
        this.uiItems = [];
        this._sequenced = false;
    };

    PanelScrollview.prototype.add = function ( obj ) {
        if (obj instanceof Array) {

            for (var i = 0; i < obj.length; i++) {
                _addOne.call( this, obj[i] );
            }

        } else {

            _addOne.call( this, obj );

        }
    };

    module.exports = PanelScrollview;
});
