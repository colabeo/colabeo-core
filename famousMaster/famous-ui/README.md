FAMOUS - UI:
================================================================

SUBMODULES REQUIRED:
----------------------------------------------------------------

famous-color
famous-animation
famous-utils
famous-views

```
git submodule add git@github.com:Famous/color.git js/famous-color
git submodule add git@github.com:Famous/animation.git js/famous-animation
git submodule add git@github.com:Famous/famous-views.git js/famous-views
git submodule add git@github.com:Famous/utils.git js/famous-utils
```

UI Widgets included:
----------------------------------------------------------------

BoolToggle ( Boolean ) : true / false for a value.

MultiBoolToggle ( Radio Button ) : only one can be selected.

Slider ( number range ) : from a to b.

PanelScroller: A container to hold your UI in a scrollview

ColorPicker: A rgb picker.

MultiEasingToggler:
    Visualized Easing equations that you can pick.

Dropdown: 
    A key / value selector.

Auto UI Example:
----------------------------------------------------------------
```
define(function(require, exports, module) {
     var View = require('famous/View');
     var Engine = require('famous/Engine');
     var mainCtx = Engine.createContext();
     mainCtx.setPerspective(1000);
     
     function CustomView() {
        View.apply( this, arguments );
     
        // the order of items in the autoUI definition 
        this.autoUI = [
            {
                type: 'slider', 
                key: 'value1',
                uiOptions: { 
                    range: [0, 10],
                    precision: 0,
                    name: 'Value 1'
                }
            },
            {
                type: 'toggle', 
                uiOptions: { 
                    defaultValue: false,
                    name: 'test'
                },
                callback: function (e) { 
                    console.log(e);
                }
            }
        ]
     }
     CustomView.prototype = Object.create( View.prototype );
     CustomView.prototype.constructor = CustomView;
     
     CustomView.DEFAULT_OPTIONS = { 
         value1: 10,
         value2: false
     }
     
     // creating the autoUI:
     var AutoUI = require('famous-ui/AutoUI');
     
     var yourView = new CustomView();
     var ui = new AutoUI();
     // the the autoUI where to find the autoUI definition
     ui.setCurrentObject( yourView );
     
     mainCtx.add(yourView);
     mainCtx.add(ui);
});
```
