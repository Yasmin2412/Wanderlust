
    
      mapboxgl.accessToken = Map_Token;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [75.7873, 26.9124], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
