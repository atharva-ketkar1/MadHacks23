let map;

async function initMap() {

  const locations = [
    { address: "1440 Monroe St, Madison, WI 53711", description: "Sex" },
    { address: "529 N Lake St, Madison, WI 53703", description: "fun" },
    { address: "100 State St, Madison, WI 53703", description: "drugs" }];

  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 43.07, lng: -89.40 },
    zoom: 14,

    styles: [
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
      ,
    
});


  const geocoder = new google.maps.Geocoder();

locations.forEach(location => {
    const { address, description } = location;

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            const latitude = results[0].geometry.location.lat();
            const longitude = results[0].geometry.location.lng();

            // Create a marker for each location
            const marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: description,
            });

            // Example: Show an info window with the description
            const infoWindow = new google.maps.InfoWindow({
                content: `<strong>${description}</strong><br>${address}`,
            });
            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            // Center the map on the last marker
            map.setCenter({ lat: latitude, lng: longitude });
        } else {
            console.error("Geocoding failed:", status);
        }
    });
});
}

initMap();
