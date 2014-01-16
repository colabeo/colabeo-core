(function() {
	// ******************* custom event handler functions ***************************

	var Trello = window.Bobo.extend();

	Trello.prototype.onReady = function() {
		console.log('Trello onready is called');
	};

	// override the initialize function of Bobo
	Trello.prototype.initialize = function() {
		console.log("Trello init ...");
		
		this.setController({
			url : 'trello'
		});
		
		if (top === self) {
			if (window.TogetherJS) {
				TogetherJSConfig_cloneClicks = false;
			}
		}
		
		setUpListener(document, 'list-card');
		setUpListener(document, 'icon-close');
		
		// setUpListener(document, 'btnNext');
		// setUpListener(document, 'btnPrevious');
// 
		// // do not accept 'btn next'
		// setUpListener(document, 'btn');

		// setUpListenerByClassName('clsDesktopActionTabWrapper', 'clsDesktopActionTab');
		// setUpListener(document, 'clsBorderBox');

		function setUpListenerByClassName(delegatorClassName, elementClassName) {
			var delegator = document.getElementsByClassName(delegatorClassName)[0];
			if (delegator)
				setUpListener(delegator, elementClassName);
		}

		function setUpListener(delegator, elementClassName) {
			delegator.addEventListener("mouseup", function(event) {
				event = event || window.event;
				var target = event.target || event.srcElement;
				while (target && target != delegator) {
					if (target && target.classList.contains(elementClassName)) {
						var targets = Array.prototype.slice.call(document.getElementsByClassName(elementClassName));
						var index = Array.prototype.indexOf.call(targets, target);
						console.log('click', elementClassName, index);
						colabeo._sendToSimulator('event', {
							selector : elementClassName,
							index : index,
							action : 'click'
						});
						break;
					}
					target = target.parentNode;
				}
			});
		}
	};

	// add this adaptor to colabeoPortal
	window.colabeoPortal.addBobo(Trello);

})();
