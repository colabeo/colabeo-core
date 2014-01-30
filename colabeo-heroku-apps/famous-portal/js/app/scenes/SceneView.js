define(function(require, exports, module) { 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
    var Surface = require('famous/Surface'); 
    var Modifier = require('famous/Modifier');
    var SceneController = require('app/SceneController');
    var Dropdown = require('famous-ui/Dropdown/Dropdown');

    /*
     * @constructor
     */
    function SceneViewer () {
        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );

        this.scenes;
        this.order;

    }

    SceneViewer.prototype = Object.create( View.prototype );
    SceneViewer.prototype.constructor = SceneViewer;

    SceneViewer.DEFAULT_OPTIONS = {

    }

    SceneViewer.prototype.init = function  () {
        this.scenes = SceneController.getOrderedScenes();
        this.order = SceneController.getSceneOrder();

        var data = [];

        for (var i = 0; i < this.scenes.length; i++) {
            data.push({
                value: this.order[i],
                name: this.scenes[i].NAME,
                content: [this.scenes[i].IMAGE]
            });
        };

        this.dropdown = new Dropdown({
            items: data,
            height: data.length * 50,
            autoClose: true,
            defaultSelected: SceneController.getCurrentIndex(),
            itemProperties: { 
                'color' : '#fff',
                'backgroundColor': 'transparent'
            
            },
            labelProperties: { 
                'color' : '#fff',
                'backgroundColor': 'transparent'
            },
            itemTemplate: function ( content, image ) {
                var padding = 14;
                var halfPadding = padding * 0.5 ;
                return '' + 
                    '<img src="' + image + '" width="' + (this.options.itemSize[1] - padding) + 'px" style="position: absolute; left: ' + halfPadding + 'px; top: ' + halfPadding + 'px;"></img>' + 
                    '<h3 style="position:absolute; left:' + (this.options.itemSize[1] + padding) + 'px;top:' + (halfPadding + 5) + 'px;">' + content + '</h5>';
            },
            labelTemplate: function (content , image) {
                var padding = 14;
                var halfPadding = padding * 0.5 ;
                return '' + 
                    '<img src="' + image + '" width="' + (this.options.itemSize[1] - padding) + 'px" style="position: absolute; left: ' + halfPadding + 'px; top: ' + halfPadding + 'px;"></img>' + 
                    '<h3 style="position:absolute; left:' + (this.options.itemSize[1] + padding) + 'px;top:' + (halfPadding + 5) + 'px;">' + content + '</h5>';
            }
        });

        this.dropdown.setSize([window.innerWidth * 0.25, 25]);
        this.dropdown.init();
        this.dropdownMod = new Modifier({ 
            origin: [0.5, 0.01],
            size: this.dropdown.getSize()
        });

        this.node.add( this.dropdownMod ).link( this.dropdown);
       
        this.events();
    }

    SceneViewer.prototype.events = function () {

        this.dropdown.on('change', function ( arg ) {
            SceneController.setScene( arg.value );
        });
        var silentDropdown = (function ( arg ) {
            this.dropdown.set( arg, true );
        }).bind(this);

        SceneController.on('next', silentDropdown);
        SceneController.on('prev', silentDropdown);
    }

    SceneViewer.prototype.setCtx = function (ctx) {
        ctx.add( this );
        this.init();
    }


    var sceneViewer = new SceneViewer();
    module.exports = sceneViewer;
});
