var Common = window.Common = {
    API: {
        Widget: function() {},
        TVKeyValue: function() {}
    }
};

Common.API.Widget.prototype = {
    sendReadyEvent: function() {},
    sendExitEvent: function() {},
    sendReturnEvent: function() {},
    blockNavigation: function() {},
    putInnerHTML: function() {},
    getChannelWidgetListPath: function() {},
    getSearchWidgetListPath: function() {},
    runSearchWidget: function() {},
    checkSapTicket: function() {},
    requestSapTicket: function() {}
};

var SRect = window.SRect = function() {};
var deviceapis = window.deviceapis = {
    _plugin: function() {},
    tv: {
        window: {
            setRect: function() {},
            show: function() {},
            hide: function() {}
        }
    }
};

var managerWidget = window.managerWidget = {
    setExtraHeader: function() {}
};

var MoIPPlugin = document.getElementById("EmpSkype");
MoIPPlugin.Open = function(){};
MoIPPlugin.Execute = function(){};

var sef = document.getElementById("SefPlugin");
sef.Open = function() {};
sef.Execute = function() {};
sef.Close = function() {};
sef.OnEvent = function() {};