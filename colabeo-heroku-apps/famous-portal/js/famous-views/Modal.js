define(function(require, exports, module) {
        var Engine = require('famous/Engine');
        var Lightbox = require('famous-views/Lightbox');
        var EventHandler = require('famous/EventHandler');
        var OptionsManager = require('famous/OptionsManager');

        var context;

        var Modal = {
                lightbox: new Lightbox(),
                eventOutput: new EventHandler(),
                eventInput: new EventHandler(),
        };

        EventHandler.setOutputHandler(Modal, Modal.eventOutput);
        EventHandler.setInputHandler(Modal, Modal.eventInput);

        Modal.setOptions = function(options) {
                this.lightbox.setOptions(options);
        };

        Modal.getOptions = function() {
                return this.lightbox.getOptions();
        };

        Modal.show = function(target, transition) {
                if (!context) {
                        context = Engine.createContext();
                        context.srcNode.object = this.lightbox;
                }
                this.lightbox.show(target, transition, function() {
                        this.eventInput.emit('Modal displaying');
                }.bind(this));
        };

        Modal.hide = function(transition) {
                this.lightbox.hide(transition, function() {
                        this.eventOutput.emit('Modal hidden');
                }.bind(this));
        };


        module.exports = Modal;
});