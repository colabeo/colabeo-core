define(function(require, exports, module) {
    // Import core Famous dependencies

    var constant = require ('app/Constant');
    var Surface      = require('famous/Surface');
    var View             = require('famous/View');


    function InstallationView(options) {
        View.apply(this, arguments);

        this.buttonSurface = new Surface({
            size:[undefined, undefined],

            content: '<a class="btn btn-cta btn-lg install-link" link="https://chrome.google.com/webstore/detail/eccfcbafhnpojpjhdhlkoikpnbofhljf"><p>+ ADD TO CHROME</p></a>'
        });

        this._link(this.buttonSurface);
//        this.setContent();
    };

    InstallationView.prototype = Object.create(View.prototype);
    InstallationView.prototype.constructor = InstallationView;


    module.exports = InstallationView;
});