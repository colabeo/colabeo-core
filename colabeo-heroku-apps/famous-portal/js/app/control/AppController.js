define(function(require, exports, module) {
    // import famous dependencies
    var Engine = require('famous/Engine');
    var Surface = require('famous/Surface');
    var EventHandler = require('famous/EventHandler');
    var LightBox = require('app/custom/LightBox');

    // app dependencies
    var appConstant = require('app/Constant');
    var appConfig = require('app/config');

    var MainView = require('app/view/MainView');
    var FavorView = require('app/view/FavorView');
    var EditView = require('app/view/EditView');

    var FavorCollection = require('app/models/FavorCollection');

    var favorViewController = require('app/control/FavorViewController');

    function MainController() {
        // Set up event handlers
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);


        this.favorCollection = new FavorCollection();

        var favorSection = new FavorView({collection:this.favorCollection});
        favorSection.pipe(this.eventOutput);
        appConfig.sections = [favorSection];

        var mainView = new MainView(appConfig);
        var mainDisplay = Engine.createContext();
        mainDisplay.add(mainView);

        mainView.select(mainView.options.sections[0].title);


        this.editView = new EditView();
        this.editViewLightBox = new LightBox();
        mainDisplay.add(this.editViewLightBox);
        this.editView.pipe(this.eventOutput);

        this.eventOutput.on('editFavor', this.onEditFavor.bind(this));
        this.eventOutput.on('summitFavor', this.onSummitFavor.bind(this));
        this.eventOutput.on('goBack', this.onGoBack.bind(this));

        // TODO: hack for dev
        colabeo = {};
        colabeo.mainView = mainView;
        colabeo.favorSection = favorSection;
    }

    MainController.prototype.checkInstallation = function(done) {
        done();
    };

    MainController.prototype.onEditFavor = function(){
        this.editView.renderFavor(undefined);
        this.editViewLightBox.show(this.editView);
    };

    MainController.prototype.onGoBack = function(e){
        this.editView.editLightBox.hide();
        this.editViewLightBox.hide();
    };

    MainController.prototype.onSummitFavor = function(favor){
        console.log(favor);
        this.favorCollection.create(favor);
        this.favorCollection.trigger('sync');
    };

    module.exports = MainController;
});