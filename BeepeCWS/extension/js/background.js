(function() {
    var myID = localStorage.getItem("myID");
    var myName = localStorage.getItem("myName");
    var myRoom;
    var PHONE_URL  = "https://beepe.me";
//    var PHONE_URL  = "http://localhost:1337";

    var targetWindow;
    var dashboardTab;

    var isCalling = false;
    var curSnapshot;
    var badgeCount = 0;
    setBWIcon();
    preloadRingtone();
    initializeIncomingCall();

    chrome.browserAction.onClicked.addListener(launch);

    function launch() {
//        console.log("clicked");
        chrome.windows.getCurrent(function(w){
            targetWindow = w;
            if (!dashboardTab) {
                launchDashboard();
            } else {
                resizeTargetSite(400);
            }
        });
    }

    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        if (dashboardTab && tabId == dashboardTab.id) {
            dashboardTab = undefined;
            setBWIcon();
            resizeTargetSite(0);
        }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        console.log(request);
        if (request.data.data && request.data.data.action == "syncID") {
            if (myID == request.data.data.id) return;
            localStorage.setItem("myID", request.data.data.id);
            localStorage.setItem("myName", request.data.data.name);
            myID = request.data.data.id;
            myName = request.data.data.name;
            initializeIncomingCall();
        } else if (request.data.data && request.data.data.action == "setProperty") {
            myRoom = request.data.data.roomId;
        }
    });

    function setIcon() {
        chrome.browserAction.setIcon({
            path : 'images/19.png'
        });
    }

    function setBWIcon() {
        chrome.browserAction.setIcon({
            path : 'images/19_bw.png'
        });
    }

    var incomingCallRef, incomingMessageRef;
    function initializeIncomingCall() {
        if (incomingCallRef) {
            incomingCallRef.off();
        }
        incomingCallRef = new Firebase('https://colabeo.firebaseio.com/calls/' + myID);
        incomingCallRef.on('child_added', onAdd);
        incomingCallRef.on('child_removed', onRemove);
        incomingCallRef.on('child_changed', onRemove);

        if (incomingMessageRef) {
            incomingMessageRef.off();
        }
        incomingMessageRef = new Firebase('https://colabeo.firebaseio.com/history/' + myID + '/chats');
        incomingMessageRef.on('child_added', onAddMessage);
        incomingMessageRef.on('child_changed', onAddMessage);
    }

    function onAdd(snapshot) {
        curSnapshot = snapshot;
        if (!dashboardTab) {
            var data = snapshot.val();
            console.log(data);
            var opt = {
                type : "basic",
                title : data.person,
                message : 'Beepe Phone Call',
                iconUrl : "images/48.png",
                buttons : [
                    { title: "Accept" , iconUrl : "images/48_yes.png" } , { title: "Dismiss" , iconUrl : "images/48_no.png" }
                ]
            };
            startRingtone();
            chrome.notifications.create('call'+Date.now(), opt, function(){});
            badgeCount++;
            chrome.browserAction.setBadgeText({text: badgeCount.toString()});
        }
    }
    function onAddMessage(snapshot) {
        if (!dashboardTab) {
            var data = snapshot.val();
            if (!data.read) {
                var opt = {
                    type : "basic",
                    title : data.firstname + ' ' + data.lastname,
                    message : data.content,
                    iconUrl : "images/48.png",
                    buttons : [
                        { title: "Read Now" , iconUrl : "images/48_yes.png" } , { title: "Later" , iconUrl : "images/48_no.png" }
                    ]
                };
        //        startBeepeTone();
                chrome.notifications.create('chat'+data.time, opt, function(){});
                badgeCount++;
                chrome.browserAction.setBadgeText({text: badgeCount.toString()});
            }
        }
    }


    chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
        console.log(notificationId);
        if (notificationId.substr(0,4) == 'call') {
            if (buttonIndex === 0) {
                launch();
            } else {
                stopRingtone();
            }
        } else {
            if (buttonIndex === 0) {
                launch();
            } else {
    //            stopBeepeTone();
            }
        }

    });

    function onRemove() {
        stopRingtone();
    }

    function preloadRingtone() {
        if (document.getElementById('ringtone'))
            return;
        var e = document.createElement('video');
        e.controls = true;
        e.id = 'ringtone';
        e.loop = true;
        e.style.display = 'none';
        e.innerHTML = '<source src="http://cdn-dot-colabeo.appspot.com/audio/Marimba.mp3" type="audio/mpeg">';
        document.body.appendChild(e);
    }

    function stopRingtone() {
        isCalling = false;
        var e = document.getElementById('ringtone');
        e && (e.pause() || (e.currentTime = 0));
    }

    function startRingtone() {
        isCalling = true;
        var e = document.getElementById('ringtone');
        e && e.play();
        setTimeout(function() {
            if (dashboardTab) {
                chrome.tabs.sendMessage(dashboardTab.id, {
                    action : "incoming",
                    firstname : curSnapshot.val().firstname,
                    lastname : curSnapshot.val().lastname,
                    email : curSnapshot.val().email,
                    person : curSnapshot.val().person,
                    social : curSnapshot.val().source,
                    room : curSnapshot.name(),
                    answer : false
                });
            }
        }, 100);
    };

    function resizeTargetSite(w) {
        var maxWidth = window.screen.availWidth;
        var maxHeight = window.screen.availHeight;
        if (targetWindow) {
            var updateInfo = {
                left : 0,
                top : 0,
                width : maxWidth - w,
                height : maxHeight
            };
            chrome.windows.update(targetWindow.id, updateInfo);
        }
        if (dashboardTab) {
            var updateInfo = {
                left : window.screen.width - w,
                top : 0,
                width : w,
                height : maxHeight
            };
            chrome.windows.update(dashboardTab.windowId, updateInfo);
        }
    }

    function launchDashboard() {
        var w = 400;
        var maxWidth = window.screen.availWidth;
        var maxHeight = window.screen.availHeight;
        chrome.windows.create({
            url : PHONE_URL,
            type : 'popup',
            width : w,
            height : maxHeight,
            left : screen.width - w,
            top : 0
        }, function(window) {
            dashboardTab = window.tabs[0];
            resizeTargetSite(w);
            if (isCalling) {
                stopRingtone();
                // TODO: this is a hack
                setTimeout(function(){
                    chrome.tabs.sendMessage(dashboardTab.id, {
                        action : "incoming",
                        firstname : curSnapshot.val().firstname,
                        lastname : curSnapshot.val().lastname,
                        email : curSnapshot.val().email,
                        person : curSnapshot.val().person,
                        social : curSnapshot.val().source,
                        room : curSnapshot.name(),
                        answer : true
                    });
                },800);
            }
        });
        setIcon();
        badgeCount = 0;
        chrome.browserAction.setBadgeText({text: ''});
    }
}).call(this);
