define(function(require, exports, module) {
    var Engine = require('famous/Engine');
    var LightBox = require('famous-views/LightBox');
    var EventHandler = require('famous/EventHandler');

    var context;
    var eventOutput = new EventHandler();

    var Modal = {
        lightBox: new LightBox()
    };

    EventHandler.setOutputHandler(Modal, eventOutput);

    Modal.setOptions = function(options) {
        this.lightBox.setOptions(options);
    };

    Modal.getOptions = function() {
        return this.lightBox.getOptions();
    };

    Modal.show = function(target, transition) {
        if(!context) {
            context = Engine.createContext();
            context.link(this.lightBox);
        }
        this.lightBox.show(target, transition, function() {
            eventOutput.emit('show');
        }.bind(this));
    };

    Modal.hide = function(transition) {
        this.lightBox.hide(transition, function() {
            eventOutput.emit('hide');
        }.bind(this));
    };

    module.exports = Modal;
});
