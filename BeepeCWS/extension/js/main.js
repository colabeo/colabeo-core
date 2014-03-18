//(function() {
    var dev = false;
    //change these two lines for loading local files
    var appEnginePort = 1250;
    var injectedScript = function() {
        colabeoBody.injectScript = function(url, callback) {
            var s = document.createElement('script');
            s.src = url;
            s.setAttribute('class', 'dmb-script');
            s.onload = function() {
                if (callback)
                    callback();
                this.parentNode.removeChild(this);
            };
            (document.head || document.documentElement).appendChild(s);
        };
        colabeoBody.addEventListener("FromContentScript", function(e) {
            colabeoBody.detail = e.detail;
        });
        colabeoBody.addEventListener("FromPopup", function(e) {

        });
        if (window.onExtensionMessage)
            colabeoBody.addEventListener("FromExtension", onExtensionMessage);
    };
    if (!document.getElementById('toggle')) {
        var colabeoBody = document.createElement('div');
        colabeoBody.setAttribute('id', 'colabeoBody');
        document.body.appendChild(colabeoBody);
        var toggle = document.createElement('div');
        if (dev) {
            toggle.setAttribute('onclick', 'javascript:((function(c){(c.colabeoPortal&&c.colabeoPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.colabeoPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https://localhost:443":"http://localhost:' + appEnginePort + '";window.colabeoBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="colabeoJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
        } else {
            toggle.setAttribute('onclick', 'javascript:((function(c){(c.colabeoPortal&&c.colabeoPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.colabeoPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="//cdn-dot-colabeo.appspot.com";window.colabeoBase=e;b.src="//cdn-dot-colabeo.appspot.com/core/entry.js?"+a.getTime();b.className="colabeoJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
        }
        toggle.setAttribute('id', 'toggle');
        document.body.appendChild(toggle);

        var load = document.createElement('div');
        load.setAttribute('id', 'load');
        if (dev) {
            load.setAttribute('onclick', 'javascript:((function(c){(c.colabeoPortal&&c.colabeoPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.colabeoPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https://localhost:443":"http://localhost:' + appEnginePort + '";window.colabeoBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="colabeoJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
        } else {
            load.setAttribute('onclick', 'javascript:((function(c){(c.colabeoPortal&&c.colabeoPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.colabeoPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="//cdn-dot-colabeo.appspot.com";window.colabeoBase=e;b.src="//cdn-dot-colabeo.appspot.com/core/entry.js?"+a.getTime();b.className="colabeoJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
        }
        // load.setAttribute('onclick', 'javascript:(function(c){(c.colabeoPortal&&c.colabeoPortal.set("mode","EXTENSION"));!c.colabeoPortal&&(function(){c._extension=1;var a=new Date,b=c.document.createElement("script"),e="//cdn-dot-colabeo.appspot.com";window.colabeoBase=e;b.src="//cdn-dot-colabeo.appspot.com/core/entry.js?"+a.getTime();b.className="colabeoJS";c.document.body&&c.document.body.appendChild(b)}());})(window)');
        //  load.setAttribute('onclick', 'javascript:(function(){if (window.colabeo)return;document.getElementById("toggle").click()})()');
        document.body.appendChild(load);

        injectJavascript(injectedScript);

        colabeoBody.addEventListener("FromFrontground", function(e) {
            console.log("FromFrontground", e.detail);
            chrome.runtime.sendMessage(e.detail);
        });
        colabeoBody.addEventListener("FromKoala", function(e) {
            console.log("FromKoala", e.detail);
            chrome.runtime.sendMessage(e.detail);
            if (e.detail.data && e.detail.data.action == 'updateUrl') {
                var message = e.detail.data;
                message.source = "remote";
                sendToFrontPage("FromExtension", message);
            }
        });

        var toggled = false;
        function onMessage(message, sender, sendResponse) {
            // console.log("onMessage", message.action);
            if (message.action === 'toggleKoala') {
    //			console.log("onMessage toggleKoala");
                if (!toggled) {
    //				console.log("onMessage toggleKoala click");
                    document.getElementById('toggle').click();
                    toggled = true;
                }
                //favicon off message
            } else if (message.action === 'updateUrl') {
                console.log("onMessage updateUrl" + message.url);
                message.source = "local";
                sendToFrontPage("FromExtension", message);
            } else if (message.action === 'load') {
                document.getElementById('load').click();
                var detail = {
                    type : "input",
                    source : 'colabeoApp',
                    value : '',
                    userName : "simulator",
                    deviceID : "simulator"
                };
                sendToFrontPage("FromPopup", detail);
            } else if (message.action == 'FromPopup') {
                if (message.detail)
                    sendToFrontPage("FromPopup", message.detail);
                sendResponse({
                    active : true
                });
            } else {
                if (!sender.tab)
                    sendToFrontPage("FromExtension", message);
            }
        };
        function sendToFrontPage(evtName, evtDetail) {
            var evt = new CustomEvent(evtName, {
                detail : evtDetail
            });
            colabeoBody.dispatchEvent(evt);
        }

        function javascriptToString(f) {
            var args = [];
            for (var i = 1; i < arguments.length; ++i) {
                args.push(JSON.stringify(arguments[i]));
            }
            return "(" + f.toString() + ")(" + args.join(",") + ");";
        }

        function injectJavascript(f) {
            var actualCode = javascriptToString(f);
            var script = document.createElement('script');
            script.textContent = actualCode;
            (document.head || document.documentElement).appendChild(script);
            script.parentNode.removeChild(script);
        }


        chrome.runtime.onMessage.addListener(onMessage);
    }
//}).call(this);