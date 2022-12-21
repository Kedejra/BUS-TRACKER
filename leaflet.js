let geoJSON = [];
geoJSON.push(th);
//const map = L.map('map').setView([51.505, -0.09], 13);
const map= L.map('map').setView([44.66963, -63.613],13.2);
geoLayer = L.geoJSON(geoJSON).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let latittude= 44.646;
let longitude= -63.59;







