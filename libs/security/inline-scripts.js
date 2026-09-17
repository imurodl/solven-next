// Inline scripts that ship in the HTML. next.config.js hashes them for the
// Content-Security-Policy header, so the text here must be used verbatim.

// Applies the saved/system theme before first paint (no light->dark flash).
exports.THEME_BOOT_SCRIPT =
	"(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();";
