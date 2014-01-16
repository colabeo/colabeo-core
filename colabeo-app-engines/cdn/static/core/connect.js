(function(){
var base = window.colabeoBase;

var html= '';

var css = '';

var colabeoConnect = document.createElement('div');
colabeoConnect.id = 'colabeoConnect';
var colabeoCss = document.createElement('style');
colabeoCss.classList.add('colabeoCSS');
colabeoCss.innerHTML = css;
colabeoConnect.innerHTML = html;
document.body.appendChild(colabeoConnect);
document.body.appendChild(colabeoCss);

})();
