//import components
import { MapContainer, TileLayer, Polygon, CircleMarker, FeatureGroup } from 'react-leaflet';
import Error from '../../Modals/Error/Error';

//import hooks
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import context
import { EstadoSubMuestrasContext } from '../../../context/EstadoSubMuestrasContext';
import { CantidadSubMuestrasContext } from '../../../context/CantidadSubMuestrasContext';

//import services
import { consultarLoteService } from '../../../pages/DetalleCampo/services/lotesService';
import { puntosSubmuestraService } from '../../../pages/DetalleCampo/services/tomaDeMuestra.service';
import { renewToken } from '../../../services/token.service';

function MapaSubmuestras() {
    //variable del context que tiene la toma de muestra referenciada.
    const [ haySubmuestras ] = useContext(EstadoSubMuestrasContext);

    //variable del context que tiene cant de submuestras.
    const [ cantSubmuestras ] = useContext(CantidadSubMuestrasContext);

    //variables
    const [ lote, setLote ] = useState();
    const [ puntosSubmuestra, setPuntosSubmuestra ] = useState();

    let navigate = useNavigate();

    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    useEffect( () => {
        if (haySubmuestras && cantSubmuestras){
            const fetchLote = async () => {
                try {
                    const { data } = await consultarLoteService(haySubmuestras.lote_id);
                    setLote(data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                          await renewToken();
                          const { data } = await consultarLoteService(haySubmuestras.lote_id);
                          setLote(data);
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                        }
                      }
                }}
            fetchLote();
        }
    }, [haySubmuestras, cantSubmuestras])

    useEffect( () => {
        if (haySubmuestras && cantSubmuestras){
            const fetchPuntosSubmuestra = async () => {
                try {
                    const { data } = await puntosSubmuestraService(haySubmuestras.lote_id, haySubmuestras.tipo_muestreo_nombre, cantSubmuestras);
                    setPuntosSubmuestra(data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                          await renewToken();
                          const { data } = await puntosSubmuestraService(haySubmuestras.lote_id, haySubmuestras.tipo_muestreo_nombre, cantSubmuestras);
                          setPuntosSubmuestra(data);
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                        }
                      }
                }}
            fetchPuntosSubmuestra();
        }
    }, [haySubmuestras, cantSubmuestras])

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    if (lote && puntosSubmuestra) {
        return (
            <MapContainer
                className='contenedorMapa'
                center={[lote.coordenadas[0][0], lote.coordenadas[0][1]]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
            >
                
                <TileLayer
                //url="https://api.maptiler.com/tiles/satellite-mediumres-2018/tiles.json?key=c91jAoRAjwmTgLAMjHro"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'       
                />
                
                <FeatureGroup>

                    
                    <Polygon positions={lote.coordenadas} color="#86dd72"/>
                    {puntosSubmuestra.map((punto, i) => (
                        <CircleMarker key={i} 
                        radius={1} 
                        fillColor='white'
                        color='white'
                        weight={4}
                        opacity={1}
                        fillOpacity={1}
                        center={{ lat: punto[0], lng: punto[1] }}/>
                    ))}

                </FeatureGroup>
            
                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }  

            </MapContainer>
          )


    }
    else{
        return(<div>Cargando...</div>)
    }

}

export default MapaSubmuestras