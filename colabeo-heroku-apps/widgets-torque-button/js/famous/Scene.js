define(function(require, exports, module) {
    var Matrix = require('./Matrix');
    var Modifier = require('./Modifier');
    var RenderNode = require('./RenderNode');

    /**
     * @class Scene definitioninition loader
     * @description Builds and renders a scene graph based on a canonical scene definition
     *
     * @name Scene
     * @constructor
     * @example
     *     see https://github.com/Famous/scene-example
     */
    function Scene(definition) {
        this.id = null;
        this._objects = null;

        this.node = new RenderNode();
        this._definition = null;

        if(definition) this.load(definition);
    };

    Scene.prototype.create = function() {
        return new Scene(this._definition);
    };

    Scene.prototype.load = function(definition) {
        this._definition = definition;
        this.id = {};
        this._objects = [];
        this.node.set(_parse.call(this, definition));
    };

    Scene.prototype.add = function() { return this.node.add.apply(this.node, arguments); };
    Scene.prototype.link = function() { return this.node.link.apply(this.node, arguments); };
    Scene.prototype.render = function() { return this.node.render.apply(this.node, arguments); };

    /**
     * @function compile a scene definitioninition into a loader function
     *
     * @name Scene
     * @constructor
     */
    function _compile(definition) {
        var resultVar = _parse.call(obj, definition);
    };

    function _parse(definition) {
        var result;
        if(definition instanceof Array) {
            result = _parseArray.call(this, definition);
        }
        else {
            var id = this._objects.length;
            if(definition.render && (definition.render instanceof Function)) {
                result = definition;
            }
            else if(definition['target']) {
                var targetObj = _parse.call(this, definition['target']);
                var obj = _parseTransform.call(this, definition);

                result = new RenderNode(obj);
                result.link(targetObj);
                if(definition['id']) this.id[definition['id']] = obj;
            }
            else if(definition['id']) {
                result = new RenderNode();
                this.id[definition['id']] = result;
            }
        }
        this._objects[id] = result;
        return result;
    };

    function _parseArray(definition) {
        var result = new RenderNode();
        for(var i = 0; i < definition.length; i++) {
            var obj = _parse.call(this, definition[i]);
            if(obj) result.add(obj);
        }
        return result;
    };

    function _parseTransform(definition) {
        var transformDefinition = definition['transform'];
        var opacity = definition['opacity'];
        var origin = definition['origin'];
        var size = definition['size'];
        var target = definition['target'];
        var transform = Matrix.identity;
        if(transformDefinition instanceof Array) {
            if(transformDefinition.length == 16 && typeof transformDefinition[0] == 'number') {
                transform = transformDefinition;
            }
            else {
                for(var i = 0; i < transformDefinition.length; i++) {
                    transform = Matrix.multiply(transform, _resolveTransformMatrix(transformDefinition[i]));
                }
            }
        }
        else if(transformDefinition instanceof Object) {
            transform = _resolveTransformMatrix(transformDefinition);
        }

        var result = new Modifier({
            transform: transform,
            opacity: opacity,
            origin: origin,
            size: size
        });
        return result;
    };

    var _MATRIX_GENERATORS = {
        'translate': Matrix.translate,
        'rotate': Matrix.rotate,
        'rotateX': Matrix.rotateX,
        'rotateY': Matrix.rotateY,
        'rotateZ': Matrix.rotateZ,
        'rotateAxis': Matrix.rotateAxis,
        'scale': Matrix.scale,
        'skew': Matrix.skew,
        'matrix3d': function() { return arguments; }
    };

    function _resolveTransformMatrix(matrixDefinition) {
        for(var type in _MATRIX_GENERATORS) {
            if(type in matrixDefinition) {
                var args = matrixDefinition[type];
                if(!(args instanceof Array)) args = [args];
                return _MATRIX_GENERATORS[type].apply(this, args);
            }
        }
    };

    module.exports = Scene;
});
