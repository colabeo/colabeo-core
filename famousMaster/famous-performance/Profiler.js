define(function(require, exports, module) {
    var PerformanceMetric = require('famous-performance/ProfilerMetric');
    var EventHandler = require('famous/EventHandler');

    var bufferSize = 20;
    var eventHandler = new EventHandler();

    var LABELS = {
        FPS : 'FPS',
        FAMOUS : 'Famous'
    };

    var ProfilerMetric = {};

    ProfilerMetric.metrics = {};

    ProfilerMetric.start = function(id){
        var metric = (ProfilerMetric.metrics[id] === undefined)
            ? addMetric(id)
            : ProfilerMetric.metrics[id];
        metric.start();
    };

    ProfilerMetric.stop = function(id){
        ProfilerMetric.metrics[id].stop();
    };

    function addMetric(id){
        var metric = new PerformanceMetric(bufferSize, id);
        ProfilerMetric.metrics[id] = metric;
        return metric;
    };

    ProfilerMetric.setBufferSize = function(N){
        bufferSize = N;
        var metrics = ProfilerMetric.metrics;
        for (var key in metrics) metrics[key].setBufferSize(N);
    };

    ProfilerMetric.getBufferSize = function(){
        return bufferSize;
    };

    ProfilerMetric.emit = function(type, event){
        eventHandler.emit(type, event)
    };

    eventHandler.on('prerender', function(){
        ProfilerMetric.start(LABELS.FPS);
        ProfilerMetric.start(LABELS.FAMOUS);
    });

    eventHandler.on('postrender', function(){
        ProfilerMetric.stop(LABELS.FAMOUS);
        var metrics = ProfilerMetric.metrics;
        for (var key in metrics) metrics[key].reset();
    });

    module.exports = ProfilerMetric;
});