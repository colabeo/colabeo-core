define(function(require, exports, module) {
    // Import core Famous dependencies
    var View         = require('famous/View');
    var Surface      = require('famous/Surface');
    var Easing = require('famous-animation/Easing');
    var Favor = require('app/models/Favor');
    var LightBox = require('app/custom/LightBox');
    var Mod          = require("famous/Modifier");
    var Matrix       = require("famous/Matrix");

    function editView() {
        View.call(this);

        this.options = {
            inTransform: Matrix.identity,
//            inOpacity: 1,
//            inOrigin: [0.5, 0.5],
            outTransform: Matrix.identity,
//            outOpacity: 1,
//            outOrigin: [0.5, 0.5],
            showTransform: Matrix.identity,
//            showOpacity: 1,
//            showOrigin: [0.5, 0.5],
            inTransition: {duration: 0},
            outTransition: {duration: 300},
            overlap: true
        };


        this.bigSurface = new Surface({
            size: [undefined, undefined],
            properties:{
                background: "rgba(60, 66, 70, 0.60)",
                zIndex: 1000
            }
        });
        this.editSurface = new Surface({
            classes:['edit-favor-surface'],
            size: [600, 300],
            properties:{
                borderRadius: "10px",
                background: "rgba(59, 59, 59, 0.90)",
                color: 'rgba(245, 236, 236,1)',
                textAlign: "center",
                zIndex:1001
            }
        });

        this.editLightBox = new LightBox({
            inTransform: Matrix.scale(0.001,0.001,0.001),
            inOpacity: 1,
            inOrigin: [0.5, 0.5],
            outTransform: Matrix.scale(0.001,0.001,0.001),
            outOpacity: 1,
            outOrigin: [0.5, 0.5],
            showTransform: Matrix.identity,
            showOpacity: 1,
            showOrigin: [0.5, 0.5],
            inTransition: {duration: 500, curve: Easing.inQuadNorm()},
            outTransition: {duration: 300, curve: Easing.outQuintNorm()}
        });

        this._add(this.bigSurface);
        this._add(this.editLightBox);


        this.editSurface.on('click',function(e){
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
    }

    editView.prototype = Object.create(View.prototype);
    editView.prototype.constructor = editView;

    editView.prototype.renderFavor = function(model) {
        this.newContact = {};
        this.model=model;
        var title = '<div class="title">New Favor<i class="fa fa-times back-button"></i></div>';
        if (this.model instanceof Favor) title = 'Edit Favor';
        var html = '<form role="form">';
        html += '<div class="form-group-url"><div><span class="red-star">*</span><span>Website URL</span></div>';
        html += '<div><input type="text" class="form-control" id="input-url" placeholder="URL" name="url"';
        if (this.model)
            html += ' value="' + this.model.get('url') + '"';
        html += '></div></div>';
        html += '<div class="form-group-title"><div><span>Title</span></div>';
        html += '<div><input type="text" class="form-control" id="input-title" placeholder="Title" name="title"';
        if (this.model && this.model.get('title'))
            html += ' value="' + this.model.get('title') + '"';
        html += '></div></div></form>';

        html += '<div><span class="red-star">*</span><span>Require field</span><div class="done-favor">Done</div></div>'
        this.editSurface.setContent(title + html);
        this.editLightBox.show(this.editSurface);

    }

    editView.prototype.fillFavor = function (model){
        this.newFavor = _.extend(this.newFavor, model.attributes);
        if (this.newFavor) {
            if (!$('[name=url]').val()) $('[name=url]').val(this.newFavor.url);
            if (!$('[name=title]').val() && this.newFavor.title) $('[name=title]').val(this.newFavor.title);
        }
    };

    editView.prototype.getFavor = function(){
        var url = document.getElementById('input-url').value;
        var title = document.getElementById('input-title').value;
        if (!title) title = url;
        var newContact = {};
        newContact.url = url;
        newContact.title = title;
        return newContact;
    };

    module.exports = editView;
});