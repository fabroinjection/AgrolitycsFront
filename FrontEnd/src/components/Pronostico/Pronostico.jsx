// importar estilos
import './Pronostico.css';

import iconoSiguiente from '../../assets/iconoSiguiente.png';
import iconoVolver from '../../assets/iconoVolver.png';

// importar comoponentes
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

// import services
import { climaService } from '../../services/pronostico.service';

// import utilities
import { formatFechaHoraAEscrito, formatFechaHoraADiaMes, formatFechaHoraANombreDia } from '../../utilities/fechas.utilities';

function Pronostico({ lat, lon }) {
  const [open, setOpen] = useState(false);

  const [ datosClima, setDatosClima ] = useState();

  const [ pronostico5Dias, setPronostico5Dias ] = useState();

  useEffect(() => {
    const fetchPronostico = async () => {
      try {
        const { data } = await climaService(lat, lon);
        setDatosClima(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPronostico();
  }, []);

  if (datosClima) {
    return(
      <div className='flexCollapse'>
      <div className='weather'>
          <div className='top'>
            <div>
              <p className='city'>{datosClima.location.name}</p>
              <p className='weather-description'>{datosClima.current.condition.text}</p>
            </div>        
            <img src={datosClima.current.condition.icon} alt="weather" className='weather-icon'/>
          </div>
          <div className="bottom">
            <div className='temp'>
              <p className='temperatura'>{Math.round(datosClima.current.temp_c)}°C</p>
            </div>        
            <div className="details">
              <div className='parameter-row'>
                <span className='parameter-label'>Detalles</span>
              </div>
              <div className='parameter-row'>
                <span className='parameter-label'>Mínima </span>
                <span className='parameter-value'>{Math.round(datosClima.forecast.forecastday[0].day.mintemp_c)}°C</span>
              </div>
              <div className='parameter-row'>
                <span className='parameter-label'>Máxima </span>
                <span className='parameter-value'>{Math.round(datosClima.forecast.forecastday[0].day.maxtemp_c)}°C</span>
              </div>
              <div className='parameter-row'>
                <span className='parameter-label'>Viento </span>
                <span className='parameter-value'>{Math.round(0.277778 * datosClima.current.wind_kph)} m/s</span>
              </div>
              <div className='parameter-row'>
                <span className='parameter-label'>Humedad </span>
                <span className='parameter-value'>{datosClima.current.humidity} %</span>
              </div>
            </div>
          </div>
          <div className='seccionBotonClima'>
            <span className='dia'>{formatFechaHoraAEscrito(datosClima.current.last_updated)}</span>
            <Button 
              className='botonPronostico'
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              <img className='icono-siguiente' src={open ? iconoVolver : iconoSiguiente} alt="Pronóstico extendido" />
            </Button>
          </div>
      </div>
      <div style={{ minHeight: '150px' }}>
          <Collapse in={open} dimension="width">
            <div id="example-collapse-text" className='extended-weather'>
              <div className='weather-por-dia'>
                <p className='dia-semana'>{formatFechaHoraANombreDia(datosClima.forecast.forecastday[1].date)}</p>
                <p className='parametro-semana'>{formatFechaHoraADiaMes(datosClima.forecast.forecastday[1].date)}</p>
                <img src={datosClima.forecast.forecastday[1].day.condition.icon} alt="weather" className='weather-icon'/>
                <p className='parametro-semana'>{datosClima.forecast.forecastday[1].day.avghumidity}%</p>
                <p className='parametro-semana'>Min. {Math.round(datosClima.forecast.forecastday[1].day.mintemp_c)}°C</p>
                <p className='parametro-semana'>Máx. {Math.round(datosClima.forecast.forecastday[1].day.maxtemp_c)}°C</p>
              </div>
              <div className='weather-por-dia'>
                <p className='dia-semana'>{formatFechaHoraANombreDia(datosClima.forecast.forecastday[2].date)}</p>
                <p className='parametro-semana'>{formatFechaHoraADiaMes(datosClima.forecast.forecastday[2].date)}</p>
                <img src={datosClima.forecast.forecastday[2].day.condition.icon} alt="weather" className='weather-icon'/>
                <p className='parametro-semana'>{datosClima.forecast.forecastday[2].day.avghumidity}%</p>
                <p className='parametro-semana'>Min. {Math.round(datosClima.forecast.forecastday[2].day.mintemp_c)}°C</p>
                <p className='parametro-semana'>Máx. {Math.round(datosClima.forecast.forecastday[2].day.maxtemp_c)}°C</p>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    );  
  } else {
    return(<div></div>)
  }
  
}

export default Pronostico;

