(function() {
	// ******************* custom event handler functions ***************************

	var Generic = window.Bobo.extend();

	Generic.prototype.onReady = function() {
		console.log('onready is called');
	};

	// override the initialize function of Bobo
	Generic.prototype.initialize = function() {
		console.log("Generic init ...");
		if (top === self) {
			colabeoPortal.turnOnFavicon();
		}
		this.setController({
			url : 'generic'
		});
		
		if (top === self) {
			if (window.TogetherJS) {
				TogetherJSConfig_suppressJoinConfirmation = true;
				TogetherJSConfig_suppressInvite = true;
				TogetherJSConfig_disableWebRTC = true;
				TogetherJSConfig_youtube = true;
				TogetherJSConfig_dontShowClicks = false;
				TogetherJSConfig_cloneClicks = true;
			}
			colabeo._sendToSimulator('event', {
				action : "getProperty"
			});
		}
		
		var syncId;
		var userName;
		var userId;
		var enableTogetherjs = function () {
			if (top !== self) return;
			if (syncId && window.TogetherJS && !TogetherJS.running) {
				TogetherJSConfig_getUserName = function () {return userName;};
				TogetherJS.startup._joinShareId = syncId;
				TogetherJS(window);
			}
		};
		var disableTogetherjs = function () {
			if (top !== self) return;
			if (window.TogetherJS && TogetherJS.running) {
				TogetherJS(window);
			}
		};
		colabeoBody.addEventListener("FromExtension", function(e) {
			console.log("generic: ", e.detail);
			if (e.detail.id && e.detail.name ) {
				userId = e.detail.id;
				userName = e.detail.name;
				syncId = e.detail.roomId;
				enableTogetherjs();
				window.colabeoSyncId = syncId;
			}
			if (!e.detail.data) return;
			var evtData = e.detail.data.data;
			switch(evtData.action) {
				case "endCall":
					if (top === self) {
						disableTogetherjs();
					}
					break;
				case "turnOn":
					if (top === self) {
						colabeoPortal.turnOnFavicon();
					}
					break;
				case "turnOff":
					if (top === self) {
						colabeoPortal.turnOffFavicon();
					}
					break;
				case "sync":
					if (top === self) {
						var url = window.location.href;
						colabeo._sendToSimulator('event', {
							url : url,
							action : "urlChange"
						});
						colabeo._sendToSimulator('event', {
							action : "getProperty"
						});
					}
					break;
				case "urlChange":
					if (top === self) {
						if (window.location.href == evtData.url)
							return;
						window.location = evtData.url;
					}
					break;
				// case "toggleSyncMouse":
					// if (top === self) {
						// if (window.TogetherJS) {
							// TogetherJS(window);
							// colabeo._sendToSimulator('event', {
								// syncId : syncId,
								// action : "syncMouse"
							// });
						// }
					// }
					// break;		
				// case "syncMouse":
					// if (top === self) {
						// if (window.TogetherJS && !TogetherJS.running) {
							// if (evtData.syncId) {
								// TogetherJSConfig_getUserName = function () {return userName;};
								// TogetherJS.startup._joinShareId = evtData.syncId;
								// TogetherJS(window);
							// }
						// }
					// }
					// break;	
				case "click":
					if (false && window.jQuery) {
						if (evtData.index >= 0)
							var dom = jQuery(evtData.selector)[evtData.index];
						else
							var dom = jQuery(evtData.selector);
					} else {
						if (evtData.index >= 0)
							var dom = document.getElementsByClassName(evtData.selector)[evtData.index];
						else
							var dom = document.getElementsByClassName(evtData.selector);
					}
					dom.click();
					break;
				default:
			}
		});

	};

	// add this adaptor to colabeoPortal
	window.colabeoPortal.addBobo(Generic);

})();
