let map;
let markers = [];
let geocoder;

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
            "visibility": "off",
          },
        ],
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off",
          },
        ],
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off",
          },
        ],
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off",
          },
        ],
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off",
          },
        ],
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off",
          },
        ],
      },
    ],
  });

const icons = {
  academics: {
    icon: "static/Academics.png",
  },
  party: {
    icon: "static/PartyIcon.png",
  },
  pickup: {
    icon: "static/Pick Up.png",
  },
  clubs: {
    icon: "static/extracurricular.png",
  },
  campusevents: {
    icon: "static/Campus Events.png",
  }
};    

const geocoder = new google.maps.Geocoder();

  fetch("./events.json")
    .then((response) => response.json())
    .then((locations) => {
      console.log(locations)
      renderMarkers(locations);
      setupTypeListeners();
    })
    .catch((error) => console.error("Error fetching JSON:", error));

  function renderMarkers(locations) {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];

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
            type: type,
            icon: icons[type].icon
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${name}</strong><br>${Address}<br>Type: ${type}<br>Start: ${start}<br>End: ${end}`,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          markers.push(marker);
        } else {
          console.error("Geocoding failed:", status);
        }
      });
    });
  }

  function setupTypeListeners() {
    const typeLinks = document.querySelectorAll(".dropdown-menu a");

    typeLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const clickedType = event.target.innerText;
        //console.log("User clicked on type:", clickedType);

        filterMarkersByType(clickedType);
      });
    });
  }

  function filterMarkersByType(selectedType) {
    markers.forEach((marker) => marker.setMap(null));

    markers.forEach((marker) => {
      test = ""
      if (marker.type === "campusevents") {
        test = "Campus Events"
      } else if (marker.type === "clubs") {
        test = "Clubs"
      } else if (marker.type === "pickup") {
        test = "Pick Up"
      } else if (marker.type === "party") {
        test = "Party"
      } else if (marker.type === "academics") {
        test = "Academic"
      }
      if (test === selectedType) {
        marker.setMap(map);
      }
    });
  }
}

initMap();
