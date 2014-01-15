/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/*global define, $, FileError, brackets, window, require */

// Require.js allows us to configure shortcut alias
require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/text'
    }
});

require(['views/app'], function (AppView) {
    'use strict';
    var app_view = new AppView();
});

var defaultList = "%7B%2269c20501-f0a7-eb88-79a4-65775b2fd180%22%3A%7B%22content%22%3A%22ebay.com%22%2C%22done%22%3Afalse%2C%22order%22%3A2%2C%22id%22%3A%2269c20501-f0a7-eb88-79a4-65775b2fd180%22%7D%2C%2211471abe-defe-8541-905b-5f1bcde38e3c%22%3A%7B%22content%22%3A%22trello.com%22%2C%22done%22%3Atrue%2C%22order%22%3A3%2C%22id%22%3A%2211471abe-defe-8541-905b-5f1bcde38e3c%22%7D%2C%2220b797b8-7f17-9ce2-57ff-ea88e26828fa%22%3A%7B%22content%22%3A%22yahoo.com%22%2C%22done%22%3Atrue%2C%22order%22%3A4%2C%22id%22%3A%2220b797b8-7f17-9ce2-57ff-ea88e26828fa%22%7D%2C%22468f9a02-3510-aa57-9a2b-d76e10c17b99%22%3A%7B%22content%22%3A%22airbnb.com%22%2C%22done%22%3Afalse%2C%22order%22%3A5%2C%22id%22%3A%22468f9a02-3510-aa57-9a2b-d76e10c17b99%22%7D%2C%2275f6bc2b-040d-db7d-2e86-d89d8063b33a%22%3A%7B%22content%22%3A%22yelp.com%22%2C%22done%22%3Afalse%2C%22order%22%3A6%2C%22id%22%3A%2275f6bc2b-040d-db7d-2e86-d89d8063b33a%22%7D%2C%22de7cc9be-955e-4559-cd87-2794d953e431%22%3A%7B%22content%22%3A%22slideshare.net%22%2C%22done%22%3Afalse%2C%22order%22%3A7%2C%22id%22%3A%22de7cc9be-955e-4559-cd87-2794d953e431%22%7D%7D";
if (!localStorage.getItem('todos-backbone-require') || localStorage.getItem('todos-backbone-require') == "{}") {
    localStorage.setItem('todos-backbone-require', unescape(defaultList));
}