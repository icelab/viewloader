function initMap(el, options){
  const map = new google.maps.Map(el, {
    center: options.cityCoordinates,
    zoom: 12
  });

  new google.maps.Marker({
    position: options.coordinates,
    map: map
  });
}

module.exports = function embedMap(el, props) {
  google.maps.event.addDomListener(window, 'load', function onLoad () {
    initMap(el, props);
  });
}
