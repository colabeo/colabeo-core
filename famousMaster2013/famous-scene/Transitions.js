define(function(require, exports, module) 
{ 
    var Easing = require('famous-animation/Easing');
    var FM = require('famous/Matrix');

    module.exports = 
    { 
        popIn : function ( transform, callback ) {
            var curve = { 
                curve       : Easing.inOutExpoNorm,
                duration    : 1000
            };

            transform.halt();
            transform.setTransform( 
                FM.move(
                    FM.scale( 0.000001, 0.000001), 
                    [window.innerWidth * 0.5, window.innerHeight * 0.5]));
            
            transform.setTransform( FM.identity, curve, callback);
        },


        popOut: function ( transform, callback ) {
            var curve = {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 1000
                };

            transform.halt();
            transform.setTransform( 
                FM.move(FM.scale( 0.000001, 0.000001), 
                    [window.innerWidth * 0.5, window.innerHeight * 0.5]), 
                curve,
                callback
            );
        },

        fadeLeft: function ( transform, callback ) {
            var curve = {
                curve       : Easing.inOutExpoNorm,
                duration    : 1000
            };

            transform.halt();
            transform.setTransform( FM.translate( -window.innerWidth, 0, 0), curve, callback);
            transform.setOpacity( 0, curve); 
        },

        fadeInLeft: function ( transform, callback ) {
            var curve = {
                curve       : Easing.inOutExpoNorm,
                duration    : 1000
            };

            transform.halt();
            transform.setTransform( FM.translate( window.innerWidth, 0, 0));
            transform.setTransform( FM.identity, curve, callback);

            transform.setOpacity( 0 );
            transform.setOpacity( 1, curve); 
        },

        fadeRight: function ( transform, callback ) {
            var curve = {
                curve       : Easing.inOutExpoNorm,
                duration    : 1000
            };

            transform.halt();
            transform.setTransform( FM.translate( window.innerWidth, 0, 0), curve, callback);
            transform.setOpacity( 0, curve);             
        },

        fadeInRight : function ( transform, callback ) {
            var curve = {
                curve       : Easing.inOutExpoNorm,
                duration    : 1000
            };

            transform.halt();
            transform.setTransform( FM.translate( -window.innerWidth, 0, 0));
            transform.setTransform( FM.identity, curve, callback);

            transform.setOpacity( 0 );
            transform.setOpacity( 1, curve); 
        },
        
    };
});
