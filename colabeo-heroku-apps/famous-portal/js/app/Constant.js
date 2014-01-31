define(function(require, exports, module) {

    function constant(opts){

        this.colabeoLogoWidth = 200;
        this.headerHeight = 150;
        this.footerHeight = 50;
        this.favorItemWidth = 200;
        this.favorItemHeight = 150;
        this.favorPaddingTop = 20;
        this.favorPaddingLeft = 10;
        this.favorPaddingRight = 10;
        this.gridLayoutCol = 0;
        this.gridLayoutRow = 0;
    }
    module.exports = constant;
});