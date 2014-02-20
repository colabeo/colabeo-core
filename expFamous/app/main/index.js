require('famous/polyfills');


var FamousEngine = require('famous/engine');
var Surface = require('famous/surface');
var Modifier = require('famous/modifier');

var mainCtx = FamousEngine.createContext();


var TestScene = require('test-scene');
var TestScrollview = require('test-scrollview');
var TestContactItemView = require('test-contact-item-view');


var test = new TestContactItemView();

mainCtx.link(test);

//mainCtx.setPerspective(2000);


