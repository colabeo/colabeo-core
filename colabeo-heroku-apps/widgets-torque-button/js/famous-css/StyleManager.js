define(function(require, exports, module) {
    var globalCssRules = {};
    
    function setStyles() {
        for (x in document.styleSheets) {
            var core_css = document.styleSheets[x]
            var myrules = core_css.cssRules ? core_css.cssRules : core_css.rules
            if (myrules) {} else {
                continue
            }
            for (i = 0; i < myrules.length; i++) {
                var selector = myrules[i].selectorText;
                if (selector in globalCssRules) {
                    for (key in globalCssRules[selector]) {
                        if (key == 'height') {
                            myrules[i].style.height = globalCssRules[selector][key]
                        } else if (key == 'width') {
                            myrules[i].style.width = globalCssRules[selector][key]
                        } else if (key == 'line-height') {
                            myrules[i].style.lineHeight = globalCssRules[selector][key]
                        } else if (key == 'margin-top') {
                            myrules[i].style.marginTop = globalCssRules[selector][key]
                        } else if (key == 'margin-bottom') {
                            myrules[i].style.marginBottom = globalCssRules[selector][key]
                        } else if (key == 'margin-right') {
                            myrules[i].style.marginRight = globalCssRules[selector][key]
                        } else if (key == 'min-height') {
                            myrules[i].style.minHeight = globalCssRules[selector][key]
                        } else if (key == 'left') {
                            myrules[i].style.left = globalCssRules[selector][key]
                        } else if (key == 'right') {
                            myrules[i].style.right = globalCssRules[selector][key]
                        } else if (key == 'padding') {
                            myrules[i].style.padding = globalCssRules[selector][key]
                        } else if (key == 'top') {
                            myrules[i].style.top = globalCssRules[selector][key]
                        } else if (key == 'bottom') {
                            myrules[i].style.bottom = globalCssRules[selector][key]
                        } else if (key == 'text-shadow') {
                            myrules[i].style.textShadow = globalCssRules[selector][key]
                        } else if (key == 'font-family') {
                            myrules[i].style.fontFamily = globalCssRules[selector][key]
                        } else if (key == 'font-size') {
                            myrules[i].style.fontSize = globalCssRules[selector][key]
                        } else if (key == 'background-size') {
                            myrules[i].style.backgroundSize = globalCssRules[selector][key]
                        } else if (key == 'margin') {
                            myrules[i].style.margin = globalCssRules[selector][key]
                        } else if (key == 'padding-left') {
                            myrules[i].style.paddingLeft = globalCssRules[selector][key]
                        } else if (key == 'padding-right') {
                            myrules[i].style.paddingRight = globalCssRules[selector][key]
                        } else if (key == 'padding-top') {
                            myrules[i].style.paddingTop = globalCssRules[selector][key]
                        } else if (key == 'padding-bottom') {
                            myrules[i].style.paddingBottom = globalCssRules[selector][key]
                        } else if (key == 'letter-spacing') {
                            myrules[i].style.letterSpacing = globalCssRules[selector][key]
                        } else if (key == 'margin-left') {
                            myrules[i].style.marginLeft = globalCssRules[selector][key]
                        } else if (key == 'min-width') {
                            myrules[i].style.minWidth = globalCssRules[selector][key]
                        } else if (key == 'max-height') {
                            myrules[i].style.maxHeight = globalCssRules[selector][key]
                        } else if (key == 'border-top') {
                            myrules[i].style.borderTop = globalCssRules[selector][key]
                        } else if (key == 'border') {
                            myrules[i].style.border = globalCssRules[selector][key]
                        } else if (key == '-webkit-perspective') {
                            myrules[i].style['-webkit-perspective'] = globalCssRules[selector][key]
                        } else if (key == 'perspective') {
                            myrules[i].style.perspective = globalCssRules[selector][key]
                        } else if (key == 'background') {
                            myrules[i].style['background-color'] = globalCssRules[selector][key]
                            myrules[i].style.background = globalCssRules[selector][key]
                        } else if (key == 'box-shadow') {
                            myrules[i].style['-webkit-box-shadow'] = globalCssRules[selector][key]
                            myrules[i].style['-moz-box-shadow'] = globalCssRules[selector][key]
                            myrules[i].style['box-shadow'] = globalCssRules[selector][key]
                        } else if (key == 'border-top-right-radius') {
                            myrules[i].style['border-top-right-radius'] = globalCssRules[selector][key]
                            myrules[i].style['-webkit-border-top-right-radius'] = globalCssRules[selector][key]
                            myrules[i].style['-moz-border-radius-topright'] = globalCssRules[selector][key]
                        } else if (key == 'border-radius') {
                            myrules[i].style['-moz-border-radius'] = globalCssRules[selector][key]
                            myrules[i].style['-webkit-border-radius'] = globalCssRules[selector][key]
                            myrules[i].style.borderRadius = globalCssRules[selector][key]
                        } else {
                            console.log('Cant set CSS variable. No function associated with: ' + key)
                        }
                    }
                }
            }
        }
        globalCssRules = {}
        myrules = null
        core_css = null
    };

    function setRule(cssSelector, key, val) {
        if (!(cssSelector in globalCssRules)) {globalCssRules[cssSelector] = {};}
        val = val.toString().toLowerCase();
        if (val.indexOf('rgb') < 0 && val.indexOf('px') < 0 && val.indexOf('%') < 0 && val.indexOf('#' < 0)) {val = val + 'px';}
        globalCssRules[cssSelector][key] = val;
    }
    
    exports.setStyles = setStyles;
    exports.setRule = setRule;
    
});