define(function(require, exports, module) {

    var BufferLoader = require('./BufferLoader'); 

    /**
     * @constructor
     */
    function SoundPlayer(urls, callback) { 
        this.context; 
        try {    
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.bufferLoader = new BufferLoader(this.context, urls, this.setSounds.bind(this));
            this.sounds;
            this.callback = callback || undefined; 
            this.bufferLoader.load();        
        }
        catch(e) {
            // console.log('Web Audio API is not supported in this browser');
        }
    }

    SoundPlayer.prototype.setSounds = function(sounds) { 
        this.sounds = sounds;
        console.log('sounds loaded', sounds);
        if(this.callback != undefined){
            this.callback(); 
        }
    }

    SoundPlayer.prototype.playSound = function(i, volume) { 
        if(this.context && this.sounds)
        {
            var buffer = this.context.createBufferSource();
            var gain = this.context.createGainNode ? this.context.createGainNode() : this.context.createGain(); 
            buffer.buffer = this.sounds[i];
            buffer.connect(gain);
            gain.connect(this.context.destination);
            gain.gain.value = (typeof volume === 'undefined') ? .125 : volume; 
            buffer.start(0.0);     
        }
    }

    module.exports = SoundPlayer;
});