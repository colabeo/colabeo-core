define(function(require, exports, module) {
    
    /**
     * @class Helper library to do one thing: more cleanly return the current 
     *        time in the most performant way for your browser.
     *
     * @name Timer
     * @example
     * see AnimationEngine
     */
    function Timer()
    {
        if (window.performance) 
        {
            if(window.performance.now) 
            {
                this.getTime = function() { return window.performance.now(); };
            } 
            else if(window.performance.webkitNow) 
            {           
                this.getTime = function() { return window.performance.webkitNow(); };
            } 
        } 
        else 
        {
            this.getTime = function() { return Date.now(); };
        }
    }
    
    module.exports = Timer;
});
