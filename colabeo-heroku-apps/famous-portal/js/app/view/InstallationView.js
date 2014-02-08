define(function(require, exports, module) {
    // Import core Famous dependencies
    var FamousEngine = require('famous/Engine');
    var Surface      = require('famous/Surface');
    var View             = require('famous/View');
    var LogoView = require('app/view/LogoView');

    function InstallationView(options) {
        View.apply(this, arguments);

        this.buttonSurface = new Surface({
            size:[undefined, undefined]
//            content: '<a class="btn btn-cta btn-lg install-link" link="https://chrome.google.com/webstore/detail/eccfcbafhnpojpjhdhlkoikpnbofhljf"><p>+ ADD TO CHROME</p></a>'
        });

        this.logoView = new LogoView();

        this._add(this.logoView);
        this._add(this.buttonSurface);

        FamousEngine.on('resize', function(){
            this.logoView.setTorquePos.bind(this.logoView);
        }.bind(this));
    }

    InstallationView.prototype = Object.create(View.prototype);
    InstallationView.prototype.constructor = InstallationView;


    module.exports = InstallationView;
});