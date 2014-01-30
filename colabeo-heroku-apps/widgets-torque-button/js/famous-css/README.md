Import the code: 

    var StyleSheet = require('app/StyleSheet');

Build the styles like this:

    StyleSheet.buildStyleSheet();

===============================

To modify styles in JS, modify StyleSheet.js.
In order to set styles in JS, the styles must be declared in a css file. It's okay to leave the styles empty in CSS.

Set the styles like this:

        StyleManager.setRule('body', 'font-size', window.innerWidth*0.02);
        StyleManager.setRule('body', 'background', '#000000');

Once you've set your styles, process them so they're added to the CSS:

        StyleManager.setStyles();