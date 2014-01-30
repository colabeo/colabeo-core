define(function(require, exports, module) {
    var Surface = require('./Surface');

    /**
     * @class VideoSurface.
     *
     * @description 
     *  Creates a famous surface with linked video content. Currently adding
     *  controls and manipulating the video are not supported through the
     *  surface interface, but can be accomplished via standard javascript
     *  manipulation of the video DOM element.
     *   
     * @name VideoSurface
     * @extends Surface
     * @constructor
     * @example
     *   var Engine = require('famous/Engine');
     *   var VideoSurface = require('famous/VideoSurface');
     *   var EventHandler = require('famous/EventHandler');
     *
     *   var Context = Engine.createContext();
     *
     *   var vidSurface = new VideoSurface({
     *      size: [500,500]
     *   });
     *   vidSurface.setContent('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')
     *
     *   Context.link(vidSurface);
     */
    function VideoSurface(options) {
        this.videoUrl = undefined;
        this.options = Object.create(VideoSurface.DEFAULT_OPTIONS);
        if (options) {this.setOptions(options)}

        Surface.apply(this, arguments);
    }

    VideoSurface.DEFAULT_OPTIONS = {
        autoplay: false
    };

    VideoSurface.prototype = Object.create(Surface.prototype);
    VideoSurface.prototype.constructor = VideoSurface;
    VideoSurface.prototype.elementType = 'video';
    VideoSurface.prototype.elementClass = 'famous-surface';

    VideoSurface.prototype.setOptions = function(options) {
        for (var key in VideoSurface.DEFAULT_OPTIONS) {
            if(options[key] !== undefined) this.options[key] = options[key];
        }
    };

    VideoSurface.prototype.setContent = function(videoUrl) {
        this.videoUrl = videoUrl;
        this.contentDirty = true;
    };

    VideoSurface.prototype.deploy = function(target) {
        target.src = this.videoUrl;
        target.autoplay = this.options.autoplay;
    };

    VideoSurface.prototype.recall = function(target) {
        target.src = '';
    };

    module.exports = VideoSurface;
});

