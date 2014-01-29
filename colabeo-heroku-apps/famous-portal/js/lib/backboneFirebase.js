"use strict";!function(){var a=window._,b=window.Backbone;b.Firebase=function(a){this._fbref=a,this._children=[],"string"==typeof a&&(this._fbref=new Firebase(a)),this._fbref.on("child_added",this._childAdded,this),this._fbref.on("child_moved",this._childMoved,this),this._fbref.on("child_changed",this._childChanged,this),this._fbref.on("child_removed",this._childRemoved,this)},a.extend(b.Firebase.prototype,{_childAdded:function(b,c){var d=b.val();if(d.id=b.name(),c){var e=a.find(this._children,function(a){return a.id==c});this._children.splice(this._children.indexOf(e)+1,0,d)}else this._children.unshift(d)},_childMoved:function(b,c){var d=b.val();this._children=a.reject(this._children,function(a){return a.id==d.id}),this._childAdded(b,c)},_childChanged:function(b){var c=b.val();c.id=b.name();var d=a.find(this._children,function(a){return a.id==c.id});this._children[this._children.indexOf(d)]=c},_childRemoved:function(b){var c=b.val();this._children=a.reject(this._children,function(a){return a.id==c.id})},create:function(b,c){b.id||(b.id=this._fbref.ref().push().name());var d=b.toJSON();this._fbref.ref().child(b.id).set(d,a.bind(function(a){a?c("Could not create model "+b.id):c(null,d)},this))},read:function(b,c){if(!b.id)return a.defer(c,"Invalid model ID provided to read"),void 0;var d=a.find(this._children,function(a){return a.id==b.id});a.defer(c,null,this._children[d])},readAll:function(b,c){a.defer(c,null,this._children)},update:function(a,b){var c=a.toJSON();this._fbref.ref().child(a.id).update(c,function(d){d?b("Could not update model "+a.id,null):b(null,c)})},"delete":function(a,b){this._fbref.ref().child(a.id).remove(function(c){c?b("Could not delete model "+a.id):b(null,a)})},ref:function(){return this._fbref}}),b.Firebase.sync=function(a,c,d,e){var f=c.firebase||c.collection.firebase;"function"==typeof d&&(d={success:d,error:e}),"read"==a&&void 0===c.id&&(a="readAll"),f[a].apply(f,[c,function(a,e){a?(c.trigger("error",c,a,d),"0.9.10"===b.VERSION?d.error(c,a,d):d.error(a)):(c.trigger("sync",c,e,d),"0.9.10"===b.VERSION?d.success(c,e,d):d.success(e))}])},b.oldSync=b.sync,b.sync=function(a,c,d,e){var f=b.oldSync;return(c.firebase||c.collection&&c.collection.firebase)&&(f=b.Firebase.sync),f.apply(this,[a,c,d,e])},b.Firebase.Collection=b.Collection.extend({sync:function(){this._log("Sync called on a Firebase collection, ignoring.")},fetch:function(){this._log("Fetch called on a Firebase collection, ignoring.")},constructor:function(c,d){switch(b.Collection.apply(this,arguments),d&&d.firebase&&(this.firebase=d.firebase),typeof this.firebase){case"object":break;case"string":this.firebase=new Firebase(this.firebase);break;case"function":this.firebase=this.firebase();break;default:throw new Error("Invalid firebase reference created")}this.firebase.on("child_added",a.bind(this._childAdded,this)),this.firebase.on("child_moved",a.bind(this._childMoved,this)),this.firebase.on("child_changed",a.bind(this._childChanged,this)),this.firebase.on("child_removed",a.bind(this._childRemoved,this)),this.firebase.once("value",a.bind(function(){this.trigger("sync",this,null,null)},this)),this.listenTo(this,"change",this._updateModel,this),this.listenTo(this,"destroy",this._removeModel,this),this._suppressEvent=!1},comparator:function(a){return a.id},add:function(b,c){var d=this._parseModels(b);c=c?a.clone(c):{},c.success=a.isFunction(c.success)?c.success:function(){};for(var e=0;e<d.length;e++){var f=d[e],g=this.firebase.ref().child(f.id);c.silent===!0&&(this._suppressEvent=!0),g.set(f,a.bind(c.success,f))}return d},remove:function(b,c){var d=this._parseModels(b);c=c?a.clone(c):{},c.success=a.isFunction(c.success)?c.success:function(){};for(var e=0;e<d.length;e++){var f=d[e],g=this.firebase.ref().child(f.id);c.silent===!0&&(this._suppressEvent=!0),g.set(null,a.bind(c.success,f))}return d},create:function(c,d){if(d=d?a.clone(d):{},d.wait&&this._log("Wait option provided to create, ignoring."),c=b.Collection.prototype._prepareModel.apply(this,[c,d]),!c)return!1;var e=this.add([c],d);return e[0]},reset:function(b,c){c=c?a.clone(c):{},this.remove(this.models,{silent:!0});var d=this.add(b,{silent:!0});return c.silent||this.trigger("reset",this,c),d},_log:function(a){console&&console.log&&console.log(a)},_parseModels:function(b){var c=[];b=a.isArray(b)?b.slice():[b];for(var d=0;d<b.length;d++){var e=b[d];e.toJSON&&"function"==typeof e.toJSON&&(e=e.toJSON()),e.id||(e.id=this.firebase.ref().push().name()),c.push(e)}return c},_childAdded:function(c){var d=c.val();d.id||(a.isObject(d)||(d={}),d.id=c.name()),this._suppressEvent===!0?(this._suppressEvent=!1,b.Collection.prototype.add.apply(this,[d],{silent:!0})):b.Collection.prototype.add.apply(this,[d]),this.get(d.id)._remoteAttributes=d},_childMoved:function(a){this._log("_childMoved called with "+a.val())},_childChanged:function(b){var c=b.val();c.id||(c.id=b.name());var d=a.find(this.models,function(a){return a.id==c.id});if(!d)throw new Error("Could not find model with ID "+c.id);this._preventSync(d,!0),d._remoteAttributes=c;var e=a.difference(a.keys(d.attributes),a.keys(c));a.each(e,function(a){d.unset(a)}),d.set(c),this._preventSync(d,!1)},_childRemoved:function(a){var c=a.val();c.id||(c.id=a.name()),this._suppressEvent===!0?(this._suppressEvent=!1,b.Collection.prototype.remove.apply(this,[c],{silent:!0})):b.Collection.prototype.remove.apply(this,[c])},_updateModel:function(b){if(!b._remoteChanging){var c=b._remoteAttributes||{},d=b.toJSON(),e={},f=a.union(a.keys(c),a.keys(d));a.each(f,function(b){a.has(d,b)?d[b]!=c[b]&&(e[b]=d[b]):e[b]=null}),a.size(e)&&this.firebase.ref().child(b.id).update(e)}},_removeModel:function(b,c,d){d=d?a.clone(d):{},d.success=a.isFunction(d.success)?d.success:function(){};var e=this.firebase.ref().child(b.id);e.set(null,a.bind(d.success,b))},_preventSync:function(a,b){a._remoteChanging=b}}),b.Firebase.Model=b.Model.extend({save:function(){this._log("Save called on a Firebase model, ignoring.")},destroy:function(a){this.firebase.ref().set(null,this._log),this.trigger("destroy",this,this.collection,a),a.success&&a.success(this,null,a)},constructor:function(c,d){var e=a.result(this,"defaults");switch(this.once("sync",function(){this.set(a.defaults(this.toJSON(),e))}),b.Model.apply(this,arguments),d&&d.firebase&&(this.firebase=d.firebase),typeof this.firebase){case"object":break;case"string":this.firebase=new Firebase(this.firebase);break;case"function":this.firebase=this.firebase();break;default:throw new Error("Invalid firebase reference created")}this.firebase.on("value",a.bind(this._modelChanged,this)),this._listenLocalChange(!0)},_listenLocalChange:function(a){a?this.on("change",this._updateModel,this):this.off("change",this._updateModel,this)},_updateModel:function(b){var c=b.changedAttributes();a.each(b.changed,function(a,b){("undefined"==typeof a||null===a)&&("id"==b?delete c[b]:c[b]=null)}),a.size(c)&&this.firebase.ref().update(c,this._log)},_modelChanged:function(b){var c=b.val();if("object"==typeof c&&null!==c){var d=a.difference(a.keys(this.attributes),a.keys(c)),e=this;a.each(d,function(a){e.unset(a)})}this._listenLocalChange(!1),this.set(c),this.trigger("sync",this,null,null),this._listenLocalChange(!0)},_log:function(a){"undefined"!=typeof a&&null!==a&&console&&console.log&&console.log(a)}})}();