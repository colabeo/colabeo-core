(function(){
var base = window.demoboBase;

var html= '';

var css = '';

var demoboConnect = document.createElement('div');
demoboConnect.id = 'demoboConnect';
var demoboCss = document.createElement('style');
demoboCss.classList.add('demoboCSS');
demoboCss.innerHTML = css;
demoboConnect.innerHTML = html;
document.body.appendChild(demoboConnect);
document.body.appendChild(demoboCss);

})();
