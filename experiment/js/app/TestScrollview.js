define(function(require, exports, module) {
    var Scrollview = require('famous-views/Scrollview');
    var Surface = require('famous/Surface');
    var View = require('famous/View');
    var Util             = require('famous/Utility');
    var Engine = require('famous/Engine');
    var Context = Engine.createContext();

    function TestScrollview(){
        View.call(this);
        this.scrollview = new Scrollview({
            itemSpacing: 0,
//            margin:10000,
            direction:Util.Direction.Y
        });

        this.sequence = [];
        for(var i = 0; i<100; i++){
            var surface = new Surface({
                content: 'item ' + i,
                size:[undefined, i],
                properties:{
                    color: "black",
                    background:"yellow"
                }
            });
            surface.pipe(this.eventOutput);
            this.sequence.push(surface);
        }
        this.scrollview.sequenceFrom(this.sequence);
//        console.log(this.scrollview.node.)
        this.pipe(this.scrollview);
        this._link(this.scrollview);
        window.tt=this;
    }

    TestScrollview.prototype = Object.create(View.prototype);
    TestScrollview.prototype.constructor = TestScrollview;

    module.exports = TestScrollview;
});

