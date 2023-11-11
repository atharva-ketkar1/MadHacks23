let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 43.07, lng: -89.40 },
    zoom: 14,
  });
}

initMap();