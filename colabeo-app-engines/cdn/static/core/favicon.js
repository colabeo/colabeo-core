var DeMoboFavicon = function() {
	this.docHead = document.getElementsByTagName("head")[0];
	this.demoboIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAB3RJTUUH3QsVACku6vOhyQAAA2pJREFUOMt9lF1sVGUQhp85Z5daVKoWiUnLDRjQ2lViNMaiN1oCaIO09U4v6m7XthZsSC9EE70hwT9Cgok/ZS0Wok1IurvdQn81IvECpRbJntOlLTTBqgkWLkRoyrI9Z7w47bpdinP3zXzzzjfzvt8IefbutxPs2bQOgDePp/wzN50iVQpV1RARxxBmi5f7//5wy0NOfq6Re2hOjGaBwnHrpevpua9d1Z9VdUrhoqr+5qiemp65eSQcszZ7STEiw1MASD66zqiEBu1B19VKQAQwRE4iXEIpdVUr1MtzTEM62msC9VWHR9i8rngxWGO3VZR2tE+VChEmfIbsjVQHDucXDEet5ozqW8BqU6S3vTZQlW2zsdsGIONyQJUKQ6S/wDQqFoBa+1LZMQBEagOf3uE3KgyRE8CRbJWW497FpoS9sa4rqcGolWIJe6PH5ofzl3k9bhGMWhKKWtmumrq9IsaBqjIA0nP6CaAGtAJ8c/bPLNA7Q+N8tq2co6lLxY6yHzir8GsoarW+/+MF8/Ptj9Ax8ofXZnOPXeqqlglc8PtkeGfPKK9sKMmCjU3PzBfkqCEyrqpXXdXHHNV9k9OzBwEGz1/xCAjHrOczrvYZMHzo5UefWarNpm77yRuO2ynCgOuyIzd2X6F/1f4XH75sADjKnYCByFVuY3OulqjyoOvSeIuaMs7KLJumMAO4qlp0O7AHViwbFG/kvly/CNfatpefy4ItM2UccIBVTYnRlc2JxYS29KbYU7l+1i8SBNI5oesFprkJYPfA+H/eYJc1UteVdOtj1gsAH5ycXATYELcAqI/ZTwWjyR2hqNXQELfXeDFPp+zqPefpKGE/Pa+zMYBn237i4Okp/s9ajqXuBXguMsx7302wIFgAQjGro64rqaGoNdiYGL0nX9i1nWdyvp5d8lo0eSYYtU7sOzVmLvrod+0d4NWy0qK04/aqslGEMVPkoy9rAl/lvqYzedH3/eS1RsfRXQprDJGh4uVS9fHW8sytW0OV+pjd76huWXCZIqfnt0aJq/q4LqjAkC/aawJNoZhFe01gMc07j40iHv9bw3F725yrQVTLXdUNqhQI3AAmDbBM02iLVJcPheMWkerA0vvs0C+/E3xiNQBv90/4rsym73eVu13UZyBzhsg/uyvX/rV2RaHm5/4LxVaRBpYpCcEAAAAASUVORK5CYII=";
	function parseURI(url) {
		var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
		return ( m ? {
			href : m[0] || '',
			protocol : m[1] || '',
			authority : m[2] || '',
			host : m[3] || '',
			hostname : m[4] || '',
			port : m[5] || '',
			pathname : m[6] || '',
			search : m[7] || '',
			hash : m[8] || ''
		} : null);
	}


	this.isOff = function() {
		return this.getFavicon() !== this.onFavicon;
	};

	this.turnOn = function() {
		// this.change(this.demoboIcon);
		this.change(this.onFavicon);
	};

	this.turnOff = function() {
		// this.change(this.originalFavicon);
		this.change(this.offFavicon);
	};

	this.reset = function() {
		this.change(this.originalFavicon);
	};

	this.toggle = function() {
		if (this.isOff())
			this.turnOn();
		else
			this.turnOff();
	};
	this.getFavicon = function() {
		var favicon = "/favicon.ico";
		var links = document.getElementsByTagName('link');
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			var rel = '"' + link.getAttribute("rel") + '"';
			var regexp = /(\"icon )|( icon\")|(\"icon\")|( icon )/i;
			if (rel.search(regexp) != -1) {
				favicon = link.getAttribute("href");
			}
		}
		return favicon;
	};
	this.grayscale = function(ctx) {
		var imageData = ctx.getImageData(13, 13, 18, 18);
		var data = imageData.data;
		for (var i = 0; i < data.length; i += 4) {
			var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
			// red
			data[i] = brightness;
			// green
			data[i + 1] = brightness;
			// blue
			data[i + 2] = brightness;
		}
		// overwrite original image
		ctx.putImageData(imageData, 13, 13);
	};
	this.colorize = function(ctx, canvas, rgb) {
		// get all canvas pixel data
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (var y = 0; y < canvas.height; y++) {
			var inpos = y * canvas.width * 4;
			var outpos = inpos;
			for (var x = 0; x < canvas.width; x++) {
				r = imageData.data[inpos++];
				g = imageData.data[inpos++];
				b = imageData.data[inpos++];
				a = imageData.data[inpos++];
				r = Math.min(rgb.r, r);
				g = Math.min(rgb.g, g);
				b = Math.min(rgb.b, b);
				imageData.data[outpos++] = r;
				imageData.data[outpos++] = g;
				imageData.data[outpos++] = b;
				imageData.data[outpos++] = a;
			}
		}
		// put pixel data on canvas
		ctx.putImageData(imageData, 0, 0);
	};
	this.renderIcon = function(URL) {
		var img = new Image();
		var demoboLogo = new Image();
		var self = this;
		demoboLogo.onload = function() {
			var uri = parseURI(URL);
			if (uri.host) {
				if (window.location.host == uri.host)
					img.src = URL;
				else
					img.src = '/favicon.ico';
			} else
				img.src = URL;
			missingIcon();
			self.turnOn();
		};
		// img.crossOrigin = 'anonymous';
		img.onload = demoboIcon;
		img.onerror = missingIcon;

		function demoboIcon() {
			var canvas = document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(demoboLogo, 0, 0, 32, 32);
			self.onFavicon = canvas.toDataURL("image/png");

			self.grayscale(ctx);
			self.offFavicon = canvas.toDataURL("image/png");
			self.turnOn();
		}
		function missingIcon() {
			var canvas = document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#ffffff';
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#000000';
			ctx.stroke();

			ctx.drawImage(demoboLogo, 13, 13, 18, 18);
			self.onFavicon = canvas.toDataURL("image/png");
			
			self.grayscale(ctx);
			self.offFavicon = canvas.toDataURL("image/png");
			self.turnOn();
		}


		demoboLogo.src = this.demoboIcon;
	};
	this.change = function(iconURL) {
		this.removeIcon()
		this.addLink(iconURL, "shortcut icon")
	};
	this.addLink = function(iconURL, relValue) {
		var link = document.createElement("link")
		link.type = "image/x-icon"
		link.rel = relValue
		link.href = iconURL
		this.docHead.appendChild(link)
	};
	this.removeIcon = function() {
		var links = this.docHead.getElementsByTagName("link");
		// remove from the end
		for (var i = links.length - 1; i >= 0; i--) {
			var link = links[i]
			if (/icon/.test(link.rel)) {
				this.docHead.removeChild(link)
			}
		}
	};
	this.originalFavicon = this.getFavicon();
	this.offFavicon = this.originalFavicon;
	this.onFavicon = this.demoboIcon;
	// this.originalFavicon = this.getFavicon();
	// this.offFavicon = '//www.google.com/s2/favicons?domain=' + window.location.host;
	// this.onFavicon = this.demoboIcon;
	// this.renderIcon(this.originalFavicon);
};
fav = new DeMoboFavicon();
