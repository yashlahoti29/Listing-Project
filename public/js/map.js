mapboxgl.accessToken =mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // style URL. can also use outdoors-v11
  center: listingCoordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listingCoordinates) //listing.geometry.corrdinnate
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<p> Exact Location will be provided after booking </p>`
    )
  )
  .addTo(map);