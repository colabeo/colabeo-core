define(function(require, exports, module) {
    // Import core Famous dependencies
    var FamousEngine = require('famous/Engine');
    var Surface      = require('famous/Surface');
    var View             = require('famous/View');
//    var LogoView = require('app/view/LogoView');
    var Mod = require('famous/Modifier');
    var FM = require('famous/Matrix');
    var Engine = require('famous/Engine');
    var Utils       = require('famous-utils/Utils');

    function InstallationView(options) {
        View.apply(this, arguments);

        this.buttonSurface = new Surface({
            size:[undefined, undefined],
            content: '<a class="btn btn-cta btn-lg install-link" link="https://chrome.google.com/webstore/detail/ecleeepjaolfenbeoehehfnaldpdikbe"><p>+ ADD TO CHROME</p></a>'
        });

//        this.logoView = new LogoView();
//
//        this._add(this.logoView);
        this._add(this.buttonSurface);

//        FamousEngine.on('resize', function(){
//            this.logoView.setTorquePos.bind(this.logoView);
//        }.bind(this));

        var iframeUrl;
        if (window.location.search)
            iframeUrl = '/call' + window.location.search;
        else
            iframeUrl = '/';

        if (Utils.isMobile()) {
            window.location = iframeUrl;
        }
        this.iframeSurface = new Surface({
            size:[400, 0.84* window.innerHeight],
            content: '<iframe src="' + iframeUrl + '" class="iframe-colabeo-dashboard"></iframe>'
        });

//        this.iframeSurface.on('click', function(e){
//            e.stopPropagation();
//        });

        var mod = new Mod({
            transform: FM.translate(0,0,100),
            origin: [0.82, 0.6]
        })

        this._add(mod).link(this.iframeSurface);

        Engine.on('resize', function(e){
            this.iframeSurfaceResize();
        }.bind(this));
    }

    InstallationView.prototype = Object.create(View.prototype);
    InstallationView.prototype.constructor = InstallationView;

    InstallationView.prototype.iframeSurfaceResize = function (){
        this.iframeSurface.setSize([400, 0.84 * window.innerHeight]);
    };

    module.exports = InstallationView;
});