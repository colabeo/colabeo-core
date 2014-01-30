define(function(require, exports, module) {
    // Import core Famous dependencies
    var constant = require ('app/Constant');
    var EdgeSwapper = require ('famous-views/EdgeSwapper');
    var EventHandler = require('famous/EventHandler');
    var HeadFooterLayout = require('famous-views/HeaderFooterLayout');
    var Matrix = require('famous/Matrix');
    var NavigationBar = require('famous-widgets/NavigationBar');
    var Surface      = require('famous/Surface');
    var TitleBar = require('famous-widgets/TitleBar');
    var Utility = require('famous/Utility');
    var View             = require('famous/View');
    var RenderNode = require('famous/RenderNode');


    function MainView(options) {
        View.apply(this, arguments);

        this.constant = new constant();
        this.headerFooterLayout = new HeadFooterLayout();

        //        this.header = new TitleBar(this.options.header);
        this.header = new Surface({
            size:[undefined,this.constant.headerHeight],
            properties:{
                background: "rgba(0,0,0,0.9)",
                zIndex:10
            }
        });

        this.footerSurface = new Surface({
            size:[undefined,this.constant.footerHeight],
            content:'<div class="copy-right">&copy 2014 Colabeo.Inc</div><div class="leave-a-message">Leave a Message</div>',
            properties:{
                color: "white",
                fontSize:30,
                background:"rgba(0,0,0,0.9)",
                zIndex:10
            }
        });

        this.contentArea = new EdgeSwapper(this.options.content);

        this.navigation = new NavigationBar(this.options.navigation);

        this.headerFooterLayout.id['header'].link(this.header);
        this.headerFooterLayout.id['content'].link(this.contentArea);
//        this.headerFooterLayout.id['footer'].link(this.navigation);
        this.headerFooterLayout.id['footer'].link(this.footerSurface);

        this.eventInput.pipe(this.contentArea);

        // navigation events are app events
        EventHandler.setOutputHandler(this, this.navigation);
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

        this._currentSection = undefined;
        this._sections = {};
        this._sectionTitles = {};

        this.options.sections && this.initSections(this.options.sections);

        this.navigation.on('select', function(data){
            this._currentSection = data.id;
//            this.header.show(this._sectionTitles[data.id]);
            this.contentArea.show(this._sections[data.id].get());
        }.bind(this));


        this.headerContent();
        this._link(this.headerFooterLayout);
    }

    MainView.prototype = Object.create(View.prototype);
    MainView.prototype.constructor = MainView;

    MainView.DEFAULT_OPTIONS = {
        header: {
            inTransition: true,
            outTransition: true,
            look: {
                size: [undefined, 50],
                classes: ['header']
            }
        },
        navigation: {
            direction: Utility.Direction.X,
            buttons: {
                onClasses: ['navigation', 'on'],
                offClasses: ['navigation', 'off'],
                inTransition: true,
                outTransition: true
            }
        },
        content: {
            inTransition: true,
            outTransition: true,
            overlap: true
        },
        inTransform: Matrix.identity,
        outTransform: Matrix.identity,
        inOpacity: 0,
        outOpacity: 0,
        inTransition:{duration: 500},
        outTransition:{duration: 200}
    };

    MainView.prototype.section = function(id) {
        // create the section if it doesn't exist
        if(!(id in this._sections)) {
            this._sections[id] = new RenderNode();

            // make it possible to set the section's properties
            this._sections[id].setOptions = (function(options) {
                this._sectionTitles[id] = options.title;
                this.navigation.defineSection(id, {
                    content: '<span class="icon">' + options.navigation.icon + '</span><br />' + options.navigation.caption
                });
            }).bind(this);
        }
        return this._sections[id];
    };

    MainView.prototype.select = function(id) {
        this._currentSection = id;
        if(!(id in this._sections)) return false;
        this.navigation.select(id);
        return true;
    };

    // Initialize the sections that were passed in
    MainView.prototype.initSections = function(sections) {
        _.each(sections, function(item) {
            var id = item.title;
            this.section(id).setOptions({
                title: item.title,
                navigation: item.navigation
            });
            this.section(id).link(item);

            if(item.pipe) {
                item.pipe(this.eventInput);
            }
        }.bind(this));
    };

    MainView.prototype.headerContent = function(){
        var content = '<img src="pics/Logo_only.png" class="colabeo-logo"/> ';
        content += '<form action="http://google.com/cse" class="google-area" id="google-form">';
        content += '<div class="google-search-bar">';
        content += '<i class="fa fa-search fa-2x" id="google-search-icon">  </i>';
        content += '<input class="span5" name="q" id="google-input-search-bar" type="text" placeholder = "Google Search">';
        content += '</div>';
        content += '</form>';
        this.header.setContent(content);
    };

    module.exports = MainView;
});