var Scrollview = require('famous/views/scrollview');
var Surface = require('famous/surface');
var View = require('famous/view');
var Utility = require('famous/utilities/utility');
var Engine = require('famous/engine');
var Context = Engine.createContext();

var ItemView = require('item-view');

function TestScrollview(){
    View.call(this);

//    this.initSwipeSwitcher()
//    this.events()


    this.scrollview = new Scrollview();

    this.sequence = [];
    for(var i = 0; i<10; i++){
        var surface = new ItemView(i);
        surface.pipe(this.scrollview);
//        surface.pipe(this.eventOutput);
        this.sequence.push(surface);
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
