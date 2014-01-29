define(function(require, exports, module) {
    // import famous dependencies
    var EventHandler = require('famous/EventHandler');

    function favorViewController() {

        // Set up event handlers
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventOutput.on('createDefaultList', this.createDefaultList);
        this.eventOutput.on('editFavor', this.onEditFavor);
        this.eventOutput.on('goBack', this.onGoBack);
        this.eventOutput.on('getFavor', this.onGetFavor);
    }

    favorViewController.prototype.onEditFavor = function(model){
        if (model) this.editView.renderFavor(model);
        else this.editView.renderFavor(undefined);
        this.editViewLightBox.show(this.editView);
    };

    favorViewController.prototype.onGoBack = function(e){
        this.editViewLightBox.hide();
    };

    favorViewController.prototype.onGetFavor = function(){
        var url = document.getElementById('input-url').value;
        var title = document.getElementById('input-title').value;
        if (!title) title = url;
        var newContact = {};
        newContact.url = url;
        newContact.title = title;
        this.summitFavor(newContact);
    };

    favorViewController.prototype.createDefaultList = function(){
        alert('dd');
        var defaultList = ['google.com', 'facebook.com', 'loveq.cn', 'weibo.com', 'baidu.com'];
        defaultList.map(function(url){
            this.summitFavor({url: url});
        }.bind(this));
    };


    favorViewController.prototype.summitFavor = function(favor){
        this.collection.add(favor);
        this.collection.trigger('sync');
    };

    module.exports = favorViewController;
});