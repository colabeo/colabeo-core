define(function(require, exports, module) { 
 	var Surface  = require('famous/Surface');
    var Time     = require('famous-utils/Time');

    function Submit( size ) {
        
        this._submitDelay = 200;

        this.submit = new Surface({
            properties: {            
                'background-color' : 'rgba( 255, 255, 255, 1.0)',                
                'color': 'rgba( 0, 0, 0, 1.0 )',
                'text-align': 'center'
            },        
            classes: ['submit'], 
            content: 'JOIN!',
            size: this._submitSize
        });  

        this.loadingIndex = 2;

    }

    Submit.prototype.render = function () {
        return this.submit.render(); 
    }               

    Submit.prototype.on = function ( evt, fn) {
        return this.submit.on( evt, fn );
    }

    Submit.prototype.setLoading = function () {

        this.isLoading = true;
        this._boundLoading = setLoading.bind( this );
        setLoading.call( this );
        
    }

    Submit.prototype.setSuccess = function () {

        this.isLoading = false;
        this.submit.setContent( 'SENT' ); 

    }

    Submit.prototype.setDefault = function () {

        this.isLoading = false;
        this.submit.setContent( 'JOIN!' ); 
        
    }

    function setLoading () {

        if( this.isLoading ) { 
            var content = ""; 
            for (var i = 1; i < this.loadingIndex; i++) {
                content += '.';
            };
            
            this.loadingIndex = (this.loadingIndex + 1) % 4 + 1;
            this.submit.setContent( content );

            Time.setTimeout( this._boundLoading , this._submitDelay );
        }
    }


    module.exports = Submit;
});
