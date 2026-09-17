// Boots Google Analytics 4 and Yandex Metrica from data attributes on the
// script tag (see libs/components/common/Analytics.tsx). Kept as a static file
// so the page needs no inline scripts under the Content-Security-Policy.
(function () {
	var el = document.currentScript;
	if (!el) return;
	var ga = el.getAttribute('data-ga');
	var ym = el.getAttribute('data-ym');
	if (ga) {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag() {
			window.dataLayer.push(arguments);
		};
		window.gtag('js', new Date());
		window.gtag('config', ga);
		var s = document.createElement('script');
		s.async = true;
		s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga);
		document.head.appendChild(s);
	}
	if (ym) {
		(function (m, e, t, r, i, k, a) {
			m[i] =
				m[i] ||
				function () {
					(m[i].a = m[i].a || []).push(arguments);
				};
			m[i].l = 1 * new Date();
			for (var j = 0; j < document.scripts.length; j++) {
				if (document.scripts[j].src === r) return;
			}
			k = e.createElement(t);
			a = e.getElementsByTagName(t)[0];
			k.async = 1;
			k.src = r;
			a.parentNode.insertBefore(k, a);
		})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
		window.ym(Number(ym), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
	}
})();
