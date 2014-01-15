var disableNow = false;
var curCallID;
var curUrl = "";
// var myID = "634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D";
// var myName = "Jeff Lin";
var myID = "28BE7932-53F1-024F-063C-877712F6861F";
var myName = "Chapman";

//register contact list click event
$(document).ready(function() {
	$(".user").on('click', function(evt) {
		console.log('browserID: ' + $(evt.currentTarget).attr('browserID'));
		console.log('person: ' + $(evt.currentTarget).find(".ui-li-heading").text());
		curCallID = $(evt.currentTarget).attr('browserID');
		$('.incperson').text($(evt.currentTarget).find(".ui-li-heading").text());
		$('.incsocial').text("Yammer");
		$("#showPopup").click();
		call(curCallID);
	});
	
	$("#answer").on('click', function(evt) {
		answer();
	});

	$(".endBtn").on('click', function(evt) {
		removeVideoChat();
		if (curCallID)
			hangup(curCallID);
		curCallID = "";
	});
	sendMessage("event", {data: {action:"syncID", id: myID}});
	$(".syncBtn").on('click', function(evt) {
		sendMessage("event", {data: {action:"sync"}});
	});
	
	$("#acceptBtn").on('click', function() {
		setTimeout(answer, 600);
	});
	
	$("#declineBtn").on('click', function() {
		if (myID)
			hangup(myID);
	});

	$("#gotoBtn").on('click', function(evt) {
		var url = $('#url');
		if (url.val() != '') {
			sendMessage("event", {
				url : url.val(),
				action : 'urlChange'
			});
			$('.urlList ul').append('<li><a class="urlListBtn">' + url.val() + '</a></li>');
			$('.urlList ul').listview('refresh');
			url.val('');
		}
	});
});

//for jQuery mobile event
$(document).on('pageinit', function(e) {
	$("#url").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#gotoBtn").click();
		}
	});

	$(".urlList").on('click', function(evt) {
		console.log(evt.target.text);
		demobo.mobile.fireInputEvent('gotoUrl', evt.target.text);
	});
});

function call(outgoingId) {
	var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
	outgoingCallRef.push({
		name : myID,
		person : myName
	});
	outgoingCallRef.on('child_removed', function(snapshot) {
		var callerId = snapshot.val()['name'];
		if (callerId == myID) {
			if ($('#popup:visible')[0] && !$('#chatContainer')[0])
				injectVideoChat(snapshot.name());
		} else {
			$(".endBtn").click();
		}
	});
}

function hangup(outgoingId) {
	var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
	outgoingCallRef.remove();
}
function answer() {
	var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + myID);
	outgoingCallRef.remove();
	outgoingCallRef.on('child_removed', function(snapshot) {
		var roomID = snapshot.name();
		if ($('#popup:visible')[0] && !$('#chatContainer')[0]) {
			injectVideoChat(roomID);
		}
	});
}

function injectVideoChat(roomId) {
	if (!document.getElementById('chatContainer')) {
		var e = document.createElement('div');
		e.id = 'chatContainer';
		e.style.position = 'fixed';
		e.style.bottom = '30px';
		e.style.right = '0px';
		e.style.zIndex = '999';
		document.getElementById('popup').appendChild(e);
	}
	var i = document.createElement('iframe');
	i.src = 'https://koalabearate.appspot.com/?r=' + roomId;
	i.className = 'videoChatFrame';
	i.id = roomId;
	i.style.width = '100%';
	document.getElementById('chatContainer').appendChild(i);
}

function removeVideoChat() {
	$('#chatContainer').remove();
}

function sendMessage(type, data) {
	if (!demoboBody)
		return;
	var evt = new CustomEvent("FromKoala", {
		detail : {
			type : type,
			data : data
		}
	});
	demoboBody.dispatchEvent(evt);
}

function onExtensionMessage(e) {
	if (disableNow) return;
	console.log("onExtensionMessage: ", e.detail);
	if (e.detail.type == "urlUpdate") {
		curUrl = e.detail.data.url;	
	}
	else if (e.detail.action == "incoming")	{
		setCallerInfo({fromPerson: e.detail.person, fromSocial: e.detail.social});
	}
	else if ($(".videoChatFrame")[0]) {
		$(".videoChatFrame")[0].contentWindow.postMessage(JSON.stringify(e.detail), "*");	
	}
}

function onRemoteMessage(e) {
	var cmd = JSON.parse(evt.data);
	console.log("onRemoteMessage: ", e.detail);
}

addEventListener("message", function(e) {
	disableNow = true;
	setTimeout(function(){
		disableNow = false;
	},1000);
	var evt = JSON.parse(e.data);
	console.log("onRemoteMessage: ", evt);
	sendMessage("event", evt);
}, false);

function setCallerInfo(args) {
	$('.incperson').text(args.fromPerson);
	$('.incsocial').text(args.fromSocial);
	window.location = "#p";
}
