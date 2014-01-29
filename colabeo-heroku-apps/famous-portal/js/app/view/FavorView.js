define(function(require, exports, module) {
    // Import core Famous dependencies
    var C = require('app/Constant');
    var EditView = require('app/view/EditView');
    var EventHandler = require('famous/EventHandler');
    var FavorItemView  = require('app/view/FavorItemView');
    var GridLayout  = require('app/custom/GridLayout');
    var Surface      = require('famous/Surface');
    var View             = require('famous/View');
    var Matrix = require('famous/Matrix');
    var SequentialLayout = require('famous-views/SequentialLayout');

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

        this.gridLayout = new GridLayout({
            dimensions:[this.c.gridLayoutCol,this.c.gridLayoutRow],
            cellSize: [this.c.favorItemWidth + this.c.favorPaddingLeft, this.c.favorItemHeight + this.c.favorPaddingTop],
            transition: true
        });

        this.sequentialLayout = new SequentialLayout({
            itemSpacing: 2
        });

        this.addFavorSurface = new Surface({
            size: [this.c.favorItemWidth, this.c.favorItemHeight],
            classes: ['add-surface'],
            properties:{
                marginTop: this.c.favorPaddingTop+ "px",
                marginLeft: this.c.favorPaddingLeft+ "px",
                textAlign: "center"
            },
            content: '<i class="fa fa-plus fa-5x"/>'
        });


        this.loadFavor();
        this._add(this.gridLayout);
        this._add(this.sequentialLayout);

        this.addFavorSurface.on('click', function(e){
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
        if (this.collection.length == 0) {
            this.createDefaultList();
        }
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