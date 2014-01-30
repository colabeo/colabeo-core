define(function(require, exports, module) { 
    var View     = require('famous/View');
    var FM       = require('famous/Matrix');
 	var Surface  = require('famous/Surface');
    var Modifier = require('famous/Modifier');
    var Utility  = require('famous/Utility');
    var Easing   = require('famous-animation/Easing');
    var Utils    = require('famous-utils/Utils');
    var KeyCodes = require('famous-utils/KeyCodes');
    var ID       = require('app/ID');
    var Time     = require('famous-utils/Time');

    var Submit   = require('./Submit');

    /*
     * @constructor
     */
    function Signup () {

        View.apply(this, arguments);
        
        this.logo; 
        this.logoModifier;
        this.logoOpacity   = 0.75;
        this.buttonOpacity = 0.75;
        

        this.form;
        this.formModifier;
        
        this.submit;
        this.submitModifier;

        this.error;
        this.errorModifier;

        this.fade;
        this.fadeModifier;

        this.close;
        this.closeModifier;

        this._signupID = 'signuptextfield' + Signup.ID;
        Signup.ID++;

        this._formSize   = [ this.options.buttonSize[0] * this.options.textInputScale, this.options.buttonSize[1] ];
        this._submitSize = [ this.options.buttonSize[0]*this.options.submitScale, this.options.buttonSize[1] ];

        this.positions();

        this.initForm();
        this.initLogo();
        this.initError();

        this.events();
    }

    Signup.prototype = Object.create( View.prototype );
    Signup.prototype.constructor = Signup;

    Signup.ID = 0;

    Signup.DEFAULT_OPTIONS = { 
        offset: [0,0],
        buttonSize: [0,0],
        submitScale: 2.5,
        textInputScale: 6, 
        uiFadeTransition: {
            curve: Easing.inOutBackNorm,
            duration: 400
        }, 
        hoverTransition: { 
            curve: Easing.inOutSineNorm, 
            duration: 800 
        },
        errorSize: [ 250, 50 ],
        errorInTransition: { 
            curve: Easing.inOutCubicNorm,
            duration: 400
        },
        errorOutTransition: { 
            curve: Easing.inOutCubicNorm,
            duration: 400
        }
    }

    // POSITIONS 
    Signup.prototype.positions = function () {

        var w = window.innerWidth;
        var h = window.innerHeight;

        this.shownPositions = {

            logo: FM.translate(
                w - this.options.offset[0] - this.options.buttonSize[0], 
                h - this.options.buttonSize[1]-this.options.offset[1], 
                0),

            form: FM.translate(
                w - this.options.offset[0] * 2 - this.options.buttonSize[0] - this._formSize[0], 
                h - this.options.buttonSize[1] - this.options.offset[1], 
                2),

            submit: FM.translate(
                w - this.options.offset[0]*3.0 - this.options.buttonSize[0] - this._formSize[0] - this._submitSize[0], 
                h - this.options.buttonSize[1] - this.options.offset[1], 
                0), 

            error: FM.translate( 
                w - this.options.offset[0] * 2 - this.options.buttonSize[0] - this._formSize[0], 
                h - this.options.offset[1] * 2 - this.options.errorSize[1] - this.options.buttonSize[1],
                0)

        }

        this.hiddenPositions = { 

            logo: FM.translate( 
                w - this.options.offset[0] - this.options.buttonSize[0], 
                h - this.options.buttonSize[1] - this.options.offset[1], 
                0),

            form: FM.translate( 
                w - this.options.offset[0] * 2 - this.options.buttonSize[0] - this._formSize[0], 
                h + this.options.buttonSize[1] + this.options.offset[1], 
                0),

            submit: FM.translate( 
                w - this.options.offset[0]*3.0 - this.options.buttonSize[0] - this._formSize[0] - this._submitSize[0], 
                h + this.options.buttonSize[1] + this.options.offset[1], 
                0),

            error: FM.translate( 
                w, 
                h - this.options.offset[1] * 2 - this.options.errorSize[1] - this.options.buttonSize[1],
                0)

        }

    }
    
    // INITS 
    Signup.prototype.initLogo = function () {

        this.logo = new Surface({
            properties: {
                'background-color': 'rgba( 0, 0, 0, 0.0)',
            },        
            content: '<img draggable="false" class="no-user-select" src="js/core/famous.svg" height="'+this.options.buttonSize[1]+'"></img>',
            size: this.options.buttonSize
        });  

        this.logoModifier = new Modifier({
            size: this.options.butonSize,
            transform: this.hiddenPositions.logo, 
            opacity: this.logoOpacity
        }); 

        this.node.add( this.logoModifier ).link( this.logo );
        
    }

    Signup.prototype.initForm = function () {
        this.form = new Surface({
            properties: {
                'background-color' : 'rgba( 0, 0, 0, 0.0)',                
            },        
            content: '<input class="textinput"; id="' +  this._signupID + '"; type="text" value="Sign Up For famo.us">',
            size: this._formSize
        }); 
        
        this.formModifier = new Modifier({
            size: this._formSize,
            transform: this.shownPositions.form, 
            opacity: this.buttonOpacity
        }); 

        this.submit = new Submit( this._submitSize );

        this.submitModifier = new Modifier({
            size: this._submitSize,
            transform: this.hiddenPositions.submit, 
            opacity: 1 
        }); 

        this.node.add( this.formModifier ).link( this.form );
        this.node.add( this.submitModifier ).link( this.submit );
    }

    Signup.prototype.initError = function () {
        
        this.errorSuccessProperties = { 
            'color': '#43c529',
            'border': '1px soild white',
        }

        this.errorFailedProperties = { 
            'color': '#dd2036',
            'border': '1px soild red',
        }

        this.error = new Surface({ 
            size: this.options.errorSize, 
            content: ''
        });

        this.errorModifier = new Modifier({ 
            transform: this.shownPositions.error
        });

        this.node.add( this.errorModifier ).link( this.error );

    }

    // EVENTS
    Signup.prototype.events = function () {

        this.submit.on('touchdown', this._submitForm.bind(this)); 
        this.submit.on('mousedown', this._submitForm.bind(this)); 
        
    }

    Signup.prototype.resize = function () {

        this.positions();
        
        if(this.logoOpacity === 1.0) {
            this.showFormElements();
        } else {
            this.hideFormElements();     
        }        

        this.showLogo();
        
    }

    Signup.prototype.mousemove = function ( event, threshold ) {

        var logoDistance = Utils.distance(event.x, event.y, this.logoX, this.logoY);
        
        if(logoDistance < threshold) {

            if(this.logoOpacity != 1.0) {
                this.logoOpacity = 1.0;

                this.logoModifier.halt(); 
                this.logoModifier.setOpacity(this.logoOpacity, this.options.hoverTransition);             
            }            

        } else {
            if(this.logoOpacity != 0.5) {
                this.logoOpacity = 0.5;

                this.logoModifier.halt(); 
                this.logoModifier.setOpacity(this.logoOpacity, this.options.hoverTransition);                 
                
            }            
        }        
    }

    Signup.prototype._submitForm = function () {

        this.submit.setLoading();

        var value = this.textinput.value;                                 
        this._ajaxSignup( value );

    }

    Signup.prototype.formEvents = function () {
        var textinput = document.getElementById(this._signupID); 

        if(textinput !== null) {               

            textinput.onclick = function() {
                if(textinput.value === 'Sign Up For famo.us') {
                    textinput.value = ''; 
                }
            }; 
            
            textinput.onfocus = function() {
               if(textinput.value === 'Sign Up For famo.us') {
                    textinput.value = ''; 
                } 
            }; 
            
            textinput.onblur = function() {
                if(textinput.value === '') {
                    textinput.value = 'Sign Up For famo.us';
                }
            };   

            textinput.onkeydown = (function(event) {
                event.stopPropagation();

                if(event.keyCode == KeyCodes.ENTER) {
                    this._submitForm();
                }

            }).bind(this); 

            textinput.onkeyup = Utils.debounce(this.textInputCheck.bind(this), 333); 
            this.textinput = textinput; 

            return true;
        }
        return false;
    }
    
    Signup.prototype.textInputCheck = function() {        

        if( !this.textinput ) { 
            return;    
        }

        var value = this.textinput.value;                                 
        if(value.indexOf('@') !== -1 && value.indexOf('.') !== -1) 
        {
            this.submitModifier.halt(); 
            this.submitModifier.setTransform(
                this.shownPositions.submit,
                this.options.uiFadeTransition            
            );   
            this.submitModifier.setOpacity(1, this.options.uiFadeTransition);                          
        }
        else
        {
            this.submitModifier.halt(); 
            this.submitModifier.setTransform(
                this.hiddenPositions.submit,
                this.options.uiFadeTransition            
            );   
            this.submitModifier.setOpacity(0.0, this.options.uiFadeTransition);   
        }                
    }; 

    Signup.prototype.hideAll = function () {
        this.hideFormElements();
        this.hideLogo();
    }

    Signup.prototype.showAll = function () {
        this.showLogo();
    }

    Signup.prototype.hideFormElements = function() {

        this.formModifier.halt(); 
        this.formModifier.setTransform(
            this.hiddenPositions.form, 
            this.options.uiFadeTransition            
        ); 
        this.formModifier.setOpacity(0, this.options.uiFadeTransition);                   

        this.submitModifier.halt(); 
        this.submitModifier.setTransform(
            this.hiddenPositions.submit, 
            this.options.uiFadeTransition            
        );   
        this.submitModifier.setOpacity(0, this.options.uiFadeTransition);   

    }; 

    Signup.prototype.showFormElements = function() {

        this.formModifier.halt(); 
        this.formModifier.setTransform(
            this.shownPositions.form,
            this.options.uiFadeTransition            
        );   
        this.formModifier.setOpacity(this.logoOpacity, this.options.uiFadeTransition);                   

        this.textInputCheck(); 

    }; 

    Signup.prototype.showLogo = function() {

        var mtx = this.shownPositions.logo;

        this.logoX = mtx[12] + this.options.buttonSize[0] * 0.5; 
        this.logoY = mtx[13] + this.options.buttonSize[1] * 0.5;                        

        this.logoModifier.halt(); 
        this.logoModifier.setTransform( mtx, this.options.uiFadeTransition );    

    } 

    Signup.prototype.hideLogo = function() {

        var mtx = this.hiddenPositions.logo;

        this.logoX = mtx[12] + this.options.buttonSize[0] * 0.5; 
        this.logoY = mtx[13] + this.options.buttonSize[1] * 0.5;                        
        
        this.logoModifier.halt(); 
        this.logoModifier.setTransform( mtx, this.options.uiFadeTransition );    

    } 

    Signup.prototype._ajaxSignup = function ( value ) {
        
        var url = 'http://fsrv.us/?f=registerUserforNewsletter&email=' + value + '&demoID=' + ID;
        Utility.loadURL( url, (function ( e ) {

            this.signupResponse = JSON.parse( e );
            this.parseResponse();  
         
        }).bind(this));
    }

    Signup.prototype.parseResponse = function () {
        if( this.signupResponse['error'] == null  ) { 

            this.responseSuccess();

        } else { 

            this.error.setProperties( this.errorFailedProperties );
            this.updateSignupError();
            this.submit.setDefault();

        }

        this.showError();
        
    }

    Signup.prototype.responseSuccess = function () {

        this.error.setProperties( this.errorSuccessProperties );
        this.submit.setSuccess();
        this.error.setContent( 'SUCCESS!' );
        this.hideFormElements();
        
    }

    Signup.prototype.updateSignupError = function () {

        this.error.setContent(
            '<h5 style="position: absolute; bottom: 0">' + 
            this.signupResponse['error'] + '</h5>' 
        );

    }

    Signup.prototype.showError = function () {

        this.errorModifier.halt();

        this.errorModifier.setTransform( 
            this.shownPositions.error,
            this.options.errorInTransition
        );

        this.errorModifier.setOpacity( 1, this.options.errorInTransition );

        Time.setTimeout( this.hideError.bind(this), 4000 );

    }
    
    Signup.prototype.hideError = function () {

        this.errorModifier.halt();

        this.errorModifier.setTransform( this.hiddenPositions.error, this.options.errorOutTransition );
        this.errorModifier.setOpacity( 0, this.options.errorOutTransition );
        
    }


    module.exports = Signup;

});
