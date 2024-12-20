  // Initialize the map
  const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
    center: campground.geometry.coordinates,
    zoom: 15
  });
map.addControl(new maplibregl.NavigationControl(), 'top-right');
const popUpText = `<h3>${campground.title}</h3><p>${campground.location}</p>`;
new maplibregl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new maplibregl.Popup().setHTML(popUpText))
  .addTo(map)
