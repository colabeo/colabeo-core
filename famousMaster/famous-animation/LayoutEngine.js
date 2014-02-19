define(function(require, exports, module) {    
    var Engine = require('famous/Engine');        
    var Utils = require('famous-utils/Utils');

    /*
     *      @widget
     *      @class Singleton. Famous transform, width dependant layout.
     *
     *      Accepts layouts in this data structure: 
     *
     *      @example
     *      var LayoutEngine = require('LayoutEngine');
     *
     *      function HomeView() { 
     *          // your stuff here..
     *
     *          this.layouts = {
     *
     *              // name of 
     *              mobile: { 
     *                  minWidth : 0,
     *                  maxWidth : 1136,
     *                  layouts: [
     *
     *                      // animating a transform
     *                      { 
     *                          transform: this.video.transform,
     *                          matrix: FM.translate( 80 , 80 ),
     *                          transition: { curve: 'easeInOut', duration: 500 }
     *                      },
     *
     *                      // animating opacity
     *                      { 
     *                          transform: this.nav.transform,
     *                          opacity: 0,
     *                          opacityTransition: { curve: 'easeInOut', duration: 500 },
     *                          opacityCallback: this.someCallback.bind(this)
     *                      },
     *
     *                      // animating origin 
     *                      { 
     *                          transform: this.caption.transform,
     *                          origin: [0, 0],
     *                          originTransition: { curve: 'easeInOut', duration: 500 }
     *                      },
     *
     *                      // animating size 
     *                      { 
     *                          transform: this.caption1.transform,
     *                          size: [500, 500],
     *                          sizeTransition: { curve: 'easeInOut', duration: 500 }
     *                      },
     *
     *                      // random function that you need to trigger on specific layout
     *                      { 
     *                          fns: [ this.randomFn.bind(this), this.otherFn.bind(this)  ]
     *                      },
     *
     *                      // multiple combos
     *                      { 
     *                          transform: this.caption1.transform,
     *                          size: [500, 500],
     *                          sizeTransition: { curve: 'easeInOut', duration: 500 },
     *                          opacity: 0.5,
     *                          opacityTransition: { curve: 'easeInOut', duration: 500 },
     *                          fns: [ this.randomFn.bind(this) ],
     *                      },
     *                  ]
     *              },
     *          }
     *
     *          // add your layout to LayoutEngine
     *          LayoutEngine.add(this.layouts);
     *      }
     *
     */
    function LayoutEngine() {

        Engine.on('resize', Utils.debounce(layoutAll.bind(this), 400 ));

        this.layouts = [];
        this.screenSize;
        getScreenSize.call(this);

    }

    LayoutEngine.prototype.add = function (layout) {
       this.layouts.push(layout); 
    }

    LayoutEngine.prototype.remove = function (layout) {
        var i = getIndexOf( layout );
        if(i !== -1) {
            this.layouts.splice(1, i);
        }
    }

    // if not specific layout, trigger all.
    LayoutEngine.prototype.triggerLayout = function (layoutObject) {
        if(!layoutObject) { 

            layoutAll.call( this );

        } else { 

            var i = getIndexOf.call( this, layoutObject );
            if( i !== -1 ) { 
                layout.call(this, i);
            }
        }
    }

    LayoutEngine.prototype.getScreenSize = function () {
       return this.screenSize; 
    }

    function getIndexOf (layout) {
        return this.layouts.indexOf(layout); 
    }

    function getScreenSize () {
        this.screenSize = [window.innerWidth, window.innerHeight];
    }

    function layoutAll () {
        getScreenSize.call(this);

        for (var i = 0; i < this.layouts.length; i++) {
            layout.call(this, i);
        };
    }

    function layout (index) { 

        var layoutTemplate = this.layouts[ index ];
        var sizedLayout = findSizedLayout.call( this, layoutTemplate );
        if(sizedLayout) {
            animateToPosition.call( this, sizedLayout );
        }

    }

    function findSizedLayout ( template ) {

        var max, largestKey;
        var possibles = [];

        for ( var key in template ) { // find all acceptable layouts

            if( template[key].minWidth < this.screenSize[0] && 
                template[key].maxWidth > this.screenSize[0] ){
                possibles.push(key);
            }
        };

        if(possibles.length == 0) {
            console.warn('No possible layout');
            return;
        }

        for (var i = 0; i < possibles.length; i++) { // find largest acceptable layout

            // first pass, assign to first. 
            if(!max) {

                max = template[ possibles[i] ].maxWidth;
                largestKey = possibles[i];

            } else { 

                var layout = template[ possibles[i] ];

                if( layout.maxWidth > max ) { 
                    
                    largestKey = possibles[i];
                    max = layout.maxWidth;

                }
            }
        };

        return template[ largestKey ]; 
    }

    function animateToPosition (layout) {
        var toAnimate = layout.layouts;
        for ( var i = 0; i < toAnimate.length; i++ ) {
            var animation = toAnimate[i];

            if( animation.transform ) { 
                if( animation.matrix ) { 
                    animation.transform.setTransform( animation.matrix, animation.transition, animation.transformCallback ); 
                }
            
                if( animation.origin ) { 
                    animation.transform.setOrigin( animation.origin, animation.originTransition, animation.originCallback); 
                }
                
                if( animation.opacity ) { 
                    animation.transform.setOpacity( animation.opacity, animation.opacityTransition, animation.opacityCallback ); 
                }
                
                if( animation.size ) { 
                    animation.transform.setSize( animation.size, animation.sizeTransition, animation.sizeCallback ); 
                }
            }

            if( animation.fns ) { 
                if(Utils.isArray(animation.fns)){ 

                    for (var i = 0; i < animation.fns.length; i++) {
                        animation.fns[i]();
                    };

                } else { 
                    
                    animation.fns();

                }
            }
        };
    }

    // singleton.
    var Layout = new LayoutEngine();

    module.exports = Layout;
});
