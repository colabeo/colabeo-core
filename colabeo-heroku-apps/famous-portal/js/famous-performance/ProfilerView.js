define(function(require, exports, module) {
    var PerformanceMetricView = require('famous-performance/ProfilerMetricView');
    var Profiler = require('famous-performance/Profiler')
    var RenderNode = require('famous/RenderNode');
    var Modifier = require('famous/Modifier');
    var Matrix = require('famous/Matrix');

    var metrics = Profiler.metrics;
    var combiner = new RenderNode();
    var counter = 0;

    var ProfilerView = {};

    var options = {
        max : 1000 / 60,
        size : [150, 20],
        margin : 1
    };

    function init(){
        var ty = 0;
        var map;
        for (var key in metrics){
            if (key.toUpperCase() === 'FPS') map = function(val){ return 1000 / (60 * val); }
            else map = function(val){return val / options.max};

            var metricView = new PerformanceMetricView(metrics[key], {
                size    : options.size,
                label   : key,
                map     : map
            });

            var layoutTransform = new Modifier(Matrix.translate(0, ty));
            combiner.add(layoutTransform).link(metricView);
            ty += options.size[1] + options.margin;
        };
    };

    ProfilerView.setMax = function(max){
        options.max = max;
    };

    ProfilerView.setSize = function(size){
        options.size = size;
    };

    ProfilerView.render = function(){
        if (counter >  2)   return combiner.render();
        if (counter == 2)   init();
        if (counter <= 2)   counter++;
    };


    module.exports = ProfilerView;

});