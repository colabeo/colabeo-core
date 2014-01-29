define(function(require, exports, module) {
    var Surface = require('famous/Surface');
    var Matrix = require('famous/Matrix');

    function PerformanceMetricView(metric, opts){
        this.opts = {
            size    : [100, 20],
            label   : '',
            map     : function(val){return .06 * val}
        };

        if (opts) this.setOpts(opts);

        this.metric = metric;
        this.createView();
        this.textPadding = 4;
        this.textOpacity = 1;
    };

    PerformanceMetricView.prototype.setOpts = function(opts) {
        for (var key in opts) this.opts[key] = opts[key];
    };

    PerformanceMetricView.prototype.createView = function() {
        var metricSurface = new Surface({
            size : this.opts.size,
            properties : {
                background : '#3cf'
            }
        });

        var boundingSurface = new Surface({
            size : this.opts.size,
            properties : {background : '#36f'}
        });

        var textSurface = new Surface({
            size : [true, true],
            content : this.opts.label.toString(),
            properties : {
                color : 'white',
                textShadow : '0px 0px 2px black',
                lineHeight : this.opts.size[1] + 'px',
                cursor : 'pointer'
            }
        });

        textSurface.on('click', function(){
            if (this.metric.isRecording()) {
                this.metric.dump();
                this.textOpacity = 1;
            }
            else{
                this.textOpacity = .5;
            }
            this.metric.toggleRecording();
        }.bind(this));

        this.boundingSurface = boundingSurface;
        this.metricSurface = metricSurface;
        this.textSurface = textSurface;
    };

    PerformanceMetricView.prototype.render = function(){
        var scaleValue = this.metric.val;
        var scaleFactor = (scaleValue !== undefined) ? this.opts.map(scaleValue) : 0;

        return [
            {
            size : this.opts.size,
                target : [
                    {
                        target : this.boundingSurface.render(),
                        transform : Matrix.translate(0,0,-0.0001)
                    },
                    {
                        target : this.metricSurface.render(),
                        transform : Matrix.scale(scaleFactor, 1, 1)
                    }
                ]
            },
            {
                target : this.textSurface.render(),
                transform : Matrix.translate(this.opts.size[0] + this.textPadding, 0),
                opacity : this.textOpacity
            }
        ];
    };

    module.exports = PerformanceMetricView;

});