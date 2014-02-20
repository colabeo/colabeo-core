define(function(require, exports, module) {
    var Engine = require('famous/Engine');
    var Context = Engine.createContext();
    var Surface = require('famous/surface');
    var SequentialLayout = require('famous-views/SequentialLayout');
    var TestScrollview = require('app/TestScrollview');
    var TestScene = require('app/TestScene');
    var TestContactItemView = require('app/TestContactItemView');

    function App(){
        this.testScrollview = new TestScrollview();
        this.testScene = new TestScene();
        this.testContactItemview = new TestContactItemView();

//        Context.link(this.testScrollview);
//        Context.link(this.testScene);
        Context.link(this.testContactItemview);
//        this.init();
    }

    App.prototype.initTest = function () {
        var LightBox = require('famous-views/LightBox');
        var lightBox = new LightBox()

    };

    App.prototype.init = function () {
        var layout = new SequentialLayout({
            itemSpacing: 10
        })

        var tests = [];
        tests.push(new Surface({size:[]}));
        tests.push(this.testScene);
        layout.sequenceFrom(tests);
        Context.link(layout);
        console.log('dsf')
    };


    module.exports = App;
});
