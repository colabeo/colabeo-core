define(function(require, exports, module) 
{    
    require('famous-sync/FastClick');

    var Engine          = require('famous/Engine');        
    var SceneController = require('app/SceneController');
    var RegisterEasing  = require('famous-animation/RegisterEasing');
    var KeyCodes        = require('famous-utils/KeyCodes');

    var SignupContent = require('core/SignupContent');
    
    // Scenes
    var TorqueScene     = require('app/scenes/TorqueScene');
    var TiledScene      = require('app/scenes/TiledScene');
    var Stop            = require('app/scenes/Stop');
    var NuclearScene    = require('app/scenes/NuclearScene');
    var Nananana        = require('app/scenes/Nananana');

    // Persistant Views
    var CounterView = require('app/scenes/CounterView');
    var SceneView   = require('app/widgets/SceneMenu');

    var mainCtx = Engine.createContext();
    mainCtx.setPerspective( 1000 );

    mainCtx.add( SceneController );

    SceneController.addScenes({
        'Torque'    : TorqueScene,
        'Stop'      : Stop,
        'Nuclear'   : NuclearScene,
        'Batman'    : Nananana
    });
    SceneController.setScene('Torque');

    CounterView.setCtx( mainCtx );
    SceneView.setCtx( mainCtx );

});
