require('famous/polyfills');


var FamousEngine = require('famous/engine');
var Surface = require('famous/surface');
var Modifier = require('famous/modifier');

var mainCtx = FamousEngine.createContext();


var TestScene = require('test-scene');
var TestScrollview = require('test-scrollview');

var testScene = new TestScrollview();

mainCtx.link(testScene);

//mainCtx.setPerspective(2000);


