define(function(require, exports, module) {
    var Scene = require('famous/Scene');
    var Surface = require('famous/Surface');
    var Utility = require('famous/Utility');
    var View = require('famous/View');

    function NavigationBar(options) {
        View.apply(this, arguments);

        this.title = new Surface({
            classes: this.options.classes,
            content: this.options.content
        });

        this.back = new Surface({
            size: [this.options.size[1], this.options.size[1]],
            classes: this.options.classes,
            content: this.options.backContent
        });
        this.back.on('click', function() {
            this.eventOutput.emit('back', {});
        }.bind(this));

        this.more = new Surface({
            size: [this.options.size[1], this.options.size[1]],
            classes: this.options.classes,
            content: this.options.moreContent
        });
        this.more.on('click', function() {
            this.eventOutput.emit('more', {});
        }.bind(this));

        this.layout = new Scene({
            id: 'master',
            size: this.options.size,
            target: [
                {
                    transform: Utility.transformInFrontMatrix,
                    origin: [0, 0.5],
                    target: this.back
                },
                {
                    origin: [0.5, 0.5],
                    target: this.title
                },
                {
                    transform: Utility.transformInFrontMatrix,
                    origin: [1, 0.5],
                    target: this.more
                }
            ]
        });

        this.node.link(this.layout);

        this.optionsManager.on('change', function(event) {
            var key = event.id;
            var data = event.value;
            if(key === 'size') {
                this.layout.id['master'].setSize(data);
                this.title.setSize(data);
                this.back.setSize([data[1], data[1]]);
                this.more.setSize([data[1], data[1]]); 
            }
            else if(key === 'backClasses') {
                this.back.setOptions({classes: this.options.classes.concat(this.options.backClasses)});
            }
            else if(key === 'backContent') {
                this.back.setContent(this.options.backContent);
            }
            else if(key === 'classes') {
                this.title.setOptions({classes: this.options.classes});
                this.back.setOptions({classes: this.options.classes.concat(this.options.backClasses)});
                this.more.setOptions({classes: this.options.classes.concat(this.options.moreClasses)});
            }
            else if(key === 'content') {
                this.setContent(this.options.content);
            }
            else if(key === 'moreClasses') {
                this.more.setOptions({classes: this.options.classes.concat(this.options.moreClasses)});
            }
            else if(key === 'moreContent') {
                this.more.setContent(this.options.content);
            }
        }.bind(this));
    };

    NavigationBar.prototype = Object.create(View.prototype);
    NavigationBar.prototype.constructor = NavigationBar;

    NavigationBar.DEFAULT_OPTIONS = {
        size: [undefined, 50],
        backClasses: ['back'],
        backContent: '&#x25c0;',
        classes: ['navigation'],
        content: '',
        moreClasses: ['more'],
        moreContent: '&#x271a;'
    };

    NavigationBar.prototype.setContent = function(content) {
        return this.title.setContent(content);
    };

    module.exports = NavigationBar;
});
