define(function(require, exports, module) {
    // Import core Famous dependencies
    var constant = require('app/Constant');
    var Surface      = require('famous/Surface');
    var Easing = require('famous-animation/Easing');
    var EditItemView = require('app/view/EditItemView');
    var Suggestions = require('app/models/Suggestions');
    var GridLayout  = require('app/custom/GridLayout');
    var HeadFooterLayout = require('famous-views/HeaderFooterLayout');
    var LightBox = require('app/custom/LightBox');
    var Mod          = require("famous/Modifier");
    var Matrix       = require("famous/Matrix");
    var View         = require('famous/View');

    function editView(options) {
        View.call(this);

        this.constant = new constant();

        this.Layout = new HeadFooterLayout();

        this.gridLayout = new GridLayout({
            dimensions: [this.constant.gridLayoutCol, this.constant.gridLayoutRow],
            transition: true
        });

        this.options = {
            inTransform: Matrix.identity,
            outTransform: Matrix.identity,
            showTransform: Matrix.identity,
            inTransition: {duration: 0},
            outTransition: {duration: 300},
            overlap: true
        };


        this.bigSurface = new Surface({
            size: [undefined, undefined],
            properties:{
                background: "rgba(59, 59, 59, 0.95)",
                zIndex: 1000
            }
        });
        this.editSurface = new Surface({
            classes:['edit-favor-surface'],
            size: [0.8*window.innerWidth, this.constant.headerHeight],
            properties:{
                borderRadius: "10px",
                marginLeft: "10%",
                color: 'rgba(245, 236, 236,1)',
                textAlign: "center",
                zIndex:1001
            }
        });

        this.editLightBox = new LightBox({
            inTransform: Matrix.scale(4,4,4),
            inOpacity: 0.1,
            inOrigin: [0., 0.],
            outTransform: Matrix.scale(10,10,10),
            outOpacity: 0.1,
            outOrigin: [0., 0.],
            showTransform: Matrix.identity,
            showOpacity: 1,
            showOrigin: [0., 0.],
            inTransition: {duration: 400, curve: Easing.inQuadNorm()},
            outTransition: {duration: 300, curve: Easing.outQuintNorm()}
        });

        this.Layout.id['header'].link(this.editSurface);
        this.Layout.id['content'].link(this.gridLayout);

        this._add(this.bigSurface);
        this._add(this.editLightBox);


        this.editSurface.on('click',function(e){
            console.log(e);
            var target = $(e.target);
            if (target.hasClass('back-button')) {

                this.eventOutput.emit('goBack');
            }
            else if (target.hasClass('done-favor')) {
                var favor = this.getFavor()
                this.eventOutput.emit('summitFavor', favor);
                this.eventOutput.emit('goBack');

            }
        }.bind(this));

        this.collection = options.collection;
        this.collection.on('all', function(e, model, collection, options) {
            switch(e)
            {
                case 'remove':
                case 'sync':
                    this.loadSuggestions();
                    break;
            }
        }.bind(this));
        this.collection.fetch();
        if (this.collection.length == 0) {
            this.createDefaultList();
        }
    }

    editView.prototype = Object.create(View.prototype);
    editView.prototype.constructor = editView;

    editView.prototype.renderFavor = function(model) {
        this.newContact = {};
        this.model=model;
        var title = '<div class="title"><i class="fa fa-arrow-circle-o-down fa-lg"></i>  Add to speed Dial<i class="fa fa-times-circle-o back-button"></i></div>';
        var html = '<div><form role="form">';
        html += '<input type="text" class="form-control" id="input-url" placeholder="Type URL to add your favorite website" name="url"';
        if (this.model)
            html += ' value="' + this.model.get('url') + '"';
        html += '>';
        html += '</form><div class="done-favor">Done</div></div>';

        html += '<div class="suggestions-url"><b>Suggestions<b></div>'
        this.editSurface.setContent(title + html);
        this.editLightBox.show(this.Layout);
    }

    editView.prototype.loadSuggestions = function(){
        var sequence = this.collection.map(function(item){
            var surface = new EditItemView({model:item});
            surface.pipe(this.eventOutput);
            return surface;
        }.bind(this));
        this.gridLayout.sequenceFrom(sequence);
    };

    editView.prototype.getFavor = function(){
        var url = document.getElementById('input-url').value;
        var newContact = {};
        newContact.url = url;
        newContact.title = url;
        return newContact;
    };

    editView.prototype.createDefaultList = function(){
        var defaultList = ['google.com', 'facebook.com', 'loveq.cn', 'weibo.com', 'baidu.com'];
        defaultList.map(function(url){
            var Suggestions = {};
            Suggestions.url = url;
            this.collection.create(Suggestions);
            this.collection.trigger('sync');
        }.bind(this));
    };

    module.exports = editView;
});