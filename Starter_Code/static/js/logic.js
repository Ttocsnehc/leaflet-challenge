const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function getMarkerSize(magnitude) {
  return magnitude * 4; 
}

function getMarkerColor(depth) {
    if (depth > 90) {
      return 'darkred';
    } else if (depth > 70) {
      return 'red';
    } else if (depth > 50) {
      return 'orange';
    } else if (depth > 30) {
      return 'yellow';
    } else if (depth > 10) {
      return 'lightgreen';
    } else {
      return 'green';
    }
  }

const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'legend');
  const colors = ['green', 'lightgreen', 'yellow', 'orange', 'red', 'darkred'];
  const labels = ['-10 to 10 km', '10 to 30 km', '30 to 50 km', '50 to 70 km', '70 to 90 km', '90+ km'];

  let legendContent = '<h4>Depth</h4>';
  for (let i = 0; i < colors.length; i++) {
    legendContent +=
      '<div class="legend-item">' +
      `<i style="background:${colors[i]}"></i>` +
      `<span>${labels[i]}</span>` +
      '</div>';
  }
  div.innerHTML = legendContent;
  return div;
};
legend.addTo(map);

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
      
      const marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);
    });
  })
  .catch(error => {
    console.log('Error fetching earthquake data:', error);
  });
