//import assets
import "leaflet/dist/leaflet.css"
import 'leaflet-draw/dist/leaflet.draw.css'
import './LoteoMapa.css'

//import hooks
import { useEffect, useRef, useState } from 'react';
import useWeather from '../../../hooks/useWeather';

//import components
import { MapContainer, TileLayer, FeatureGroup, Marker, Tooltip, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

//import utilities
import L from 'leaflet';
import Cookies from 'js-cookie';

//import Context
import { useContext } from 'react';
import { MapLayersContext } from '../../../context/MapLayersContext';
import { PolygonCoordsContext } from '../../../context/PolygonCoordsContext';
import { HectareasContext } from '../../../context/HectareasContext';

import Pronostico from '../../Pronostico/Pronostico';

function Mapa({ habilitado = false, registro = false, campo, lotes }){
  const [ polygonCoords, setPolygonCoords ] = useContext(PolygonCoordsContext);
  const [ mapLayers, setMapLayers ] = useContext(MapLayersContext);
  const [ , setHectareas ] = useContext(HectareasContext)
  const [ loteSeleccionadoAConsultar ] = useState(Cookies.get("idLoteSeleccionadoAConsultar"));
  const [ idLoteSeleccionadoAModificar ] = useState(Cookies.get("idLoteAModificar"));

  const [ data, loading, error ] = useWeather(campo.localidad_centroide_lat, campo.localidad_centroide_lon);

  const mapRef = useRef(null);

  useEffect(() => {
    if(idLoteSeleccionadoAModificar){
      if(mapLayers.length > 0){
        const polygon = L.polygon(mapLayers);
        const area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0][0]);
        const hect = (area*0.0001).toFixed(2);
        setHectareas(hect);
      }
    }
    else{
      if(registro && mapLayers[0]){
        const polygon = L.polygon(mapLayers[0].latlngs);
        const area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
        const hect = (area*0.0001).toFixed(2);
        setHectareas(hect)
      }
    }
    
  }, [mapLayers]);

  const handleMapClick = (e) => {
    const { latlng } = e;
    const newCoords = [...polygonCoords, [latlng.lat, latlng.lng]];
    setPolygonCoords(newCoords);
  };

  const _onCreate = e => {
    const { layerType, layer } = e; 
    if( layerType === "polygon" ){
        const {_leaflet_id} = layer;
        setMapLayers( layers => [
            ...layers,
            { id: _leaflet_id, latlngs: layer.getLatLngs()[0]},
        ]);
    } 
  }

  const _onEdited = (e) => {
    const { layers } = e;
    layers.eachLayer((layer) => {
      const { _leaflet_id, editing } = layer;
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
  };

  const edicionModificacion = (e) =>{
    const { layers } = e;
    layers.eachLayer((layer) => {
      const { editing } = layer;
      setMapLayers(editing.latlngs);
    });
  }

  const _onDeleted = (e) => {
    const { layers } = e;
  
    layers.eachLayer((layer) => {
      const { _leaflet_id } = layer;
      setMapLayers((layers) =>
        layers.filter((l) => l.id !== _leaflet_id)
      );
    });
  };

  return (
    <>
    <MapContainer
        className='contenedorMapa'
        center={lotes.length !== 0 
          ? [lotes[0].coordenadas[0][0], lotes[0].coordenadas[0][1]]
          : [campo.localidad_centroide_lat, campo.localidad_centroide_lon]
        }
        zoom={(lotes.length !== 0 ? loteSeleccionadoAConsultar || idLoteSeleccionadoAModificar ? 16 : 14 : 12)}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
        ref={mapRef}
        >

      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'       
      />
      {lotes.map((poligono) => (
        idLoteSeleccionadoAModificar === undefined 
        ? <Polygon key={poligono.id} positions={poligono.coordenadas} 
            color={loteSeleccionadoAConsultar && poligono.id == loteSeleccionadoAConsultar ? "#94e7ff": "#86dd72" }
         />
        : idLoteSeleccionadoAModificar != poligono.id && <Polygon key={poligono.id} positions={poligono.coordenadas}
            color= "#86dd72"
        /> 
      ))}

      <Marker position={[campo.localidad_centroide_lat, campo.localidad_centroide_lon]}>
        <Tooltip direction="top" offset={[-14, -5]} opacity={1} permanent>
          {campo.localidad_nombre + "," + campo.provincia_nombre}
        </Tooltip>
      </Marker>

      <FeatureGroup>
      {lotes.map((poligono) => (
        idLoteSeleccionadoAModificar && idLoteSeleccionadoAModificar == poligono.id && 
        <Polygon key={poligono.id} positions={poligono.coordenadas} 
        color= "#94e7ff"
         />
      ))}
      
      {idLoteSeleccionadoAModificar === undefined ?
        loteSeleccionadoAConsultar ? null
          : habilitado ? 
            <EditControl
            className='controlesMapa' 
            position='topright'
            onCreated={_onCreate}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
            draw={{
                rectangle: false,
                polyline:false,
                circle: false,
                circlemarker: false,
                marker:false,
                polygon: habilitado,
            }}     
            edit={{
              poly: {
                allowIntersection: false,
              },
            }} 
            /> 
            : null
        :
        <EditControl
        className='controlesMapa' 
        position='topright'
        onEdited={edicionModificacion}
        draw={{
            rectangle: false,
            polyline:false,
            circle: false,
            circlemarker: false,
            marker:false,
            polygon: false,
        }}
        edit={{
          remove: false,
          poly: {
            allowIntersection: false,
          },
        }}      
        />
      }

      

      </FeatureGroup>
      
    </MapContainer>

    {
      (!loteSeleccionadoAConsultar && !idLoteSeleccionadoAModificar && !habilitado) &&
      <div style={{ position: 'absolute', zIndex: 20000 }}>
        <Pronostico lat={campo.localidad_centroide_lat} lon={campo.localidad_centroide_lon}/>
      </div> 
    }
       

    </>
    
  );
}

export default Mapa;