/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/*global define, $, FileError, brackets, window */
define(['jquery', 'underscore', 'backbone', 'collections/todos', 'views/todos', 'views/addButton', 'text!templates/stats.html', 'text!templates/markalldone.html'], function ($, _, Backbone, Todos, TodoView, AddView, statsTemplate, markAllDoneTemplate) {
    'use strict';
    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: $("#todoapp"),

        // Our template for the line of statistics at the bottom of the app.
        statsTemplate: _.template(statsTemplate),

        // Our template for marking all todo done
        markAllDoneTemplate: _.template(markAllDoneTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #new-todo": "createOnEnter",
            "keyup #new-todo": "showTooltip",
            "click .todo-clear a": "clearCompleted",
            "click #mark-all-done": "toggleAllComplete"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');

            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#mark-all-done");

            Todos.bind('add', this.addOne);
            Todos.bind('reset', this.addAll);
            Todos.bind('all', this.render);

            Todos.fetch();

            $(document).ready(function($) {
                $('body').on('click','.install-link',function(){
                    var url = $(this).attr('link');
                    if (window.location.host.indexOf('colabeo.com')>=0 && window.chrome && window.chrome.webstore) chrome.webstore.install(url);
                    else {
                        window.open(url, '_blank');
                    }
                });
                setTimeout(function(){
                    if (window.colabeoBody) {
                        $('#mainView').fadeIn('slow');
                        $('#installationView').hide();
//                        $('body').addClass("installed");
                    }
                    else {
                        $('#installationView').fadeIn('slow');
                        $('#mainView').hide();
//                        $('body').addClass("uninstalled");
                    }
                },1000);
            });

            var addView = new AddView();
            this.$("#todo-list").append(addView.render().el);
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function () {
            var done = Todos.done().length;
            var remaining = Todos.remaining().length;

            this.$('#todo-stats').html(this.statsTemplate({
                total: Todos.length,
                done: done,
                remaining: remaining
            }));

            this.allCheckbox.html(this.markAllDoneTemplate({
                label: 'Mark all done',
                checked: !remaining
            }));
        },

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function (todo) {
            var view = new TodoView({
                model: todo
            });
            this.$("#todo-list").prepend(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        addAll: function () {
            Todos.each(this.addOne);
        },

        // Generate the attributes for a new Todo item.
        newAttributes: function () {
            var getHostName = function ( url ) {
                return url;
                var a = document.createElement('a');
                a.href = url;
                return a.hostname;
            };
            var hostname = getHostName(this.input.val());
            return {
                content: hostname,
                order: Todos.nextOrder(),
                done: false
            };
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            Todos.create(this.newAttributes());
            this.input.val('');
        },

        // Clear all done todo items, destroying their models.
        clearCompleted: function () {
            _.each(Todos.done(), function (todo) {
                todo.clear();
            });
            return false;
        },

        // Lazily show the tooltip that tells you to press `enter` to save
        // a new todo item, after one second.
        showTooltip: function (e) {
            var tooltip = this.$(".ui-tooltip-top");
            var val = this.input.val();
            tooltip.fadeOut();
            if (this.tooltipTimeout) {
                window.clearTimeout(this.tooltipTimeout);
            }
            if (val === '' || val === this.input.attr('placeholder')) {
                return;
            }
            var show = function () {
                tooltip.show().fadeIn();
            };
            this.tooltipTimeout = _.delay(show, 1000);
        },

        // Change each todo so that it's `done` state matches the check all
        toggleAllComplete: function () {
            var done = Todos.remaining().length;
            
            Todos.each(function (todo) {
                todo.save({
                    'done': done
                });
            });
        }

    });
    return AppView;
});