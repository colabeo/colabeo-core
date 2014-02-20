var Scrollview = require('famous/views/scrollview');
var Surface = require('famous/surface');
var View = require('famous/view');
var Utility = require('famous/utilities/utility');
var Engine = require('famous/engine');
var Context = Engine.createContext();

function TestScrollview(){
    View.call(this);
    this.scrollview = new Scrollview({
        itemSpacing: 0,
        margin:10000,
        direction:Utility.Direction.Y
    });

    this.sequence = [];
    for(var i = 0; i<100; i++){
        var surface = new Surface({
            content: 'item ' + i,
            size:[undefined, i],
            properties:{
                color: "red",
                backgroundColor:"yellow"
            }
        });
        surface.pipe(this.eventOutput);
        this.sequence.push(surface);
        console.log(i);
    }
    this.scrollview.sequenceFrom(this.sequence);
    console.log(this.scrollview.node)
    this.pipe(this.scrollview);
    this._link(this.scrollview);
    window.tt=this;
}

TestScrollview.prototype = Object.create(View.prototype);
TestScrollview.prototype.constructor = TestScrollview;

module.exports = TestScrollview;
