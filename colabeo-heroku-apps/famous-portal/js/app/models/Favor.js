define(function(requre,exports,module){
    module.exports = Backbone.Model.extend({
        initialize: function () {
            if (!this.get("pic")) {
                this.set({
                    "pic": 'http://mini.s-shot.ru/?'+this.get('url')
//                    "hit": 0
                });
            }
        },
        clear: function () {
            this.destroy();
        }
    });
});