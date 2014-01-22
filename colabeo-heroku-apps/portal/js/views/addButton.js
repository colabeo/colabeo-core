/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/*global define, $, FileError, brackets, window */
define(['jquery', 'underscore', 'backbone','text!templates/addButton.html'], function ($, _, Backbone,addButton) {
    'use strict';
    var AddView = Backbone.View.extend({

        tagName:"div",
        className:"span3",

        template: _.template(addButton),

        events:{},

        initialize: function(){
            _.bindAll(this, 'render');
//            this.model.bind('add', this.render);
        },

        render: function(){
            $(this.el).html(this.template());
            return this;
        }

    });
    return AddView;
});