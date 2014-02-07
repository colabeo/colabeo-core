define(function(require, exports, module) {
    var Suggestions = require('app/models/Suggestions');
    require("lib/backboneLocalStorage");

    module.exports = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("colabeo-suggestions-collection"),
        model: Suggestions,
        comparator: function(favor) {
            return favor.get('order');
        }
    })
});
