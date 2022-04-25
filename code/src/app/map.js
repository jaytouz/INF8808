import * as d3 from 'd3';
import * as mapboxgl from "mapbox-gl";
import * as h3 from "h3-js";
import * as geojson2h3 from "geojson2h3";


export function buildMap(div_id){
  const pathToCsv = "./data/collisions_routieres_locations.csv";
  d3.csv(pathToCsv).then((data) => {
    
    //coord de montreal
    const lat = 45.5388;
    const long = -73.7141;

    const precisionLevel = 8;
    
    var hexagons = {};
    var maxAcc = 0

    // Loop calculates number of accident within each hexagon
    for(let i = 0; i < data.length; ++i){
      var dataLat = data[i].LOC_LAT;
      var dataLong = data[i].LOC_LONG;
      var hex = h3.geoToH3(dataLat, dataLong, precisionLevel);
      hexagons[hex] = hexagons[hex] != null ? hexagons[hex]+1 : 0;
      maxAcc = Math.max(maxAcc,hexagons[hex]);
    }

    mapboxgl.accessToken = "pk.eyJ1IjoiYWtvZGEiLCJhIjoiY2wyMnZ0MHowMWsyZTNrbzV4eWlybmlmaCJ9.ID6Bhabq_oe8crICSXGhgA"
    const map = new mapboxgl.Map({
        container: div_id, // container ID
        //style: 'mapbox://styles/mapbox/streets-v11', // style URL
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: [long, lat], // starting position [lng, lat]
        zoom: 10, // starting zoom
        interactive: false
        });

    map.on('load', () => {
        renderHexes(map, hexagons, 0, maxAcc);
        //renderAreas(map, hexagons, 0);
        //d3.select('.mapboxgl-control-container').remove(); //
    });
    
  });
}


// Most code down there taken from https://observablehq.com/@nrabinowitz/h3-tutorial-heatmap-rendering

//const colorScale = ['#ffffcc', '#78c679', '#006837'];
//const colorScale = ['#2bff00', '#fffb00', '#ff0000'];
//const colorScale = ['#ffff00', '#ff9d00' ,'#a60000'];
const colorScale = ['#ffff00', '#ffc400' ,'#a60000'];
const fillOpacity = 0.4;
function renderHexes(map, hexagons, threshold, maxValue) {
  
    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeatureCollection(
      Object.keys(hexagons).filter(hex => hexagons[hex] > threshold),
      hex => ({value: hexagons[hex]})
    );
    
    const sourceId = 'h3-hexes';
    const layerId = `${sourceId}-layer`;
    let source = map.getSource(sourceId);
    
    // Add the source and layer if we haven't created them yet
    if (!source) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson
      });
      map.addLayer({
        id: layerId,
        source: sourceId,
        type: 'fill',
        interactive: false,
        paint: {
          'fill-outline-color': 'rgba(0,0,0,0)',
        }
      });
      source = map.getSource(sourceId);
    }
  
    // Update the geojson data
    source.setData(geojson);
    
    // Update the layer paint properties, using the current config values
    map.setPaintProperty(layerId, 'fill-color', {
      property: 'value',
      stops: [
        [10, colorScale[0]],
        [100, colorScale[1]],
        [1000, colorScale[2]]
      ]
    });
    
    map.setPaintProperty(layerId, 'fill-opacity', fillOpacity);
  }

  function renderAreas(map, hexagons, threshold) {
  
    // Transform the current hexagon map into a GeoJSON object
    const geojson = geojson2h3.h3SetToFeature(
      Object.keys(hexagons).filter(hex => hexagons[hex] > threshold)
    );
    
    const sourceId = 'h3-hex-areas';
    const layerId = `${sourceId}-layer`;
    let source = map.getSource(sourceId);
    
    // Add the source and layer if we haven't created them yet
    if (!source) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson
      });
      map.addLayer({
        id: layerId,
        source: sourceId,
        type: 'line',
        interactive: false,
        paint: {
          'line-width': 3,
          'line-color': colorScale[2],
        }
      });
      source = map.getSource(sourceId);
    }
  
    // Update the geojson data
    source.setData(geojson);
 }
