define(function(require, exports, module) {    
    var Surface = require('famous/Surface');
    var Engine = require('famous/Engine');
    var EventHandler = require('famous/EventHandler');

    /*
     * Auto sizing label / description.
     * To accompany slider, checkbox, etc.
     */
    function Label ( opts ) {
        this.options = { 
            size: undefined,  
            content: '',
            properties: {},
            classes: ['ui-label']
        }
        for( var key in opts ) this.options[ key ] = opts[key];

        this._resizeDirty;
        this.surface;

        this._checkHeight = checkHeight.bind(this);
    }

    Label.prototype.init = function () {

        this.surface = new Surface({
            size: this.options.size,
            content: '<div>' + this.options.content + '</div>',
            classes: this.options.classes,
            properties: this.options.properties
        });

        EventHandler.setInputHandler( this, this.surface);
        EventHandler.setOutputHandler( this, this.surface);

        this._setDirty();
    }

    Label.prototype.setContent = function ( content ) {
        this.options.content = content;
        this.surface.setContent('<div>' + this.options.content + '</div>');
    }

    Label.prototype.setSize = function (size) {
        this.options.size = [size[0], 0];
        this._setDirty();
    }

    Label.prototype._setDirty = function () {
        this._resizeDirty = true; 
        Engine.on('postrender', this._checkHeight );
    }

    Label.prototype.getSize = function () {
       return this.options.size ? this.options.size : undefined;
    }

    Label.prototype.render = function () {
        return this.surface.render();
    }

    function checkHeight() {
        if( this._resizeDirty ) { 
            if( this.surface._currTarget ) {
                this.options.size = [
                    this.options.size[0],
                    this.surface._currTarget.firstChild.clientHeight
                ]

                this.surface.setSize( this.options.size );
                
                this._resizeDirty = false;
            }
        }
    }

    module.exports = Label;
});
