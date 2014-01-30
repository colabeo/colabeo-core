define(function(require, exports, module) {

    //Include Famous Repositories
    var FamousEngine = require('famous/Engine');
    var FamousSurface = require('famous/Surface');
    var FT = require('famous/Modifier');
    var FM = require('famous/Matrix');

    //Include Physics: Engine, Forces, Utilties
    var PhysicsEngine = require('famous-physics/PhysicsEngine');
    var Drag = require('famous-physics/forces/Drag');
    var RotationalDrag = require('famous-physics/forces/RotationalDrag');
    var Vector = require('famous-physics/math/Vector');
    var Quaternion = require('famous-physics/math/Vector');
    var TorqueSpring = require('famous-physics/forces/TorqueSpring');
    var Spring = require('famous-physics/forces/Spring');

    var mainCtx = FamousEngine.createContext();
    mainCtx.setPerspective(1000);

    var pushStrength            = 0*.5;
    var torqueStrength          = .01*2;
    var torqueSpringDamping     = 20;
    var torqueSpringPeriod      = 12;
    var forceSpringDamping      = .35;
    var forceSpringPeriod       = 1100;
    var dragStrength            = .01;

    var sideLength = 400;
    var size = [sideLength, sideLength];
    var frontSurface = new FamousSurface({
        size : size,
        content : 'click me',
        properties : {
            backgroundImage: '-webkit-linear-gradient(#3cf, rgb(100,100,255))',
            fontSize : size[1]/8 + 'px',
            textAlign : 'center',
            lineHeight : size[1] + 'px'
        }
    });

    var backSurface = new FamousSurface({
        size : size,
        classes : ['backface'],
        properties: {
            backgroundImage: '-webkit-linear-gradient(rgb(229,55,255), rgb(100,100,255))'
        }
    });

    var PE = new PhysicsEngine();

    var force  = new Vector(0,0,-pushStrength);
    var torque = new Vector(0,0,-torqueStrength);

    var center = [window.innerWidth/2, window.innerHeight/2];

    center = [window.innerWidth/2, 175 + 45, 0]
    function applyTorque(e, side){
        var location = new Vector(
            (e.offsetX - body.size[0]/2)*side,
            -(e.offsetY - body.size[1]/2)*side,
            0
        );

//	    var location = new Vector(
//		    (e.pageX - center[0]),
//		    (center[1] - e.pageY),
//		    0
//	    );

        body.applyForce(force);
        body.applyTorque(location.cross(torque));
    };

    frontSurface.on('click', function(e){applyTorque(e, 1)});
    backSurface.on( 'click', function(e){applyTorque(e,-1)});

    var body = PE.createBody({
        shape : PE.BODIES.RECTANGLE,
        size : size
    });

    FamousEngine.on('keypress', function(){
        body.applyTorque({z : 5});
    });

    var drag = new Drag({strength : dragStrength});
    var rotationalDrag = new RotationalDrag({strength :.1});

    var torqueSpring = new TorqueSpring({
        anchor : new Quaternion(0,0,0,0),
        period : torqueSpringPeriod,
        dampingRatio : torqueSpringDamping
    });

    var spring = new Spring({
        anchor : [0,0,0],
        period : forceSpringPeriod,
        dampingRatio : forceSpringDamping
    });

    PE.attach([drag, rotationalDrag, spring]);

    body.add(new FT(FM.translate(0,0,.1))).link(frontSurface);
    body.add(backSurface);

    //Render the output of the Physics Engine
    mainCtx.add(new FT({origin : [.5,.5]})).link(PE);



//	var Panel = require('famous-ui/PanelScrollview');
//	var Slider = require('famous-ui/Slider');
//	var Toggle = require('famous-ui/Toggles/BoolToggle');
//	var uiCtx = FamousEngine.createContext();
//
//	var panel = new Panel({sliderHeight : 100});
//
//	var pushSlider = new Slider({
//		value : pushStrength,
//		range : [0,.5],
//		precision : 1,
//		name : 'push'
//	});
//
//	pushSlider.on('change', function(data){
//		force.set({x : 0, y : 0, z : -data.value});
//	});

//	var torqueSlider = new Slider({
//		value : torqueStrength,
//		range : [0,.1],
//		precision : 2,
//		name : 'torque'
//	});
//
//	torqueSlider.on('change', function(data){
//		torque.set({x : 0, y : 0, z : -data.value});
//	});
//
//	var torqueSpringDampingSlider = new Slider({
//		value : torqueSpringDamping,
//		range : [0,100],
//		precision : 1,
//		name : 'torqueDamping'
//	});
//
//	torqueSpringDampingSlider.on('change', function(data){
//		torqueSpring.setOpts({dampingRatio : data.value});
//	});
//
//	var torqueSpringPeriodSlider = new Slider({
//		value : torqueSpringPeriod,
//		range : [5,30],
//		precision : 1,
//		name : 'torquePeriod'
//	});
//
//	torqueSpringPeriodSlider.on('change', function(data){
//		torqueSpring.setOpts({period : data.value});
//	});
//
//	var toggle = new Toggle({
//		value : false,
//		size : [20,20],
//		name : 'torque spring'
//	});
//
//	toggle.on('change', function(data){
//		(data.value) ? attachTorqueSpring() : detachTorqueSpring()
//	})

    function attachTorqueSpring(){
        this.attachedSpring = PE.attach(torqueSpring);
    }

    function detachTorqueSpring(){
        if (this.attachedSpring) PE.detach(this.attachedSpring);
        this.attachedSpring = undefined;
    }

    attachTorqueSpring();

//	panel.add([pushSlider, torqueSlider, torqueSpringDampingSlider, torqueSpringPeriodSlider, toggle]);

//	uiCtx.add(panel);

});