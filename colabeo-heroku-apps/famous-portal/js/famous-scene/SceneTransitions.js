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

    SceneTransitions.prototype.popIn = function ( callback ) 
    {
        Transitions.popIn( this.controller.getActiveTransform(), callback );
    };

    SceneTransitions.prototype.popOut = function ( callback ) 
    {
        Transitions.popOut( this.controller.getActiveTransform(), callback );
    };
    
    SceneTransitions.prototype.sceneFadeLeft = function ( callback ) 
    {
        Transitions.fadeLeft( this.controller.getActiveTransform(), callback );
    };

    SceneTransitions.prototype.sceneFadeInLeft = function ( callback ) 
    {
        Transitions.fadeInLeft( this.controller.getActiveTransform(), callback );
    };
    
    SceneTransitions.prototype.sceneFadeRight = function ( callback ) 
    {
        Transitions.fadeRight( this.controller.getActiveTransform(), callback );
    };

    SceneTransitions.prototype.sceneFadeInRight = function ( callback ) 
    {
        Transitions.fadeInRight( this.controller.getActiveTransform(), callback );
    }; 

    module.exports = SceneTransitions;
});
