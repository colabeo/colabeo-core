(function() {
	var DEBUG = false;
	var Slideshare = window.Bobo.extend();

	Slideshare.prototype.initialize = function() {
		console.log("slideshare init ...");
		this.setInfo('iconClass', 'fui-play-circle');
		this.setInfo('priority', 2);
		this.setInfo('boboID', 'slideshare');
		this.setInfo('name', 'Remote Control for Slideshare');
		this.setInfo('description', 'This is a remote control for presentations on Slideshare');
		this.setInfo('type', 'specific');

		this.setInfo('ui', {
			nextButton : '.btnNext',
			previousButton : '.btnPrevious',
			firstButton : '.btnFirst',
			lastButton : '.btnLast',
			pageNumber : '.goToSlideLabel input',
			currentNote : '.commentsNotes .slide-notes:visible',
			notes : '#notesList li',
			pageCount : '.goToSlideLabel span',
			pageTrigger : '.player'
		});

		this.setInfo('slideChangeTimeout', null);

		//		colabeo._sendToSimulator('setData', {key: 'url', value: location.href});

		this.setController({
			url : 'slideshare'
		});

		if ( typeof player == 'undefined')
			return;

		this.setInputEventHandlers({
			'nextButton' : 'next',
			'previousButton' : 'previous',
			'firstButton' : 'firstSlide',
			'lastButton' : 'lastSlide',
			'notesSlider' : 'setSlide',
			'colabeoApp' : 'onReady',
			'colabeoVolume' : 'onVolume'
		});

		this.setupPageTrigger();
		var s = this;
		setTimeout(function() {
			s.refreshController.apply(s, []);
		}, 2000);
		colabeoBody.addEventListener("FromExtension", function(e) {
			console.log("slideshare: ", e.detail);
		});
	};
	// ********** custom event handler functions *************
	Slideshare.prototype.onReady = function() {
		this.refreshController();
	};

	Slideshare.prototype.next = function() {
		console.log("next");
		this._setSlide(this.getCurrentPageNumber() + 1);
		//		$(ui.nextButton).click();
	};

	Slideshare.prototype.previous = function() {
		this._setSlide(this.getCurrentPageNumber() - 1);
		//		$(ui.previousButton).click();
	};

	Slideshare.prototype.firstSlide = function() {
		var ui = this.getInfo('ui');
		$(ui.firstButton).click();
	};

	Slideshare.prototype.lastSlide = function() {
		var ui = this.getInfo('ui');
		$(ui.lastButton).click();
	};

	Slideshare.prototype.setSlide = function(num) {
		var slideChangeTimeout = this.getInfo('slideChangeTimeout');
		if (slideChangeTimeout)
			clearTimeout(slideChangeTimeout);
		var s = this;
		this.setInfo('slideChangeTimeout', setTimeout(function() {
			s._setSlide(num);
			s.setInfo('slideChangeTimeout', null);
		}, 100));
	};

	Slideshare.prototype._setSlide = function(num) {
		if (player.controller)
			player.controller.play(num);
		else
			player.jumpTo(num);
	};

	Slideshare.prototype.refreshController = function() {
		this.loadNotes();
		this.setCurrentPage(1);
	};

	Slideshare.prototype.onVolume = function(value) {
		if (value == 'up')
			this.next();
		else if (value == 'down')
			this.previous();
	};

	/* helpers */
	Slideshare.prototype.setupPageTrigger = function() {
		var ui = this.getInfo('ui');
		var triggerDelay = 50;
		if (player.controller)
			var trigger = $(ui.pageTrigger)[0];
		else
			var trigger = $('body')[0];
		var _this = {
			oldValue : this.getCurrentPageNumber()
		};
		var s = this;
		var onChange = function() {
			var newValue = s.getCurrentPageNumber();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				s.setCurrentPage(newValue);
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger)
			trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Slideshare.prototype.loadNotes = function() {
		this.callFunction('loadNotes', this.getNotes());
	};

	Slideshare.prototype.setCurrentPage = function(num) {
		this.callFunction('setCurrentPage', num);
	};

	Slideshare.prototype.getCurrentPageNumber = function() {
		if (player.controller)
			return parseInt(player.controller.currentPosition);
		else
			return player.getCurrentSlide();
	};

	Slideshare.prototype.getPageCount = function() {
		if (player.controller)
			return player.controller.slideCount;
		else
			return slideshare_object.totalSlides;
	};

	Slideshare.prototype.getNotes = function() {
		var ui = this.getInfo('ui');
		var toReturn = [];
		if ($(ui.notes).length) {
			var pageCount = this.getPageCount();
			for (var i = 0; i < pageCount; i++) {
				var note = $($(ui.notes)[i]).html();
				if (!note)
					note = "";
				var s = {
					'note' : note
				};
				toReturn.push(s);
			}
		}
		return toReturn;
	};

	window.colabeoPortal.addBobo(Slideshare);
})();

