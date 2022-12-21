//geoJSON stuff


//setting map
const map= L.map('map').setView([44.66963, -63.613],13.2);
//console.log('Geo JSON',geoJSON);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let busIcon = L.icon({
    iconUrl: 'bus-new-2.png',
    

    iconSize:     [45, 50], // size of the icon
    
    iconAnchor:   [20, 30], // point of the icon which will correspond to marker's location
    
    popupAnchor:  [5, 0] // point from which the popup should open relative to the iconAnchor
});

let busMarkers = {};

//init buses

fetch('https://hrmbuses.azurewebsites.net/')
.then(res => res.json())
.then(busObj =>
    {
        
        //filters to bus route IDs less than or equal to 10
        const buses= busObj.entity.filter(bus => (parseInt(bus.vehicle.trip.routeId) <= 10 || parseInt(bus.vehicle.trip.routeId) >= 90 && parseInt(bus.vehicle.trip.routeId) <= 91 ))
        // console.log(`Raw JSON DATA:`);
        // console.log(buses.map(bus=>bus.vehicle.trip.routeId));

        let geoJSON= generateGeoFromLatLong(buses);
        console.log(`Geo JSON Data:`);
        console.log(geoJSON);
        geoLayer = L.geoJSON(geoJSON,{
            pointToLayer:(feature,latlng)=> L.marker(latlng,{icon:busIcon, rotationAngle:feature.properties.rotationAngle}),
            onEachFeature: (feature,layer) =>
            {
                layer.bindPopup(`Route:<b>${feature.properties.routeId}</b>`);
                layer.bindTooltip(feature.properties.routeId,{
                    permanent:true, 
                    direction:"center"});
            }
        }).addTo(map);
    });

    
function updateBus()
{

        fetch('https://hrmbuses.azurewebsites.net/')
        .then(res => res.json())
        .then(busObj =>
            {
                const buses= busObj.entity.filter(bus => (parseInt(bus.vehicle.trip.routeId) <= 10) || (parseInt(bus.vehicle.trip.routeId) >= 90) && parseInt(bus.vehicle.trip.routeId) <= 91)
                let geoJSON= generateGeoFromLatLong(buses);
                geoLayer.eachLayer(bus =>
                {
                    geoJSON.map(obj=>
                        {
                            if(obj.properties.id == bus.feature.properties.id)
                            {
                                //reverses on account of geoJSON "swap" with latittude and longitude
                                bus.setLatLng(obj.geometry.coordinates.reverse());
                                bus.setRotationAngle(obj.properties.rotationAngle);
                            }
                        });
                })
            });
        }
    
    function generateGeoFromLatLong(obj)
        {
            //console.log(obj);
            let geoJSON= obj.map(data=>
            {

        return {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": [data.vehicle.position.longitude, data.vehicle.position.latitude]
        },
        "properties": {
        "id": data.id,
        "routeId": data.vehicle.trip.routeId,
        "rotationAngle": data.vehicle.position.bearing
        
        }
        }
    });
    return geoJSON;
        }
        

//will do every 5 secs
setInterval(updateBus,15000);
