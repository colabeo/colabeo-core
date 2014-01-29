define(function(require, exports, module) {
    var Matrix = require('famous/Matrix');
    var OptionsManager = require('famous/OptionsManager');
    var Transitionable = require('famous/Transitionable');
    var Utility = require('famous/Utility');
    var SequentialLayout = require('./SequentialLayout');

    /**
     * @constructor
     */
    function Deck(options) {
        SequentialLayout.apply(this, arguments);
        this.state = new Transitionable(0);
        this._isOpen = false;

        this.setOutputFunction(function(input, offset, index) {
            var state = this.getState();
            var positionMatrix = (this.options.direction === Utility.Direction.X) ? 
                Matrix.translate(state * offset, 0, 0.001 * (state - 1) * offset) : 
                Matrix.translate(0, state * offset, 0.001 * (state - 1) * offset);
            var output = input.render();
            if(this.options.stackRotation) {
                var amount = this.options.stackRotation * index * (1 - state);
                output = {
                    transform: Matrix.rotateZ(amount),
                    origin: [0.5, 0.5],
                    target: output
                }
            }
            return {
                transform: positionMatrix,
                size: input.getSize(),
                target: output
            };
        });
    };
    Deck.prototype = Object.create(SequentialLayout.prototype);
    Deck.prototype.constructor = Deck;

    Deck.DEFAULT_OPTIONS = OptionsManager.patch(SequentialLayout.DEFAULT_OPTIONS, {
        transition: {
            curve: 'easeOutBounce',
            duration: 500
        },
        stackRotation: 0
    });

    Deck.prototype.getSize = function() {
        var originalSize = SequentialLayout.prototype.getSize.apply(this, arguments);
        var firstSize = this._items ? this._items.get().getSize() : [0, 0];
        if(!firstSize) firstSize = [0, 0];
        var state = this.getState();
        var invState = 1 - state;
        return [firstSize[0] * invState + originalSize[0] * state, firstSize[1] * invState + originalSize[1] * state];
    };

    Deck.prototype.getState = function(returnFinal) {
        if(returnFinal) return this._isOpen ? 1 : 0;
        else return this.state.get();
    };

    Deck.prototype.setState = function(pos, transition, callback) {
        this.state.halt();
        this.state.set(pos, transition, callback);
    };

    Deck.prototype.open = function(callback) {
        this._isOpen = true;
        this.setState(1, this.options.transition, callback);
    };

    Deck.prototype.close = function(callback) {
        this._isOpen = false;
        this.setState(0, this.options.transition, callback);
    };

    Deck.prototype.toggle = function(callback) {
        if(this._isOpen) this.close(callback);
        else this.open(callback);
    };

    module.exports = Deck;
});
