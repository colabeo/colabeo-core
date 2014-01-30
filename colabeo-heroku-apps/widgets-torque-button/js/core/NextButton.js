define(function(require, exports, module) { 
    var View         = require('famous/View');
    var FM           = require('famous/Matrix');
 	var Surface      = require('famous/Surface');
    var Modifier     = require('famous/Modifier');
    var Utility      = require('famous/Utility');
    var Utils        = require('famous-utils/Utils');
    var Easing       = require('famous-animation/Easing');
    var RotateButton = require('famous-ui/Buttons/RotateButton');
    var ID           = require('app/ID');
    var Time         = require('famous-utils/Time');

    /*
     * @constructor
     */
    function NextButton () {

        View.apply(this, arguments);

        this.nextButton;
        this.nextButtonModifier;

        this.nextButtonX;
        this.nextButtonY;

        this.descriptionVisible = false;
        this.descriptionInit = false;

        this.nextDescriptionMod;
        this.nextDescription;

        this.sceneWidth;
        this.sceneHeight;
        
        this.positions();        
        this.initButton();
        this._ajaxNext();

    }

    NextButton.prototype = Object.create( View.prototype );
    NextButton.prototype.constructor = NextButton;

    NextButton.DEFAULT_OPTIONS = { 
        offset: [0,0],
        buttonSize: [0,0],
        showTransition: {
            curve: 'inOutBackNorm',
            duration: 400
        },
        hideTransition: { 
            curve: 'inOutBackNorm',
            duration: 400
        },
        hoverTransition: { 
            curve: Easing.inOutSineNorm, 
            duration: 800 
        },
        nextDescriptionSize: [200, 60],
        descriptionInTransition: {
            method : 'physics', 
            spring : {
                period : 800, 
                dampingRatio : 0.41
            }, 
            wall: true,
            v: 0
        }, 
        descriptionOutTransition: {
            method : 'physics', 
            spring : {
                period : 400, 
                dampingRatio : 0.5
            }, 
            wall: false,
            v: 0
        } 
    }

    NextButton.prototype.resize = function () {
        this.positions();

        if( this.descriptionVisible ) { 

            this.descriptionVisible = !this.descriptionVisible;
            this.showNextDescription();

        } else { 

            this.descriptionVisible = !this.descriptionVisible;
            this.hideNextDescription();

        }
    } 

    NextButton.prototype.positions = function () {

        var w = window.innerWidth;
        var h = window.innerHeight;

        this.hiddenPositions = { 
            next : FM.translate(
                w - this.options.offset[0] - this.options.buttonSize[0], 
                - this.options.buttonSize[1], 
                0),
            nextDescription : FM.translate(
                w , 
                this.options.offset[1], 
                0),
        }

        this.shownPositions = {
            next : FM.translate( 
                w - this.options.offset[0] - this.options.buttonSize[0], 
                this.options.offset[1], 
                0),
            nextDescription : FM.translate( 
                w - this.options.nextDescriptionSize[0], 
                this.options.offset[1], 
                0),
        }
        
    }

    NextButton.prototype.show = function () {

        var mtx = this.shownPositions.next; 

        var buttonSize = this.nextButton.getSize();

        this.nextButtonX = mtx[12] + buttonSize[0] * 0.5; 
        this.nextButtonY = mtx[13] + buttonSize[1] * 0.5;  
        
        this.nextButtonModifier.halt(); 
        this.nextButtonModifier.setTransform( mtx, this.options.showTransition ); 

    }

    NextButton.prototype.showAll = function () {
        this.show();
    }

    NextButton.prototype.hideAll = function () {
        this.hideNextDescription();
        this.hide();
    }

    NextButton.prototype.hide = function () {
        this.nextButtonModifier.halt();
        this.nextButtonModifier.setTransform( 
            this.hiddenPositions.next, 
            this.options.hideTransition
        );
    }

    NextButton.prototype.hideNextDescription = function () {

        if( !this.descriptionInit ) return;

        if( this.descriptionVisible ) { 
            this.show();
            
            this.nextDescriptionMod.halt();
            this.nextDescriptionMod.setTransform(
                this.hiddenPositions.nextDescription,
                this.options.descriptionOutTransition
            );
            this.descriptionVisible = false;
        }
    }

    NextButton.prototype.showNextDescription = function () {
        
        if( !this.descriptionInit ) return;

        if( !this.descriptionVisible ) { 
            this.hide();

            this.nextDescriptionMod.halt();
            Time.setTimeout( (function () {

                if( this.descriptionVisible == true ) { 
                    this.nextDescriptionMod.setTransform(
                        this.shownPositions.nextDescription,
                        this.options.descriptionInTransition
                    )
                }
                    
            }).bind(this), 110);

            this.descriptionVisible = true;

        }            
    }

    NextButton.prototype.mousemove = function ( event, threshold ) {

        var nextDistance = Utils.distance(event.x, event.y, this.nextButtonX, this.nextButtonY);

        if(nextDistance < threshold) {
            this.showNextDescription();
        } else {
            this.hideNextDescription();
        }       

    }
    NextButton.prototype._ajaxNext = function () {
        Utility.loadURL( 'http://fsrv.us/?f=getNextDemo&currentID=' + ID + '&source=' + window.location.host, (function ( e ) {

            var data = JSON.parse(e);
            this.demoData = data['demoData'];
            this.nextDemo = data['nextDemoData'];
            this.initNextDescription();

        }).bind(this));
    }

    // Inits
    NextButton.prototype.initButton = function () {

        this.nextButton = new Surface({
            properties: {
                'background-color': 'rgba( 0, 0, 0, 0.0)',
            },        
            content: '<img draggable="false" class="no-user-select" src="js/core/next.svg" height="'+this.options.buttonSize[1]+'"></img>',
            size: this.options.buttonSize
        }); 

        this.nextButtonModifier = new Modifier({
            size: this.nextButton.getSize(),
            transform: this.shownPositions.next,
            opacity: this.nextButtonOpacity
        });

        this.node.add( this.nextButtonModifier ).link( this.nextButton );
        
    }

    NextButton.prototype.initNextDescription = function () {

        this.descriptionInit = true;

        var url = window.location.host == 'codepen.io' ? 
            this.nextDemo['codepenURL'] : 
            this.nextDemo['codepenURL'] ; 

        var name  = this.nextDemo['name'];

        var thumb = this.nextDemo['thumbSRC'] !== "http://notAvailableYet" ?
            this.nextDemo['thumbSRC'] : 
            // TODO: Remove dummy thumbnail
            'https://s3-us-west-1.amazonaws.com/disrupt.famo.us/widgets-lightbox/thumb.jpg';

        this.nextDescription = new Surface({ 
            content: 
            '<a target="_blank" style=" text-decoration: none; float: left;" href="' + url + '">' +
                '<img style="float: left; width: 50px;" src="' + thumb + '" width="50"></img>' + 
                '<div style="float: left; padding-left: 5px;">' + 
                    '<span class="core-next-demo">NEXT DEMO:</span><br><span class="core-next-name">' + name +'</span>' + 
                '</div>' + 
            '</a>',
            size: this.options.nextDescriptionSize,
            classes: [ 'core-nextDescription' ],
            properties: {
                'padding': '5px',
                'background-color': '#000'
            }
        });

        this.nextDescriptionMod = new Modifier({ 
            transform: this.hiddenPositions.nextDescription
        });

        this.node.add( this.nextDescriptionMod ).link( this.nextDescription );

        this.descriptionVisible = false;
    }

    module.exports = NextButton;
});
