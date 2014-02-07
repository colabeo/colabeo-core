define(function(require, exports, module) {
    var Favor = require('app/models/Favor');
    require("lib/backboneLocalStorage");

    module.exports = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("colabeo-favor-collection"),
        model: Favor,
        comparator: function(favor) {
            return favor.get('order');
        }
    })
});
