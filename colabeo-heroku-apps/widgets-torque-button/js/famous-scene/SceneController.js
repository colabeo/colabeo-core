define(function(require, exports, module) 
{ 
    var View = require('famous/View');
    var FM = require('famous/Matrix');
    var Modifier = require('famous/Modifier');
    var Engine = require('famous/Engine'); 

    function SceneController ( ) {
        View.apply(this, arguments);
        this.eventInput.pipe( this.eventOutput );

		this.routes     = {};  
		this.sceneArray = [];
		this.sceneIndex = 0;
    }

    SceneController.prototype = Object.create(View.prototype);
    SceneController.prototype.constructor = SceneController;

    SceneController.DEFAULT_OPTIONS = { 
        loop: true
    }

    SceneController.prototype.addScene = function ( key, view ) {
        this.routes[ key ] = view;
		this.sceneArray.push( key );
        this.emit('add', { key: key, view: view });
    }; 

    SceneController.prototype.addScenes = function ( obj ) {
        for( var key in obj ) {
            this.addScene( key, obj[ key ] );
        }
    }; 

    SceneController.prototype.removeScene = function ( key ) {
        delete this.routes[ key ];
        this.emit( 'remove', { key: key });
    }; 

    SceneController.prototype.reset = function  () {
        this.node.object = undefined;    
    };

	SceneController.prototype.next = function()		{
		this.sceneIndex++;
		if( this.sceneIndex == this.sceneArray.length ) {		

			if( this.options.loop ) {
				this.sceneIndex = 0;
				this.setScene( this.sceneArray[ this.sceneIndex ], 'next' );
			} else {
				this.emit('end');
                this.sceneIndex--;
			}

		} else { 
			this.setScene( this.sceneArray[ this.sceneIndex ], 'next' );		
		}

        this.emit('next', this.sceneArray[this.sceneIndex] );
	};

	SceneController.prototype.prev = function() {
		this.sceneIndex--;
		if( this.sceneIndex < 0 ) {		
			if( this.options.loop ) {
				this.sceneIndex = this.sceneArray.length - 1;
				this.setScene( this.sceneArray[ this.sceneIndex ], 'prev' );
			} else {
				this.emit('beginning');
                this.sceneIndex++;
			}
		} 
        else { 
			this.setScene( this.sceneArray[ this.sceneIndex ], 'prev' );
		}

        this.emit('prev', this.sceneArray[this.sceneIndex] );
	}; 

    SceneController.prototype.setActiveTransform = function ( mtx, curve, callback ) {
        if(this.activeTransform) {
            this.activeTransform.halt();
            this.activeTransform.setTransform( mtx, curve, callback );
        }
    }; 

    SceneController.prototype.setScene = function ( key, direction ) {
        var newView = this.routes[key];

        if( typeof newView == 'undefined' ) {
            console.warn( 'No view exists!', key );
            return;
        }

        this.currentRoute       = key;
        this.ActiveConstructor  = newView;
		this.inTransition       = true;

        if( direction == undefined ) { 
            this.sceneIndex = this.sceneArray.indexOf( this.currentRoute );
        }
        
        this.emit('set', { key: key, view: newView, index: this.sceneIndex });

        if( this.activeScene && this.activeScene.deactivate ) { 

            this.activeScene.deactivate( this.activateScene.bind(this), direction ); 
            this.emit('deactivate');

        } else { 

            return this.activateScene( direction );

        }
    }; 

	SceneController.prototype.setSceneOrder = function( arr ) {
		this.sceneArray = arr;
        this.emit('reorder', {array: this.sceneArray});
	};

    SceneController.prototype.activateScene = function () {  
        this.reset();

        // unbind active events
        Engine.unpipe( this.activeScene ); 
        
        this.activeScene     =  new this.ActiveConstructor();
        this.activeTransform = new Modifier();

        if( this.activeScene.setController ) { 
            this.activeScene.setController( this );
        }

        Engine.pipe( this.activeScene ); 
        
        this.node.add( this.activeTransform ).link( this.activeScene );

        if( this.activeScene.activate ) { 
            this.activeScene.activate((function() { 

				this.inTransition = false;
                this.emit('activate');

			}).bind(this));

        } else { 

			this.inTransition = false;
            this.emit('activate');
            
		}

    }; 

    SceneController.prototype.getCurrentRoute = function  () {
        return this.currentRoute; 
    };

    SceneController.prototype.getCurrentIndex = function  () {
        return this.sceneIndex;
    };

    SceneController.prototype.getRoutes = function ( ) {
        return this.routes;
    };

    SceneController.prototype.getSceneOrder = function  () {
        return this.sceneArray;
    };

    SceneController.prototype.getOrderedScenes = function  () {
        var out = []; 
        for (var i = 0; i < this.sceneArray.length; i++) {
            out.push( this.routes[this.sceneArray[i]] );
        };
        return out;
    };   

    SceneController.prototype.getActiveTransform = function () {
        return this.activeTransform;
    };  
    module.exports = SceneController;
});
