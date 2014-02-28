require('famous/polyfills');

var FamousEngine = require('famous/engine');

var mainCtx = FamousEngine.createContext();

var Tests = require('tests');
var TestScene = Tests.Scene;
var Scrollview = Tests.Scrollview;
var ItemView = Tests.ItemView;

var testScene = new Scrollview();

mainCtx.link(testScene);

//mainCtx.setPerspective(2000);


