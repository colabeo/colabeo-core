define(function(require, exports, module) {
    var TwoFingerSync = require('./TwoFingerSync');

    /**
     * @class Handles piped in two-finger touch events to support rotation.
     *        Outputs an object with position, velocity, touch ids, and angle.
     * @description
     * @extends TwoFingerSync
     * @name RotateSync
     * @constructor
     * @example
     * define(function(require, exports, module) {
     *     var Engine = require('famous/Engine');
     *     var RotateSync = require('famous-sync/RotateSync');
     *     var Surface = require('famous/Surface');
     *     var Modifier = require('famous/Modifier');
     *     var FM = require('famous/Matrix');
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
     *     var sync = new RotateSync(function(){
     *         return position;
     *     }, {direction: RotateSync.DIRECTION_Y});
     *
     *     surface.pipe(sync);
     *     sync.on('update', function(data) {
     *         position = data.p;
     *         modifier.setTransform(FM.rotateZ(position));
     *         surface.setContent('position' + position + '<br>' + 'velocity' + data.v.toFixed(2) + '<br>' + 'distance' + data.distance);
     *     });
     *     Context.link(modifier).link(surface);
     * });
     */
    function RotateSync(targetSync,options) {
        TwoFingerSync.call(this,targetSync,options);
        this._angle = undefined;
    }

    RotateSync.prototype = Object.create(TwoFingerSync.prototype);

    function _calcAngle(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.atan2(diffY, diffX);
    };

    RotateSync.prototype._startUpdate = function() {
        this._angle = _calcAngle(this.posA, this.posB);
        this._vel = 0;
        this.output.emit('start', {count: event.touches.length, touches: [this.touchAId, this.touchBId], angle: this._angle});
    };

    RotateSync.prototype._moveUpdate = function(diffTime) {
        var currAngle = _calcAngle(this.posA, this.posB);
        var diffTheta = currAngle - this._angle;
        var velTheta = diffTheta / diffTime;

        var prevPos = this.targetGet();
        var scale = this.options.scale;
        this.output.emit('update', {p: prevPos + scale*diffTheta, v: scale*velTheta, touches: [this.touchAId, this.touchBId], angle: currAngle});

        this._angle = currAngle;
        this._vel = velTheta;
    };

    module.exports = RotateSync;
});
