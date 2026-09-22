/* The Beaver Gazette — site scripts.
 *
 * Third-party services are blocked in the markup with the
 * type="text/plain" data-usercentrics="..." pattern, which the CMP flips to
 * text/javascript once consent is granted. Geolocation is a browser API
 * rather than a third-party script, so it is handled here. */

document.addEventListener('click', function (event) {
  var geoBtn = event.target.closest('[data-geo-for]');
  if (geoBtn) {
    requestLocation(geoBtn.getAttribute('data-geo-for'));
  }
});

function requestLocation(slotId) {
  var output = document.getElementById(slotId + '-output');

  // Gate this on the visitor's consent for the geolocation service, e.g.:
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
