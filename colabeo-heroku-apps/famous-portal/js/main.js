define(function(require, exports, module) {
var Famous = function(cb) { cb.call(this, require) };
Famous.App = {};
Famous.App.Control_AppController = require('app/control/AppController');
Famous.App.Control_favorViewController = require('app/control/favorViewController');
Famous.App.Custom_GridLayout_Bon = require('app/custom/GridLayout_Bon');
Famous.App.Custom_InComingTransform = require('app/custom/InComingTransform');
Famous.App.Custom_LightBox = require('app/custom/LightBox');
Famous.App.Custom_Surface = require('app/custom/Surface');
Famous.App.Custom_Templates = require('app/custom/Templates');
Famous.App.Custom_UpDownTransform = require('app/custom/UpDownTransform');
Famous.App.Custom_contactItemWidget = require('app/custom/contactItemWidget');
Famous.App.Models_Favor = require('app/models/Favor');
Famous.App.Models_FavorCollection = require('app/models/FavorCollection');
Famous.App.Models_Settings = require('app/models/Settings');
Famous.App.Models_Suggestions = require('app/models/Suggestions');
Famous.App.Models_SuggestionsCollection = require('app/models/SuggestionsCollection');
Famous.App.View_EditItemView = require('app/view/EditItemView');
Famous.App.View_EditView = require('app/view/EditView');
Famous.App.View_FavorItemView = require('app/view/FavorItemView');
Famous.App.View_FavorView = require('app/view/FavorView');
Famous.App.View_InstallationView = require('app/view/InstallationView');
Famous.App.View_LogoView = require('app/view/LogoView');
Famous.App.View_LogoView2 = require('app/view/LogoView2');
Famous.App.View_MainView = require('app/view/MainView');
Famous.App.Widgets_ColoredCounter = require('app/widgets/ColoredCounter');
Famous.App.Widgets_Counter = require('app/widgets/Counter');
Famous.App.Widgets_EmptyClass = require('app/widgets/EmptyClass');
Famous.App.Widgets_SplitImages = require('app/widgets/SplitImages');
Famous.App.Widgets_SplitRenderable = require('app/widgets/SplitRenderable');
Famous.App.Widgets_TorqueRenderable = require('app/widgets/TorqueRenderable');
Famous.App.Constant = require('app/Constant');
Famous.App.Config = require('app/config');
Famous.Famous = {};
Famous.Famous.CanvasSurface = require('famous/CanvasSurface');
Famous.Famous.ContainerSurface = require('famous/ContainerSurface');
Famous.Famous.Context = require('famous/Context');
Famous.Famous.ElementAllocator = require('famous/ElementAllocator');
Famous.Famous.Engine = require('famous/Engine');
Famous.Famous.Entity = require('famous/Entity');
Famous.Famous.EventArbiter = require('famous/EventArbiter');
Famous.Famous.EventHandler = require('famous/EventHandler');
Famous.Famous.Group = require('famous/Group');
Famous.Famous.ImageSurface = require('famous/ImageSurface');
Famous.Famous.Matrix = require('famous/Matrix');
Famous.Famous.Modifier = require('famous/Modifier');
Famous.Famous.MultipleTransition = require('famous/MultipleTransition');
Famous.Famous.OptionsManager = require('famous/OptionsManager');
Famous.Famous.RenderNode = require('famous/RenderNode');
Famous.Famous.Scene = require('famous/Scene');
Famous.Famous.SceneCompiler = require('famous/SceneCompiler');
Famous.Famous.SpecParser = require('famous/SpecParser');
Famous.Famous.Surface = require('famous/Surface');
Famous.Famous.Timer = require('famous/Timer');
Famous.Famous.Transitionable = require('famous/Transitionable');
Famous.Famous.TweenTransition = require('famous/TweenTransition');
Famous.Famous.Utility = require('famous/Utility');
Famous.Famous.VideoSurface = require('famous/VideoSurface');
Famous.Famous.View = require('famous/View');
Famous.Famous.ViewSequence = require('famous/ViewSequence');
Famous.Famous.WebGLSurface = require('famous/WebGLSurface');
Famous.FamousAnimation = {};
Famous.FamousAnimation.Animation = require('famous-animation/Animation');
Famous.FamousAnimation.AnimationEngine = require('famous-animation/AnimationEngine');
Famous.FamousAnimation.CubicBezier = require('famous-animation/CubicBezier');
Famous.FamousAnimation.Easing = require('famous-animation/Easing');
Famous.FamousAnimation.Idle = require('famous-animation/Idle');
Famous.FamousAnimation.LayoutEngine = require('famous-animation/LayoutEngine');
Famous.FamousAnimation.PiecewiseCubicBezier = require('famous-animation/PiecewiseCubicBezier');
Famous.FamousAnimation.RegisterEasing = require('famous-animation/RegisterEasing');
Famous.FamousAnimation.Sequence = require('famous-animation/Sequence');
Famous.FamousAnimation.Timer = require('famous-animation/Timer');
Famous.FamousAudio = {};
Famous.FamousAudio.BufferLoader = require('famous-audio/BufferLoader');
Famous.FamousAudio.SoundPlayer = require('famous-audio/SoundPlayer');
Famous.FamousColor = {};
Famous.FamousColor.Color = require('famous-color/Color');
Famous.FamousColor.ColorPalette = require('famous-color/ColorPalette');
Famous.FamousColor.ColorPalettes = require('famous-color/ColorPalettes');
Famous.FamousFeedback = {};
Famous.FamousFeedback.Circle = require('famous-feedback/Circle');
Famous.FamousFeedback.FeedbackBase = require('famous-feedback/FeedbackBase');
Famous.FamousFeedback.FontFeedback = require('famous-feedback/FontFeedback');
Famous.FamousFeedback.Lasers = require('famous-feedback/Lasers');
Famous.FamousModifiers = {};
Famous.FamousModifiers.Camera = require('famous-modifiers/Camera');
Famous.FamousModifiers.Draggable = require('famous-modifiers/Draggable');
Famous.FamousModifiers.Lift = require('famous-modifiers/Lift');
Famous.FamousPerformance = {};
Famous.FamousPerformance.Profiler = require('famous-performance/Profiler');
Famous.FamousPerformance.ProfilerMetric = require('famous-performance/ProfilerMetric');
Famous.FamousPerformance.ProfilerMetricView = require('famous-performance/ProfilerMetricView');
Famous.FamousPerformance.ProfilerView = require('famous-performance/ProfilerView');
Famous.FamousPhysics = {};
Famous.FamousPhysics.Bodies_Body = require('famous-physics/bodies/Body');
Famous.FamousPhysics.Bodies_Circle = require('famous-physics/bodies/Circle');
Famous.FamousPhysics.Bodies_Particle = require('famous-physics/bodies/Particle');
Famous.FamousPhysics.Bodies_Rectangle = require('famous-physics/bodies/Rectangle');
Famous.FamousPhysics.Constraints_Collision = require('famous-physics/constraints/Collision');
Famous.FamousPhysics.Constraints_CollisionJacobian = require('famous-physics/constraints/CollisionJacobian');
Famous.FamousPhysics.Constraints_Constraint = require('famous-physics/constraints/Constraint');
Famous.FamousPhysics.Constraints_Curve = require('famous-physics/constraints/Curve');
Famous.FamousPhysics.Constraints_Distance = require('famous-physics/constraints/Distance');
Famous.FamousPhysics.Constraints_Distance1D = require('famous-physics/constraints/Distance1D');
Famous.FamousPhysics.Constraints_Rod = require('famous-physics/constraints/Rod');
Famous.FamousPhysics.Constraints_Rope = require('famous-physics/constraints/Rope');
Famous.FamousPhysics.Constraints_StiffSpring = require('famous-physics/constraints/StiffSpring');
Famous.FamousPhysics.Constraints_Surface = require('famous-physics/constraints/Surface');
Famous.FamousPhysics.Constraints_Wall = require('famous-physics/constraints/Wall');
Famous.FamousPhysics.Constraints_Walls = require('famous-physics/constraints/Walls');
Famous.FamousPhysics.Constraints_joint = require('famous-physics/constraints/joint');
Famous.FamousPhysics.Forces_Drag = require('famous-physics/forces/Drag');
Famous.FamousPhysics.Forces_Force = require('famous-physics/forces/Force');
Famous.FamousPhysics.Forces_Repulsion = require('famous-physics/forces/Repulsion');
Famous.FamousPhysics.Forces_Spring = require('famous-physics/forces/Spring');
Famous.FamousPhysics.Forces_TorqueSpring = require('famous-physics/forces/TorqueSpring');
Famous.FamousPhysics.Forces_VectorField = require('famous-physics/forces/VectorField');
Famous.FamousPhysics.Forces_rotationalDrag = require('famous-physics/forces/rotationalDrag');
Famous.FamousPhysics.Integrator_SymplecticEuler = require('famous-physics/integrator/SymplecticEuler');
Famous.FamousPhysics.Integrator_verlet = require('famous-physics/integrator/verlet');
Famous.FamousPhysics.Math_GaussSeidel = require('famous-physics/math/GaussSeidel');
Famous.FamousPhysics.Math_Quaternion = require('famous-physics/math/Quaternion');
Famous.FamousPhysics.Math_Random = require('famous-physics/math/Random');
Famous.FamousPhysics.Math_Vector = require('famous-physics/math/Vector');
Famous.FamousPhysics.Math_matrix = require('famous-physics/math/matrix');
Famous.FamousPhysics.Utils_PhysicsTransition = require('famous-physics/utils/PhysicsTransition');
Famous.FamousPhysics.Utils_PhysicsTransition2 = require('famous-physics/utils/PhysicsTransition2');
Famous.FamousPhysics.Utils_SpringTransition = require('famous-physics/utils/SpringTransition');
Famous.FamousPhysics.Utils_StiffSpringTransition = require('famous-physics/utils/StiffSpringTransition');
Famous.FamousPhysics.Utils_WallTransition = require('famous-physics/utils/WallTransition');
Famous.FamousPhysics.PhysicsEngine = require('famous-physics/PhysicsEngine');
Famous.FamousScene = {};
Famous.FamousScene.GLScene = require('famous-scene/GLScene');
Famous.FamousScene.Scene = require('famous-scene/Scene');
Famous.FamousScene.SceneController = require('famous-scene/SceneController');
Famous.FamousScene.SceneTransitions = require('famous-scene/SceneTransitions');
Famous.FamousScene.Transitions = require('famous-scene/Transitions');
Famous.FamousSync = {};
Famous.FamousSync.FastClick = require('famous-sync/FastClick');
Famous.FamousSync.GenericSync = require('famous-sync/GenericSync');
Famous.FamousSync.MouseSync = require('famous-sync/MouseSync');
Famous.FamousSync.PinchSync = require('famous-sync/PinchSync');
Famous.FamousSync.RotateSync = require('famous-sync/RotateSync');
Famous.FamousSync.ScaleSync = require('famous-sync/ScaleSync');
Famous.FamousSync.ScrollSync = require('famous-sync/ScrollSync');
Famous.FamousSync.TouchSync = require('famous-sync/TouchSync');
Famous.FamousSync.TouchTracker = require('famous-sync/TouchTracker');
Famous.FamousSync.TwoFingerSync = require('famous-sync/TwoFingerSync');
Famous.FamousUi = {};
Famous.FamousUi.Buttons_ButtonBase = require('famous-ui/Buttons/ButtonBase');
Famous.FamousUi.Buttons_RotateButton = require('famous-ui/Buttons/RotateButton');
Famous.FamousUi.Buttons_SpringButton = require('famous-ui/Buttons/SpringButton');
Famous.FamousUi.Buttons_SpringButton.ui = require('famous-ui/Buttons/SpringButton.ui');
Famous.FamousUi.ColorPicker_AlphaPicker = require('famous-ui/ColorPicker/AlphaPicker');
Famous.FamousUi.ColorPicker_CanvasPicker = require('famous-ui/ColorPicker/CanvasPicker');
Famous.FamousUi.ColorPicker_ColorButton = require('famous-ui/ColorPicker/ColorButton');
Famous.FamousUi.ColorPicker_ColorPicker = require('famous-ui/ColorPicker/ColorPicker');
Famous.FamousUi.ColorPicker_GradientPicker = require('famous-ui/ColorPicker/GradientPicker');
Famous.FamousUi.ColorPicker_HuePicker = require('famous-ui/ColorPicker/HuePicker');
Famous.FamousUi.Dropdown_Dropdown = require('famous-ui/Dropdown/Dropdown');
Famous.FamousUi.Dropdown_DropdownItem = require('famous-ui/Dropdown/DropdownItem');
Famous.FamousUi.Easing_CanvasDrawer = require('famous-ui/Easing/CanvasDrawer');
Famous.FamousUi.Easing_EasingBool = require('famous-ui/Easing/EasingBool');
Famous.FamousUi.Easing_EasingVisualizer = require('famous-ui/Easing/EasingVisualizer');
Famous.FamousUi.Easing_MultiEasingToggle = require('famous-ui/Easing/MultiEasingToggle');
Famous.FamousUi.Text_Label = require('famous-ui/Text/Label');
Famous.FamousUi.Toggles_BoolToggle = require('famous-ui/Toggles/BoolToggle');
Famous.FamousUi.Toggles_MultiBoolToggle = require('famous-ui/Toggles/MultiBoolToggle');
Famous.FamousUi.AutoUI = require('famous-ui/AutoUI');
Famous.FamousUi.PanelScrollview = require('famous-ui/PanelScrollview');
Famous.FamousUi.Slider = require('famous-ui/Slider');
Famous.FamousUtils = {};
Famous.FamousUtils.FormatTime = require('famous-utils/FormatTime');
Famous.FamousUtils.KeyCodes = require('famous-utils/KeyCodes');
Famous.FamousUtils.NoiseImage = require('famous-utils/NoiseImage');
Famous.FamousUtils.Time = require('famous-utils/Time');
Famous.FamousUtils.TimeAgo = require('famous-utils/TimeAgo');
Famous.FamousUtils.Utils = require('famous-utils/Utils');
Famous.FamousViews = {};
Famous.FamousViews.Accordion = require('famous-views/Accordion');
Famous.FamousViews.ControlSet = require('famous-views/ControlSet');
Famous.FamousViews.EnergyHelper = require('famous-views/EnergyHelper');
Famous.FamousViews.Flip = require('famous-views/Flip');
Famous.FamousViews.InputSurface = require('famous-views/InputSurface');
Famous.FamousViews.LightBox = require('famous-views/LightBox');
Famous.FamousViews.Modal = require('famous-views/Modal');
Famous.FamousViews.ScrollContainer = require('famous-views/ScrollContainer');
Famous.FamousViews.Scrollview = require('famous-views/Scrollview');
Famous.FamousViews.SequentialLayout = require('famous-views/SequentialLayout');
Famous.FamousViews.Shaper = require('famous-views/Shaper');
Famous.FamousViews.Swappable = require('famous-views/Swappable');
Famous.FamousWidgets = {};
Famous.FamousWidgets.FeedItem = require('famous-widgets/FeedItem');
Famous.FamousWidgets.FeedStream = require('famous-widgets/FeedStream');
Famous.FamousWidgets.IconBar = require('famous-widgets/IconBar');
Famous.FamousWidgets.InfoBox = require('famous-widgets/InfoBox');
Famous.FamousWidgets.NavMenu = require('famous-widgets/NavMenu');
Famous.FamousWidgets.NavigationBar = require('famous-widgets/NavigationBar');
Famous.FamousWidgets.ScrollContainer = require('famous-widgets/ScrollContainer');
Famous.FamousWidgets.ShrinkContainer = require('famous-widgets/ShrinkContainer');
Famous.FamousWidgets.Slider = require('famous-widgets/Slider');
Famous.FamousWidgets.TitleBar = require('famous-widgets/TitleBar');
Famous.FamousWidgets.ToggleButton = require('famous-widgets/ToggleButton');
module.exports = Famous; });