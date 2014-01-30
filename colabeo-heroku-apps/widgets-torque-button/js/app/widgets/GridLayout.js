define(function(require, exports, module) {
    var FamousSurface = require('famous/Surface');
    var FM = require('famous/Matrix');
    var FEH = require('famous/EventHandler');
    var Utils = require('famous-utils/Utils');
    var Engine = require('famous/Engine');
    var View = require('famous/View');

    var Modifier = require('famous/Modifier');
    var Easing = require('famous-animation/Easing');
    var RenderNode = require('famous/RenderNode');
    var Time = require('famous-utils/Time');
    var ScrollContainer = require('famous-widgets/ScrollContainer');
    var Scrollview = require('famous-views/Scrollview');
    var Utility = require('famous/Utility');
    var Entity = require('famous/Entity');
    var Group = require('famous/Group');

    // sequential grid layout.
    function SequentialGrid ( options ) {
        View.apply( this, arguments);
        this.eventInput.pipe( this.eventOutput );

        this.options.containerWidthFn = function () {
           return window.innerWidth; 
        };

        this.options.containerHeightFn = function () {
            return window.innerHeight; 
        };


        this._entityId = Entity.register(this);
        this.group = new Group();

        //STATE
        this._numItems = 0;
        this._containerWidth;
        this._containerHeight;
        this._numRows;
        this._numColumns;
        this._rowHeight;
        this._columnWidth;
        this._gridWidth;
        this._gridHeight;
        this._marginLeft;
        this._marginRight;
        this._marginTop;
        this._marginBottom;
        this._hasMarginNodes;
        this._lastGroupingLimit;

        this._getInternalSize = getInternalSize.bind( this );

        this.renderables    = [];
        this.modifiers      = [];
        this.scrollNodes    = [];


        if( this.options.updateOnResize ) {
            Engine.on('resize', Utils.debounce( setDirty.bind(this), this.options.debounceDelay ));
        }


        // RENDER TREE
        this.mainTransform = new Modifier();

        calcs.call( this );
        

        if( this.options.useScrollview ) { 
            var properties = this.options.containerProperties;
            
            if( this.options.overflowHidden ) { 
                properties['overflow'] = 'hidden';
            }

            if( this.options.useContainer ) { 

                this.scroll = new ScrollContainer({
                    look: { 
                        properties: properties,
                        size: [ this._containerWidth, this._containerHeight ]
                    },
                    feel: { 
                        direction: this.options.direction,
                        clipSize: 0,
                    }
                });
                this.scroll.surface.context.setPerspective( this.options.perspective ); // dirty.

            } else { 

                this.scroll = new Scrollview({
                    direction: this.options.direction,
                    paginated: this.options.paginated,
                    clipSize: 0,
                    margin: window.innerWidth,
                    itemSpacing: 0
                });
            }

            this.group.add( this.mainTransform ).link( this.scroll );
            this.scroll.sequenceFrom( this.scrollNodes );
            
            // EVENTS
            this.pipe( this.scroll );
            
        } else { 

            this.mainNode = new RenderNode();
            this.group.add( this.mainTransform ).link( this.mainNode );

        }
    };

    SequentialGrid.prototype = Object.create(View.prototype); 
    SequentialGrid.prototype.constructor = SequentialGrid;
    SequentialGrid.DEFAULT_OPTIONS = { 
        // container sizing
        containerWidthFn: undefined,
        containerHeightFn: undefined,
        // explicit sizes take precedence over number of columns.
        columnWidth: undefined,
        rowHeight: undefined,

        numColumns: undefined,
        numRows: undefined,

        // overflow in which direction? 
        direction: Utility.Direction.Y,
        paginated: false,

        // auto margins
        autoMargin: true,

        // Edge Margins 
        leftMargin: 50,
        rightMargin: 50,
        topMargin: 50, 
        bottomMargin: 50,

        // Gutters
        'columnGutters': 20,
        'rowGutters': 20,

        //resize
        updateOnResize: true,
        debounceDelay: 150,

        transition: { curve: Easing.inOutBackNorm, duration: 600 },
        delayTransition: true,
        delayIncrement: 15,

        useScrollview: true,
        useContainer: false,
        containerProperties: {
            'backgroundColor': '#ffffff'
        },
        overflowHidden: false,
        perspective: 1000
    }

    function create ( renderable ) {
        this._numItems++;
        var modifier = new Modifier();

        if( this.options.useScrollview ) {
            renderable.pipe( this.scroll );
        } else { 
            this.mainNode.add( modifier ).link( renderable );
        }
        return [modifier, renderable];
    }
    function prepend ( renderable, preventReflow ) {
        var item = create.call( this, renderable );
        this.modifiers.unshift( item[0] );
        this.renderables.unshift( item[1] );
        postCreate.call( this, preventReflow );
    }

    function append ( renderable, preventReflow ) {
        var item = create.call( this, renderable );
        this.modifiers.push( item[0] );
        this.renderables.push( item[1] );
        postCreate.call( this, preventReflow );
    }

    function postCreate ( preventReflow ) {
        if( preventReflow == undefined ) {
            setDirty.call( this ); 
        } 
    }

    SequentialGrid.prototype.append = function ( obj ) {
        if( Utils.isArray( obj ) ) { 

            for (var i = 0; i < obj.length; i++) {
                append.call( this, obj[i], true );
            }
            setDirty.call( this );
            
        } else { 
            append.call( this, obj );
        }
    };

    SequentialGrid.prototype.prepend = function ( obj ) {
        if( Utils.isArray( obj ) ) { 

            for (var i = 0; i < obj.length; i++) {
                prepend.call( this, obj[i], true );
            };
            setDirty.call( this );

        } else { 

            prepend.call( this, obj );

        }
    };

    // TODO
    SequentialGrid.prototype.remove = function () {
        this._numItems--;
    };

    SequentialGrid.prototype.reflow = function () {
        setDirty.call(this);
    }

    SequentialGrid.prototype.commit = function( context, transform, opacity, origin, size ) {
        return {
            transform: FM.moveThen([-origin[0]*size[0], -origin[1]*size[1], 0], transform),
            opacity: opacity,
            origin: origin,
            size: size,
            target: {
                transform: transform,
                origin: origin,
                target: this.group.render()
            }
        };
    }
    SequentialGrid.prototype.render = function () {
        return this._entityId; 
    }

    SequentialGrid.prototype.getSize = function () {
        return [ this._containerWidth, this._containerHeight ];
    };

    // only calculate on reflow.
    function calcInternalSize () {
       this._internalSize = this.options.direction == Utility.Direction.X ? 
            [ 
                this._columnWidth + this.options.columnGutters * 2, 
                this._rowHeight * this._numRows + (this._numRows - 1 ) * this.options.rowGutters 
            ] :
            [ 
                this._numColumns * this._columnWidth + (this._numColumns - 1) * this.options.columnGutters, 
                this._rowHeight + this.options.rowGutters 
            ];
    }
    function getInternalSize() {
        return this._internalSize;
    };

    function reflow ( callback ) {
        if( this._dirty ) calcs.call( this );
        for(var i = 0; i < this.modifiers.length; i++) { 

            var mtx = sequentialLayout.call(this, i);

            this.modifiers[i].halt();

            if( this.options.delayTransition ) { 
                Time.setTimeout( 
                    this.modifiers[i].setTransform.bind( this.modifiers[i], mtx, this.options.transition, callback ),
                    i * this.options.delayIncrement);

            } else {
                this.modifiers[i].setTransform(mtx, this.options.transition, callback);
            }
        }        
        this.emit( 'reflow' );
    };

    function setDirty() {
        this._dirty = true; 
        reflow.call( this );
    };

    function calcs () {
        var scroll = this.options.useContainer ? this.scroll.scrollview : this.scroll;
        
        this._marginLeft    = this.options.leftMargin;
        this._marginRight   = this.options.rightMargin;
        this._marginTop     = this.options.topMargin;
        this._marginBottom  = this.options.bottomMargin;
        
        this._containerHeight = this.options.containerHeightFn ? this.options.containerHeightFn() : window.innerHeight;
        this._containerWidth = this.options.containerWidthFn ? this.options.containerWidthFn() : window.innerWidth;

        if( this.options.useContainer ) { 
            this.scroll.setOptions({ look: { size: [ this._containerWidth, this._containerHeight] }});
        }

        this._gridHeight = this._containerHeight - ( this._marginTop + this._marginTop );
        this._gridWidth = this._containerWidth - ( this._marginLeft + this._marginRight );

        // if declared number of rows or columns, auto size to container.
        if( this.options.numRows ) { 
            this._numRows = this.options.numRows;
            this._rowHeight = (this._gridHeight - this.options['rowGutters'] * (this._numRows - 1)) / this._numRows;
        }

        if( this.options.numColumns ) { 
            this._numColumns = this.options.numColumns;
            this._columnWidth = (this._gridWidth - this.options['columnGutters'] * ( this._numColumns - 1)) / this._numColumns;
        } 

        // explicit sizings take precedence over number of columns
        if( this.options.columnWidth) { 
            this._columnWidth = this.options.columnWidth;
        }

        if( this.options.rowHeight ) { 
            this._rowHeight = this.options.rowHeight;
        }

        // if overflow in Y, auto number of rows based on content, 
        if( this.options.direction == Utility.Direction.Y ) {

            this._numColumns = Math.max( Math.floor(this._gridWidth / (this._columnWidth + this.options['columnGutters'] )), 1);
            this._numRows = Math.ceil(this._numItems / this._numColumns );

            if( this.options.autoMargin ) {
                this._marginLeft = (this._containerWidth - (this._numColumns * this._columnWidth + (this._numColumns - 1 ) * this.options['columnGutters'] )) * 0.5;
                this._marginRight = this._marginLeft;
            }

            this._gridHeight = this._numRows * this._rowHeight + 
                this._marginTop + this._marginBottom + 
                this.options['rowGutters'] * ( this._numRows - 1 );


        // if overflow in X, auto number of columns based on content
        } else if( this.options.direction == Utility.Direction.X ) { 

            this._numRows = Math.floor( this._gridHeight / (this._rowHeight + this.options['rowGutters'] ));
            this._numColumns = Math.ceil( this._numItems / this._numRows );

            if( this.options.autoMargin ) {
                this._marginTop = (this._containerHeight - (this._numRows * this._rowHeight + (this._numRows - 1) * this.options['rowGutters'] )) * 0.5;
                this._marginBottom = this._marginTop;
            }
            
            this._gridWidth =  this._numColumns * this._columnWidth + 
                this._marginTop + this._marginRight + 
                this.options['columnGutters'] * (this._numColumns - 1);

        }

        // check if scrollview is beyond new positioning:: only works if setting position to 0??
        if( scroll ) {
            if( scroll.getPosition() > this._gridHeight ) {
                scroll.setPosition( 0 );
            } 
        }

        if( this.options.useScrollview ) { 
            calcInternalSize.call( this );
            setupRenderNodes.call( this );
            //checkMargins.call( this );
        } 

        this._dirty = false;
    }

    //function checkMargins () {
    //    this.mainTransform.halt();
    //    var mtx = this.options.direction == Utility.Direction.X ? 
    //        FM.translate( this.options.leftMargin, 0, 0) : 
    //        FM.translate( 0, this.options.topMargin, 0);
    //    this.mainTransform.setTransform( mtx, this.options.transtion );
    //}

    // reallocate content to render nodes grouped by row or column, depending on direction.
    function setupRenderNodes () {

        clearNodes.call( this );

        var groupingLimit = this.options.direction == Utility.Direction.X ? this._numRows: this._numColumns;

        if( this._lastGroupingLimit !== groupingLimit && this._lastGroupingLimit !== undefined ) {

        }

        var group = 0;
        for (var i = 0; i < this.modifiers.length; i++) {

            if( i % groupingLimit == 0 && i !== 0) group++; 
            
            if(!this.scrollNodes[group] ) {
                this.scrollNodes[group] = new RenderNode();
                this.scrollNodes[group].getSize = this._getInternalSize;
            }

            if( this.scrollNodes[group].getSize !== this._getInternalSize ) { 
                this.scrollNodes[group].getSize = this._getInternalSize;
            }
            this.scrollNodes[group].add( this.modifiers[i] ).link( this.renderables[i] );
            
        };
        group++;

        // clear remaining scrollNodes
        var remaining = this.scrollNodes.length - group;
        if( remaining > 0 ) { 
            this.scrollNodes.splice( this.scrollNodes.length - remaining, this.scrollNodes.length );
        }

        setupMarginNodes.call( this );
        this._lastGroupingLimit = groupingLimit;
    }

    function setupMarginNodes() {
        this._hasMarginNodes = true;

        var beginningMarginNode = new RenderNode();
        beginningMarginNode.getSize = (function () {
            return this.options.direction == Utility.Direction.X ? 
                [ this._marginLeft , this._internalSize[1] ]:
                [ this._internalSize[0], this._marginTop ];
        }).bind( this );

        this.scrollNodes.unshift( beginningMarginNode );

        // bottom margin
        var endMarginNode = new RenderNode();
        endMarginNode.getSize = (function () {
            return this.options.direction == Utility.Direction.X ? 
                [ this._marginLeft - this.options.columnGutters, this._internalSize[1] ]:
                [ this._internalSize[0], this._marginBottom - this.options.rowGutters];
            }).bind( this );

        this.scrollNodes.push( endMarginNode );
    }

    function removeMarginNodes () {
        this.scrollNodes.splice(0, 1); 
        this.scrollNodes.splice( this.scrollNodes.length - 1, 1 );
        this._hasMarginNodes = false;
    }

    // remove all content from rendernodes, allowing content to be reallocated in setupRenderNodes
    function clearNodes () {
        if( this._hasMarginNodes ) { 
            removeMarginNodes.call( this );
        }

        for (var i = 0; i < this.scrollNodes.length; i++) {
            if( this.scrollNodes[i] ) {
                this.scrollNodes[i].object = undefined;
            }
        };
    }

    function sequentialLayout( i ) {
        var x, y;
        var xCol = i % this._numColumns;
        var yCol = Math.floor( i / this._numColumns );

        if( this.options.useScrollview ) {
            if( this.options.direction == Utility.Direction.X ) { 
                y = ( yCol * this._rowHeight ) + ( yCol * this.options['rowGutters'] ) + this._marginTop;
                return FM.translate( 0, y, 0 );

            } else { 

                x = ( xCol * this._columnWidth ) + ( xCol * this.options['columnGutters'] ) + this._marginLeft;
                return FM.translate( x, 0, 0 );

            }

        } else { 
            x = ( xCol * this._columnWidth ) + ( xCol * this.options['columnGutters'] ) + this._marginLeft;
            y = ( yCol * this._rowHeight ) + ( yCol * this.options['rowGutters'] ) + this._marginTop;
            return FM.translate( x, y, 0 );
        }
    };

    module.exports = SequentialGrid;
});
