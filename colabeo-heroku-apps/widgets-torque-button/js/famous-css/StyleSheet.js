define(function(require, exports, module) {
    // This script allows you to modify css with JavaScript
    var StyleManager = require('./StyleManager');

    function buildStyleSheet() {
        // Styles must at least be declared in your css file - they can be empty
        // Set css style properties like this:
        StyleManager.setRule('body', 'font-size', window.innerWidth*0.02);
        StyleManager.setRule('body', 'background', '#000000');

        // Set the styles -------------------+
        StyleManager.setStyles();
    }

    exports.buildStyleSheet = buildStyleSheet;

});