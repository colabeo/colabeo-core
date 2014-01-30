define(function(require, exports, module) {
    // Import core Famous dependencies

    var Surface      = require('famous/Surface');
    var View             = require('famous/View');
    var LogoView = require('app/view/LogoView');

    function InstallationView(options) {
        View.apply(this, arguments);

        this.buttonSurface = new Surface({
            size:[undefined, undefined],
            content: '<a class="btn btn-cta btn-lg install-link" link="https://chrome.google.com/webstore/detail/eccfcbafhnpojpjhdhlkoikpnbofhljf"><p>+ ADD TO CHROME</p></a>'
        });

        this.logoView = new LogoView();

//        this.surface = new Surface({
//            content: this.logoView,
//            size:[undefined,undefined]
//        });
//        this._add(this.surface);
        this._add(this.buttonSurface);

    }

    InstallationView.prototype = Object.create(View.prototype);
    InstallationView.prototype.constructor = InstallationView;


    module.exports = InstallationView;
});