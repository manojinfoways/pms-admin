import React, { useRef, useState, useEffect } from "react"
import MapContext from "../../MapContext";
import DownloadControl from './controls/DownloadControl';
import * as ol from "ol";
import {Control, defaults as defaultControls, FullScreen} from 'ol/control';
import {transform as olTransform,toLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import './GISMap.css';
import 'ol/ol.css';
import { fromLonLat } from "ol/proj";

const LocationMap = ({ children, zoom, center,enableDownload,width,height,onMapClick,className="ol-map" }) => {

  const mapRef = useRef();
  const [map, setMap] = useState(null);
  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center: olTransform(center,'EPSG:4326', 'EPSG:3857'),projection: 'EPSG:3857' }),
      layers: [new TileLayer({
		source: new OSM()})]	,
      controls: defaultControls().extend([new FullScreen()]),
      overlays: []
    };
    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
	if(enableDownload)
		mapObject.addControl(new DownloadControl());
	
	
	setMap(mapObject);
	return () => mapObject.setTarget(undefined);
  }, []);
  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);
  // Attach event handler
  useEffect(() => {
    if (!map) return;
    map.on('click', function(evt){
		var coords = toLonLat(evt.coordinate.slice());
		var lat = coords[1];
		var lon = coords[0];
		var locTxt = "Latitude: " + lat + " Longitude: " + lon;
		console.log(locTxt);
		
		if(onMapClick != undefined)
			onMapClick({latitude: lat,longitude: lon},evt);
	});
	
  }, [map])
  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} className={className} style={{height}}>
        {children}
      </div>
    </MapContext.Provider>
  )
}
export default LocationMap;