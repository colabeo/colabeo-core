define(function(require, exports, module) {
    // Import core Famous dependencies
    var C = require('app/Constant');
    var Engine = require('famous/Engine');
    var EditView = require('app/view/EditView');
    var EventHandler = require('famous/EventHandler');
    var FavorItemView  = require('app/view/FavorItemView');
    var GridLayout  = require('app/custom/GridLayout_Bon');
    var Matrix = require('famous/Matrix');
    var Scrollview       = require('famous-views/Scrollview');
    var Surface      = require('famous/Surface');
    var Util             = require('famous/Utility');
    var View             = require('famous/View');

    function FavorView(options) {
        View.call(this);

        // Set up event handlers
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.c = new C();
        this.transform = Matrix.identity;

        this.collection = options.collection;

        this.title = '<div> Favor section </div>';
        this.navigation = {
            caption: 'Favor',
            icon: '<i class="fa fa-clock-o"></i>'
        };

        this.gridView = new View({
            size:[undefined,undefined]
        });

        this.gridLayout = new GridLayout({
            dimensions:[this.c.gridLayoutCol,this.c.gridLayoutRow],
            cellSize: [this.c.favorItemWidth + this.c.favorPaddingLeft + this.c.favorPaddingRight, this.c.favorItemHeight + this.c.favorPaddingTop*2],
            paddingSide: this.c.favorItemWidth/2,
            transition: true
        });

        this.scrollview = new Scrollview({
            direction: Util.Direction.Y,
            margin:10000
        });

        this.addFavorSurface = new Surface({
            size: [this.c.favorItemWidth, this.c.favorItemHeight],
            classes: ['add-surface'],
            properties:{
                paddingTop: this.c.favorPaddingTop+ "px",
                paddingLeft: this.c.favorPaddingLeft+ "px",
                textAlign: "center"
            },
            content: '<div><i class="fa fa-plus fa-5x"/></div>'
        });
        this.addFavorSurface.pipe(this.eventOutput);

//        this.loadFavor();
//        this.emptySurface = new Surface({
//            size: [undefined,window.innerHeight*2]
//        })
//        this.gridView._add(this.emptySurface);
        this.gridView._add(this.gridLayout);
        this.scrollview.sequenceFrom([this.gridView]);
        Engine.pipe(this.scrollview);
        this._link(this.scrollview);

        this.addFavorSurface.on('click', function(e){
            Engine.unpipe(this.scrollview);
            this.eventOutput.emit('editFavor');
        }.bind(this));

        this.collection.on('all', function(e, model, collection, options) {
            switch(e)
            {
                case 'remove':
                case 'sync':
                    this.loadFavor();
                    break;
            }
        }.bind(this));
        this.collection.fetch();

    }

    FavorView.prototype = Object.create(View.prototype);
    FavorView.prototype.constructor = FavorView;

    FavorView.prototype.loadFavor = function(){
        var sequence = this.collection.map(function(item){
            var surface = new FavorItemView({model:item});
            surface.pipe(this.eventOutput);
            return surface;
        }.bind(this));
//        this.c.gridLayoutRow = Math.floor(sequence.length/this.c.gridLayoutCol) + 1;
//        this.gridLayout.options.size = [this.c.gridLayoutCol, this.c.gridLayoutRow];

        sequence.push(this.addFavorSurface);
        this.gridLayout.sequenceFrom(sequence);
    };

    FavorView.prototype.createDefaultList = function(){
        var defaultList = ['google.com', 'facebook.com', 'loveq.cn', 'weibo.com', 'baidu.com'];
        defaultList.map(function(url){
            var favor = {};
            favor.url = url;
            console.log(favor);
            this.collection.create(favor);
            this.collection.trigger('sync');
        }.bind(this));
    };

    module.exports = FavorView;
});