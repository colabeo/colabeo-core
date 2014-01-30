define(function(require, exports, module) { 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
 	var Surface = require('famous/Surface'); 
    var Modifier = require('famous/Modifier');
    var SceneController = require('app/SceneController');
    var Scrollview = require('famous-views/Scrollview');
    var ViewSequence = require('famous/ViewSequence');
    var RN = require('famous/RenderNode');
    var Tween = require('famous/TweenTransition');

    /*
     * @constructor
     */
    function SceneMenu () {

        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );

        // widgets
        this.label;
        this.labelMod;
        this._currentLabelHtml;

        this.scrollMod;
        this.scrollview;
        this.scrollNode;

        this.fadeMod;
        this.fade;

        // data
        this.scenes;
        this.order;
        this.index;

        // sequence
        this.menuItems;

        // state
        this._isVisible = false;

    }

    SceneMenu.prototype = Object.create( View.prototype );
    SceneMenu.prototype.constructor = SceneMenu;

    SceneMenu.DEFAULT_OPTIONS = { 
        padding: 14, 
        itemSize: [300, 50],
        contentFn: function ( data ) {
            var padding = this.options.padding;
            var halfPadding = padding * 0.5 ;
            return '' + 
                '<img src="' + data.image + '" width="' + (this.options.itemSize[1] - padding) + 'px" style="position: absolute; left: ' + halfPadding + 'px; top: ' + halfPadding + 'px;"></img>' + 
                '<span class="no-user-select scene-menu-title" style="position:absolute; left:' + (this.options.itemSize[1] + padding) + 'px;top:' + (halfPadding + 5) + 'px;">' + data.name + '</span>';
        },
        labelFn : function ( data ) {
            var padding = this.options.padding;
            var halfPadding = padding * 0.5 ;
            return '' + 
                '<img src="' + data.image + '" width="' + (this.options.itemSize[1] - padding) + 'px" style="position: absolute; left: ' + halfPadding + 'px; top: ' + halfPadding + 'px;"></img>' + 
                '<span class="no-user-select scene-menu-title" style="position:absolute; left:' + (this.options.itemSize[1] + padding) + 'px;top:' + (halfPadding + 5) + 'px;">' + data.name + '</span>';
        },
        scrollOptions : {
            itemSpacing: 10
        },
        labelCurve: { 
            curve: '',
            duration: 500
        },
        scrollCurve: { 
            curve: 'outExpoNorm',
            duration: 500
        },
        sceneOutCurve: { 
            curve: 'outBounceNorm',
            duration: 500
        },
        sceneInCurve: { 
            curve: 'outExpoNorm',
            duration: 500
        },
        fadeTransition: { 
            curve: 'outExpoNorm',
            duration: 500
        },
        sceneMenuMatrix: FM.translate( 0, 0, -500 ),
        fadeColor: '#3b3a3e',
        closeMenuImage: 'img/buttons/x_square.svg' 
    }

    SceneMenu.prototype.events = function  () {

        SceneController.on('set', this.set.bind(this)); 
        SceneController.on('add', this.add.bind(this));
        SceneController.on('remove', this.remove.bind(this));
        SceneController.on('reorder', this.reset.bind(this));

        this.label.on('mousedown', this._labelClick.bind(this));  
        this.fade.on('click', this.hideMenu.bind(this, undefined));
    }

    // Inits
    SceneMenu.prototype.init = function  () {

        this.initScrollview();
        this.initFade();
        this.initData();
        this.initLabel();
        this.initArrows();
        this.events();

    }

    SceneMenu.prototype.initScrollview = function () {

        this.menuItems  = [];

        this.scrollview = new Scrollview(this.options.scrollOptions);

        this.scrollNode = new RN();

        this.scrollMod  = new Modifier({ 
            opacity: 0,
            origin: [0.5, 0.25]
        });

        this.scrollview.sequenceFrom( this.menuItems );

        this.scrollNode.add( this.scrollMod ).link( this.scrollview );

    }

    SceneMenu.prototype.initFade = function () {

        this.fadeMod = new Modifier({ 
            opacity: 0,
            transform: FM.translate(0,0,-1)
        });

        this.fade = new Surface({
            properties: { 
                'backgroundColor': this.options.fadeColor
            },
            classes: [ 'fadeMenu' ]
        });

        this.scrollNode.add( this.fadeMod ).link( this.fade );
        
    }

    SceneMenu.prototype.initData = function () {

        this.getData(); 
        for (var i = 0; i < this.data.length; i++) {
            this.add( this.data[i] );
        };

    }

    SceneMenu.prototype.initLabel = function () {

        this._currentLabelHtml = this.options.labelFn.call(this, this.data[this.index]);

        this.label = new Surface({
            size: this.options.itemSize,
            content: this._currentLabelHtml,
            properties: { },
            classes: [ 'scene-menu-label' ]
        });

        this.labelMod = new Modifier({ 
            opacity: 1,
            size: this.options.itemSize,
            origin: [0.5, 0],
            transform: FM.translate( 0, 20)
        });

        this.node.add( this.labelMod ).link( this.label );
    }

    SceneMenu.prototype.initArrows = function () {

        var prevArrow = new Image();
        prevArrow.src = 'img/buttons/arrow_left_square.svg'
        prevArrow.width = this.options.itemSize[1];

        var nextArrow = new Image();
        nextArrow.src = 'img/buttons/arrow_right_square.svg'
        nextArrow.width = this.options.itemSize[1];
        

        this.prevArrow = new Surface({ 
            size: [this.options.itemSize[1], this.options.itemSize[1]],
            content: prevArrow,
            classes: [ 'scene-arrow' ] 
        });

        this.nextArrow = new Surface({ 
            size: [this.options.itemSize[1], this.options.itemSize[1]],
            content: nextArrow,
            classes: [ 'scene-arrow' ] 
        });

        this.nextArrowMod = new Modifier({
            origin: [0.5, 0],
            transform: FM.translate( this.options.itemSize[0] * 0.5 + 40, 20 )
        });

        this.prevArrowMod = new Modifier({
            origin: [0.5, 0],
            transform: FM.translate( -this.options.itemSize[0] * 0.5 - 40, 20 )
        });

        this.nextArrow.on('click', (function () {
            SceneController.next();
            this.nextArrowMod.halt();
            this.nextArrowMod.setOpacity( 0.05 );
            this.nextArrowMod.setOpacity( 1, this.options.fadeTransition );
            this.hideMenu(); 
            
        }).bind(this));

        this.prevArrow.on('click', (function () {
            SceneController.prev();
            this.prevArrowMod.halt();
            this.prevArrowMod.setOpacity( 0.05 );
            this.prevArrowMod.setOpacity( 1, this.options.fadeTransition );
            this.hideMenu(); 
        }).bind(this));
        

        this.node.add( this.nextArrowMod ).link( this.nextArrow );
        this.node.add( this.prevArrowMod ).link( this.prevArrow );
        
    }

    // sets
    SceneMenu.prototype.add = function ( data ) {
        var surface = new Surface({ 
            content: this.options.contentFn.call(this, data),
            size: this.options.itemSize,
            classes: ['scene-menu-item']
        });

        surface.pipe( this.scrollview );
        surface.on('click', (function ( value ) {

            if( this._isVisible ) { 
                this.hideMenu();
                SceneController.setScene( value );
            }

        }).bind(this, data.value));

        this.menuItems.push( surface );
    }

    SceneMenu.prototype.set = function ( obj ) { 

        this.index = obj.index;
        this.updateLabel();

    }

    SceneMenu.prototype.remove = function ( key ) {
        var removedIndex = this.order.indexOf( key );
        var surface = this.menuItems[ removedIndex ];
        
        surface.unpipe( this.scrollview );

        this.data.splice( removedIndex, 1 );
        this.menuItems.splice( removedIndex, 1 );
    }

    SceneMenu.prototype.reset = function  () {
        this.menuItems = [];
        this.initData();
    }

    // label sets
    SceneMenu.prototype.updateLabel = function () {
        this._currentLabelHtml = this.options.labelFn.call(this, this.data[this.index]);
        this.hideLabel((function () {

            this.updateLabelContent( this._currentLabelHtml ); 
            this.showLabel();

        }).bind(this));
    }

    SceneMenu.prototype.updateLabelContent = function ( html, callback ) {
        this.label.setContent( html ); 
        if( callback ) callback();
    }

    SceneMenu.prototype.showLabel = function ( callback ) {
        //TODO: figure out why this makes it not show up.
        //this.labelMod.halt();
        this.labelMod.setOpacity(1, this.options.labelCurve, callback );
    }

    SceneMenu.prototype.hideLabel = function ( callback ) {
        this.labelMod.halt();        
        this.labelMod.setOpacity(0, this.options.labelCurve, callback );
    }

    SceneMenu.prototype.showCloseLabel = function () {
        if( !this._closeHtml ) { 
            this._closeHtml = this.options.labelFn.call(this, { 
                image: this.options.closeMenuImage,
                name: 'Close',
                value: 'close'
            });
        }
        this.updateLabelContent( this._closeHtml );
    }

    SceneMenu.prototype._labelClick = function () {
        if( this._isVisible ) { 
            this.hideMenu();
            this.updateLabelContent( this._currentLabelHtml );
        } else { 
            this.showMenu();
            this.showCloseLabel();
        }
    }

    // data
    SceneMenu.prototype.getData = function  () {

        this.scenes = SceneController.getOrderedScenes();
        this.order  = SceneController.getSceneOrder();
        this.index  = SceneController.getCurrentIndex();

        this.data = [];

        for (var i = 0; i < this.scenes.length; i++) {
            this.data.push({
                value: this.order[i],
                name: this.scenes[i].NAME,
                image: this.scenes[i].IMAGE
            });
        };
    }

    SceneMenu.prototype.showMenu = function ( callback ) {

        this._isVisible = true;

        this.scrollMod.halt();
        this.scrollMod.setOpacity( 1, this.options.scrollCurve, callback );

        this.fadeMod.halt();
        this.fadeMod.setOpacity( 0.9, this.options.scrollCurve );

        SceneController.setActiveTransform( this.options.sceneMenuMatrix, this.options.sceneOutCurve );
        
    }

    SceneMenu.prototype.hideMenu = function ( callback ) {

        this._isVisible = false; 

        this.scrollMod.halt();
        this.scrollMod.setOpacity( 0, this.options.scrollCurve, callback );

        this.fadeMod.halt();
        this.fadeMod.setOpacity( 0, this.options.scrollCurve );

        SceneController.setActiveTransform( FM.identity, this.options.sceneInCurve );
        
    }

    SceneMenu.prototype.render = function  () {
        if( this._isVisible ) { 
            return [this.node.render(), this.scrollNode.render()];
        } else { 
            return this.node.render();
        }
    }

    SceneMenu.prototype.setLabelTransform = function ( mtx, curve, callback ) {
        this.labelMod.halt();
        this.labelMod.setTransform(mtx, curve, callback );
    }

    SceneMenu.prototype.setLabelOrigin = function ( origin, curve, callback ) {
        this.labelMod.halt();
        this.labelMod.setOrigin(origin, curve, callback );
    }

    SceneMenu.prototype.setScrollTransform = function ( mtx, curve, callback ) {
        this.scrollMod.halt();
        this.scrollMod.setTransform(mtx, curve, callback );
    }

    SceneMenu.prototype.setScrollOrigin = function ( origin, curve, callback ) {
        this.scrollMod.halt();
        this.scrollMod.setOrigin(origin, curve, callback );
    }

    SceneMenu.prototype.setCtx = function ( ctx ) {
        ctx.add( this ); 
        this.init();
    }

    var sceneMenu = new SceneMenu();
    module.exports = sceneMenu;
});
