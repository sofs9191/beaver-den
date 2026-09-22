/* The Beaver Gazette — demo helpers.
 *
 * This file is NOT the consent mechanism. Real blocking is done by the
 * type="text/plain" data-usercentrics="..." pattern in the HTML, which the
 * CMP script flips to text/javascript once consent is granted.
 *
 * Everything here exists so the page is still explorable before a CMP is
 * wired in: a "Load anyway (demo only)" button per service, plus the
 * geolocation call. */

document.addEventListener('click', function (event) {
  var demoBtn = event.target.closest('[data-demo-for]');
  if (demoBtn) {
    loadDemoEmbed(demoBtn.getAttribute('data-demo-for'));
    return;
  }

  var geoBtn = event.target.closest('[data-geo-for]');
  if (geoBtn) {
    requestLocation(geoBtn.getAttribute('data-geo-for'));
  }
});

function loadDemoEmbed(slotId) {
  var slot = document.getElementById(slotId);
  var tpl = slot.querySelector('template.demo-embed');
  var placeholder = slot.querySelector('.consent-placeholder');

  placeholder.replaceWith(tpl.content.cloneNode(true));
}

function requestLocation(slotId) {
  var output = document.getElementById(slotId + '-output');

  // In production, gate this on the visitor's consent for the geolocation
  // service, e.g.:
  //   var service = window.UC_UI && window.UC_UI.getServicesBaseInfo()
  //     .find(function (s) { return s.name === 'Browser Geolocation'; });
  //   if (!service || !service.consent.status) return;

  if (!navigator.geolocation) {
    output.textContent = 'This browser has no geolocation support.';
    return;
  }

  output.textContent = 'Asking your browser for a fix…';

  navigator.geolocation.getCurrentPosition(
    function (position) {
      output.textContent =
        'You are at ' +
        position.coords.latitude.toFixed(3) +
        ', ' +
        position.coords.longitude.toFixed(3) +
        ' — nearest known lodge: probably closer than you think. Beavers are in most watersheds.';
    },
    function (error) {
      output.textContent = 'Location unavailable: ' + error.message;
    }
  );
}
