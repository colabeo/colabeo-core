define(function(require, exports, module) {
    require("lib/backboneLocalStorage");

    // Generic Backbone Model
    module.exports = Backbone.Model.extend({
        // if url changed, need new name for the localstorage
        localStorage: new Backbone.LocalStorage("colabeo-settings-2"),
        defaults: {
        }
    });
});