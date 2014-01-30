define(function(require, exports, module) { 

    var SceneTransitions = require('famous-scene/SceneTransitions');
    var SceneController = require('app/SceneController');

    var sceneTransitions = new SceneTransitions();
    sceneTransitions.setController( SceneController );

    module.exports = sceneTransitions;
});
