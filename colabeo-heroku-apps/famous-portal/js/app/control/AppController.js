define(function(require, exports, module) {
    // import famous dependencies
    var Engine = require('famous/Engine');
    var Surface = require('famous/Surface');
    var EventHandler = require('famous/EventHandler');
    var LightBox = require('app/custom/LightBox');
    var Utils       = require('famous-utils/Utils');

    // app dependencies
    var appConstant = require('app/Constant');
    var appConfig = require('app/config');

    var InstallationView = require('app/view/InstallationView');
    var MainView = require('app/view/MainView');
    var FavorView = require('app/view/FavorView');
    var EditView = require('app/view/EditView');

    var FavorCollection = require('app/models/FavorCollection');
    var SuggestionsCollection = require('app/models/SuggestionsCollection');

    var favorViewController = require('app/control/FavorViewController');

    function MainController() {
        // Set up event handlers
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);


        this.favorCollection = new FavorCollection();
        this.suggestionsCollection = new SuggestionsCollection();

        this.favorSection = new FavorView({collection:this.favorCollection});
        this.favorSection.pipe(this.eventOutput);
        appConfig.sections = [this.favorSection];

        var installationView = new InstallationView();
        var mainView = new MainView(appConfig);
        var mainDisplay = Engine.createContext();
        mainDisplay.setPerspective( 5000 );

        $(document).ready(function($) {
            $('body').on('click','.install-link',function(){
                var url = $(this).attr('link');
                if (window.location.host.indexOf('beepe.me')>=0 && window.chrome && window.chrome.webstore) chrome.webstore.install(url);
                else {
                    window.open(url, '_blank');
                }
            });

//            TODO: for now, we show installationView only
            mainDisplay.add(installationView);

        });


        mainView.select(mainView.options.sections[0].title);


        this.editView = new EditView({collection:this.suggestionsCollection});
        this.editViewLightBox = new LightBox();
        mainDisplay.add(this.editViewLightBox);
        this.editView.pipe(this.eventOutput);

        this.eventOutput.on('editFavor', this.onEditFavor.bind(this));
        this.eventOutput.on('summitFavor', this.onSummitFavor.bind(this));
        this.eventOutput.on('goBack', this.onGoBack.bind(this));

        // TODO: hack for dev
        colabeo = {};
        colabeo.mainView = mainView;
        colabeo.favorSection = this.favorSection;
        colabeo.editSection = this.editView;
    }

    MainController.prototype.checkInstallation = function(done) {
        done();
    };

    MainController.prototype.onEditFavor = function(){
        this.editViewLightBox.show(this.editView);
        this.editView.renderFavor(undefined);
    };

    MainController.prototype.onGoBack = function(e){
        this.editView.editLightBox.hide();
        this.editViewLightBox.hide();
        Engine.pipe(this.favorSection.scrollview);
    };

    MainController.prototype.onSummitFavor = function(favor){
        console.log(favor);
        this.favorCollection.create(favor);
        this.favorCollection.trigger('sync');
    };

    module.exports = MainController;
});