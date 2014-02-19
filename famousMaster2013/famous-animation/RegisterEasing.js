define(function(require, exports, module) {
    var Easing = require('./Easing');
    var TweenTransition = require('famous/TweenTransition');

    /**
     * @class Helper function to register easing curves globally in an application
     *
     * @description 
     * @name RegisterEasing
     * @example
     * https://github.com/Famous/november-base/blob/93533eacdf930cb0c255b3e2eb1a81dd3c3b00cc/js/app.js
     */
    function getAvailableTransitionCurves() { 
        var normRe = /norm/gi;
        var keys = getKeys(Easing).filter(function(key){ return normRe.test(key); }).sort();
        var curves = {};
        for (var i = 0; i < keys.length; i++) {
            curves[keys[i]] = (Easing[keys[i]]);
        };
        return curves;
    }

    function getKeys(obj){
        var keys = [];
        for (key in obj) {
            if (obj.hasOwnProperty(key)){
                keys.push(key);
            }
        }
        return keys;
    };

    function registerKeys () {
        var curves = getAvailableTransitionCurves();
        for ( var key in curves ) {
            TweenTransition.registerCurve( key, curves[key] )
        };  
    }

    registerKeys();

});
