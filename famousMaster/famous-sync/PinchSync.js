define(function(require, exports, module) {
    var TwoFingerSync = require('./TwoFingerSync');

    /**
     * @class Handles piped in two-finger touch events to change position via pinching / expanding.
     *        Outputs an object with position, velocity, touch ids, and distance.
     * @description
     * @extends TwoFingerSync
     * @name ScaleSync
     * @constructor
     * @example
     * define(function(require, exports, module) {
     *     var Engine = require('famous/Engine');
     *     var Surface = require('famous/Surface');
     *     var Modifier = require('famous/Modifier');
     *     var FM = require('famous/Matrix');
     *     var PinchSync = require('famous-sync/PinchSync');
     *     var Context = Engine.createContext();
     *
     *     var surface = new Surface({
     *         size: [200,200],
     *         properties: {
     *             backgroundColor: 'red'
     *         }
     *     });
     *
     *     var modifier = new Modifier({
     *         transform: undefined
     *     });
     *
     *     var position = 0;
     *     var sync = new PinchSync(function(){
     *         return position;
     *     }, {direction: PinchSync.DIRECTION_Y});  
     *
     *     surface.pipe(sync);
     *     sync.on('update', function(data) {
     *         var edge = window.innerHeight - (surface.getSize()[1])
     *         if (data.p > edge) {
     *             position = edge;
     *         } else if (data.p < 0) {
     *             position = 0;
     *         } else {
     *             position = data.p;
     *         }
     *         modifier.setTransform(FM.translate(0, position, 0));
     *         surface.setContent('position' + position + '<br>' + 'velocity' + data.v.toFixed(2));
     *     });
     *     Context.link(modifier).link(surface);
     * });
     */
    function PinchSync(targetSync,options) {
        TwoFingerSync.call(this,targetSync,options);
        this._dist = undefined;
    }

    PinchSync.prototype = Object.create(TwoFingerSync.prototype);

    function _calcDist(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.sqrt(diffX*diffX + diffY*diffY);
    }

    PinchSync.prototype._startUpdate = function() {
        this._dist = _calcDist(this.posA, this.posB);
        this._vel = 0;
        this.output.emit('start', {count: event.touches.length, touches: [this.touchAId, this.touchBId], distance: this._dist});
    };

    PinchSync.prototype._moveUpdate = function(diffTime) {
        var currDist = _calcDist(this.posA, this.posB);
        var diffZ = currDist - this._dist;
        var veloZ = diffZ / diffTime;

        var prevPos = this.targetGet();
        var scale = this.options.scale;
        this.output.emit('update', {p: prevPos + scale*diffZ, v: scale*veloZ, touches: [this.touchAId, this.touchBId], distance: currDist});

        this._dist = currDist;
        this._vel = veloZ;
    };

    module.exports = PinchSync;
});
