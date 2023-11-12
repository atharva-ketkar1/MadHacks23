let map;

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 43.07207615257759, lng: -89.40075908988423 },
    zoom: 15,
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

  fetch("./events.json")
    .then((response) => response.json())
    .then((locations) => {
      console.log(locations);

      locations.forEach((location) => {
        const { Address, name, type, start, end } = location;

        geocoder.geocode({ address: Address }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            const latitude = results[0].geometry.location.lat();
            const longitude = results[0].geometry.location.lng();

            const marker = new google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: map,
              title: name,
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<strong>${name}</strong><br>${Address}<br>Type: ${type}<br>Start: ${start}<br>End: ${end}`,
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          } else {
            console.error("Geocoding failed:", status);
          }
        });
      });
    })
    .catch((error) => console.error("Error fetching JSON:", error));
}

initMap();