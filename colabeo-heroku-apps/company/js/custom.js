/* -------------------- Chrome Web Store --------------------- */
jQuery(document).ready(function($) {
	$('body').on('click','.install-link',function(){
		var url = $(this).attr('link');
		if (window.location.host.indexOf('colabeo.com')>=0 && window.chrome && window.chrome.webstore) chrome.webstore.install(url);
		else {
			window.open(url, '_blank');
		}
	});
});
