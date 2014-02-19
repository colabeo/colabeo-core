define(function(require, exports, module) 
{ 
    var SceneController = require('famous-scene/SceneController');
    var Easing = require('famous-animation/Easing');
    var FM = require('famous/Matrix');
    var Transitions = require('./Transitions');

    function SceneTransitions ( controller ) 
    {
		this.controller = controller;
	}

    SceneTransitions.prototype.setController = function ( controller ) 
    {
		this.controller = controller;
	};

    SceneTransitions.prototype.popIn = function ( callback, transition ) {
        Transitions.popIn( this.controller.getActiveTransform(), callback, transition );
    };

    SceneTransitions.prototype.popOut = function ( callback, transition ) {
        Transitions.popOut( this.controller.getActiveTransform(), callback, transition );
    };
    
    SceneTransitions.prototype.fadeLeft = function ( callback, transition ) {
        Transitions.fadeLeft( this.controller.getActiveTransform(), callback, transition );
    };

    SceneTransitions.prototype.fadeInLeft = function ( callback, transition ) {
        Transitions.fadeInLeft( this.controller.getActiveTransform(), callback, transition );
    };
    
    SceneTransitions.prototype.fadeRight = function ( callback, transition ) {
        Transitions.fadeRight( this.controller.getActiveTransform(), callback, transition );
    };

    SceneTransitions.prototype.fadeInRight = function ( callback, transition ) {
        Transitions.fadeInRight( this.controller.getActiveTransform(), callback, transition );
    }; 
    SceneTransitions.prototype.fadeIn = function ( callback, transition ) {
        Transitions.fadeIn( this.controller.getActiveTransform(), callback, transition );
    }; 
    SceneTransitions.prototype.fadeOut = function ( callback, transition ) {
        Transitions.fadeOut( this.controller.getActiveTransform(), callback, transition );
    }; 

    module.exports = SceneTransitions;
});
