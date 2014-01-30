define(function(require, exports, module) {
    // Import core Famous dependencies
    var C = require('app/Constant');
    var EventHandler = require('famous/EventHandler');
    var Surface      = require('famous/Surface');
    var View             = require('famous/View');

    function FavorItemView(options) {
        View.call(this);
        this.c = new C();
        this.model = options.model;

        // Set up event handlers
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.surface = new Surface({
            size: [this.c.favorItemWidth, this.c.favorItemHeight+this.c.favorPaddingTop*2],
            classes:['favor-item'],
            properties:{
                paddingTop: this.c.favorPaddingTop+ "px",
                paddingLeft: this.c.favorPaddingLeft+ "px"
            }
        });
        this.renderView()

        this.surface.pipe(this.eventOutput);
        this._link(this.surface);

        this.surface.on('mouseover',function(e){
            this.renderView(1);
        }.bind(this))
        this.surface.on('mouseleave',function(e){
            this.renderView();
        }.bind(this))
        this.surface.on('click', function(e) {
            var target = $(e.target);
            if (target.hasClass("fa-times-circle")) {
                this.model.destroy();
            }
//            else if (target.hasClass("fa-pencil")) this.eventOutput.emit('editFavor', this.model);
        }.bind(this));

    }

    FavorItemView.prototype = Object.create(View.prototype);
    FavorItemView.prototype.constructor = FavorItemView;

    // render is a reserved function. Should not use while using famous
    FavorItemView.prototype.renderView = function(showButtons){
        var url = this.model.get('url');
        var pic = this.model.get('pic');
        var title = this.model.get('title');
        var picture = '<a href="http://';
        picture += url +'"><img src="' + pic + '" class="img-rounded"';
        picture += 'style="width:' + this.c.favorItemWidth + 'px; height:' + this.c.favorItemHeight + 'px" ></a>';
        var buttons = '<div class="show-item" >';
        buttons += '<span class="favor-destroy" ><i class="fa fa-times-circle fa-lg ';
        if (!showButtons) buttons += 'toHide';
        buttons += '"></i></span>';
        if (!title) title=url;
        buttons += '<span class="favor-content">' + title + '</span>';
//        buttons += '<span class="favor-edit" ><i class="fa fa-pencil fa-lg ';
//        if (!showButtons) buttons += 'toHide';
//        buttons += '"></i></span>';
        buttons += '</div>';
        var editBar = '<div class="edit-item" id="'+url+'"><input type="text" class="favor-input input-medium" value="' + title + '"></div>';
        var html = picture + buttons;

        this.surface.setContent(html);
    }

    module.exports = FavorItemView;
});