(function(){
  var DEBUG = false;

  var Pandora = Bobo.extend();

  Pandora.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test2.png';
    this.setInfo('iconClass', 'fui-play-circle');
    this.setInfo('priority', 2);
    this.setInfo('boboID', 'pandora');
    this.setInfo('name', 'Remote Control for pandora');
    this.setInfo('description', 'This is a remote control for pandora');
    this.setInfo('type', 'specific');


    this.setController({
      url: 'http://rc1.colabeo.com/v1/momos/pandora/control.html?0201'
    });

    this.setInputEventHandlers({
      'playPauseButton' : 'playPause',
			'playButton' : 	  	'play',
			'pauseButton' :   	'pause',
			'nextButton' : 	  	'next',
			'loveButton' : 	  	'like',
			'spamButton' : 	  	'dislike',
			'volumeSlider' :   	'setVolume',
			'stationItem' :   	'chooseStation',
			'colabeoVolume' :   	'onVolume',
			'colabeoApp' : 	  	'onReady'
    });

    this.setInfo('last3PlayedSongs', []);
    this.setInfo('curState', {isPlaying: false, volume:50});
    this.setInfo('slideChangeTimeout', null);
    this.setInfo('ui', {
  		playPauseButton: 	'.playButton:visible, .pauseButton:visible',
  		playButton: 		'.playButton',
  		pauseButton: 		'.pauseButton',
  		nextButton: 		'.skipButton',
  		previousButton: 	'',
  		likeButton: 		'.thumbUpButton',
  		dislikeButton:		'.thumbDownButton',
  		volume:				'.volumeBackground',
  		title: 				'.playerBarSong',
  		artist: 			'.playerBarArtist',
  		album: 				'.playerBarAlbum',
  		coverart:			'.stationSlides:visible .art[src], .playerBarArt',
  		songTrigger: 		'#playerBar .nowplaying',
  		stationTrigger: 	'.middlecolumn',
  		selectedStation:	'.stationChangeSelector .textWithArrow, .stationChangeSelectorNoMenu p',
  		stationCollection:	'.stationListItem .stationName',
  		albumCollection:	'',
  		playlistTrigger: 	''
    });
		this.setupSongTrigger();
		this.setupStationTrigger();
		this.setupStateTrigger();
  };


  Pandora.prototype.resume = function(){
    console.log('resume is called');
  };
	// ********** custom event handler functions *************
	Pandora.prototype.onReady = function () {
    console.log('onReady called');
		this.refreshController();
    this.sendStationList();
    this.sendNowPlaying();
//    this.sendLast3();
    this.syncState();
	};

	Pandora.prototype.playPause = function() {
    console.log('playpause called');
		$(this.getInfo('ui').playPauseButton).click();
	};

	Pandora.prototype.play = function() {
    console.log('play called')
		$(this.getInfo('ui').playButton).click();
	};

	Pandora.prototype.pause = function() {
		$(this.getInfo('ui').pauseButton).click();
	};

	Pandora.prototype.next = function() {
    console.log('next pressed');
		$(this.getInfo('ui').nextButton).click();
	};

	Pandora.prototype.like = function() {
		$(this.getInfo('ui').likeButton).click();
	};

	Pandora.prototype.dislike = function() {
		$(this.getInfo('ui').dislikeButton).click();
	};

	Pandora.prototype.setVolume = function(num, evt) {
		num = parseInt(num);
		if (num==this.getVolume()) return;
		$(this.getInfo('ui').volume).show();
		var min = this.getAbsPosition($('.volumeBar')[0]).left + 22;
		var max = (min - 22) + $('.volumeBar').width() -22;
		var target = Math.round((num / 100) * (max - min)) + min;
		$(this.getInfo('ui').volume).show().trigger( {
			type : 'click',
			pageX : target
		});
	};

	Pandora.prototype.onVolume = function(value) {
		if (value=='up') this.setVolume(parseInt(this.getVolume())+5);
		else if (value=='down') this.setVolume(parseInt(this.getVolume())-5);
		else this.setVolume(value*100);
	};

	Pandora.prototype.chooseStation = function(index) {
		index = parseInt(index);
		$($(this.getInfo('ui').stationCollection)[index]).find('#shuffleIcon,.stationNameText').click();
	};


	Pandora.prototype.refreshController = function() {
    console.log('refreshController called');
		this.sendStationList();
    var _this = this
//		setTimeout(function(){_this.sendLast3()},100);
		this.syncState();
	};


	//helpers 
	Pandora.prototype.setupSongTrigger = function() {
    console.log('setupsongtrigger called');
		var triggerDelay = 50;
		var longDelay = 500;
		var trigger = $(this.getInfo('ui').songTrigger)[0];
		var _this = {
			oldCoverart : $(this.getInfo('ui').coverart).attr('src'),
			oldTitle : $(this.getInfo('ui').title).text()
		};
		var maxChecks = 10;
    var pandoraObj = this;
		var checkTitle = function() {
			var newTitle = $(pandoraObj.getInfo('ui').title).text();
			if (newTitle && _this.oldTitle !== newTitle) {
				_this.oldTitle = newTitle;
				checkCoverart(maxChecks);
			}
		};
		var checkCoverart = function(checksLeft) {
			var newCoverart = $(pandoraObj.getInfo('ui').coverart).attr('src');
			if (newCoverart && _this.oldCoverart !== newCoverart) {
				_this.oldCoverart = newCoverart;
				pandoraObj.sendNowPlaying();
			} else if (checksLeft) {
				setTimeout(function(){
					checkCoverart(checksLeft-1);
				}, longDelay);
			} else {
				var newCoverart = $(pandoraObj.getInfo('ui').coverart).attr('src');
				_this.oldCoverart = newCoverart;
				pandoraObj.sendNowPlaying();
			}
		}
		var delay = function() {
			setTimeout(checkTitle, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Pandora.prototype.setupStationTrigger = function() {
    console.log('setupStationTrigger called');
		var triggerDelay = 50;
		var trigger = $(this.getInfo('ui').stationTrigger)[0];
		var _this = {
			oldValue : $(this.getInfo('ui').selectedStation).text()
		};
    var pandoraObj = this;
		var onChange = function() {
			var newValue = $(pandoraObj.getInfo('ui').selectedStation).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				pandoraObj.sendStationList();
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Pandora.prototype.setupStateTrigger = function() {
    console.log('setupStateTrigger called');
    var _this = this;
		$(this.getInfo('ui').volume).on('drag click', function(){_this.syncState()});
		$(this.getInfo('ui').playButton + ',' + this.getInfo('ui').pauseButton).on('click', function(){_this.syncState()});
	};

	Pandora.prototype.getAbsPosition = function(element) {
    console.log('getAbsPosition called');
		if (element) {
			var oLeft = 0;
			var oTop = 0;
			var o = element;
			do {
				oLeft += o.offsetLeft;
				oTop += o.offsetTop;
			} while (o = o.offsetParent);
			return {
				'left' : oLeft,
				'top' : oTop
			};
		} else {
			return {};
		}
	};

	Pandora.prototype.getNowPlayingData = function() {
    console.log('getNowPlayingData called');
		return this.getInfo('last3PlayedSongs');
	};

	Pandora.prototype.getCurrentSong = function() {
    console.log('getCurrentSong called');
		var imgURL = $(this.getInfo('ui').coverart).attr('src');
		if (!imgURL) return;
		if (imgURL.substr(0,4)!='http') imgURL = "http://www.pandora.com/img/no_album_art.jpg"; //document.location.origin + imgURL;
		return {
			'title' : $(this.getInfo('ui').title).text(),
			'artist' : $(this.getInfo('ui').artist).text(),
			'album' : $(this.getInfo('ui').album).text(),
			'image' : imgURL
		};
	};

	Pandora.prototype.getStationList = function() {
    console.log('getStationList called');
		var toReturn = [];
		$.each($(this.getInfo('ui').stationCollection), function(index,elem) {
			var s = {
				'title' : $(elem).text().trim()
			};
			if ($(elem).parent().hasClass('selected')) s.selected = true;
			toReturn.push(s);
		});
    console.log(toReturn);
		return toReturn;
	};

	Pandora.prototype.getCurrentStationIndex = function() {
    console.log('getCurrentStationIndex called');
		var toReturn = 0;
		$.each($(this.getInfo('ui').stationCollection), function(index,elem) {
			if ($(elem).parent().hasClass('selected')) toReturn = index;
		});
		return toReturn;
	};

	Pandora.prototype.sendStationList = function() {
    console.log('sendStationList called');
		this.callFunction('loadChannelList', this.getStationList());
	};

	Pandora.prototype.sendNowPlaying = function() {
    console.log('sendNowPlaying called');
		var curSong = this.getCurrentSong();
		if (!curSong) return;
		if (!this.getInfo('last3PlayedSongs').length || this.getInfo('last3PlayedSongs')[this.getInfo('last3PlayedSongs').length-1].title != curSong.title) {
			this.getInfo('last3PlayedSongs').push(curSong);
			while (this.getInfo('last3PlayedSongs').length>3) {
				this.getInfo('last3PlayedSongs').shift();
			}
		} else if (this.getInfo('last3PlayedSongs')[this.getInfo('last3PlayedSongs').length-1].title == curSong.title) {
			this.getInfo('last3PlayedSongs')[this.getInfo('last3PlayedSongs').length-1] = curSong;
		}
		this.callFunction('loadSongInfo', curSong);
		this.syncState();
	};

	Pandora.prototype.sendLast3 = function() {
    console.log('sendLast3 called');
		if (this.getInfo('last3PlayedSongs').length) var curSong = this.getInfo('last3PlayedSongs');
		else {
			var curSong = this.getCurrentSong();
			if (!curSong) return;
			this.getInfo('last3PlayedSongs').push(curSong);
		}
		this.callFunction('loadSongInfo', curSong);
	};

	Pandora.prototype.syncState = function(e) {
    	var pandora = this;
		setTimeout(function() {
			pandora.setInfo('curState', {isPlaying: pandora.getIsPlaying(), volume: pandora.getVolume()});
			pandora.callFunction('syncState', pandora.getInfo('curState'));
		}, 30);
	};
	
	Pandora.prototype.getIsPlaying = function() {
    console.log('getIsPlaying called');
		return !$(this.getInfo('ui').playButton+':visible').length;
	};
	Pandora.prototype.getVolume = function() {
    console.log('getVolume called');
		$(this.getInfo('ui').volume).show();
		var min = this.getAbsPosition($('.volumeBar')[0]).left + 22;
		var max = (min - 22) + $('.volumeBar').width() - 22;
		var target = this.getAbsPosition($('.volumeKnob')[0]).left + 22;
		return Math.round(100*(target-min)/(max-min));
	};
   
  window.colabeoPortal.addBobo(Pandora);
})();
