import './TomaDeMuestraList.css';

//import componentes
import TomaDeMuestraCard from '../TomaDeMuestraCard/TomaDeMuestraCard';
import TomaDeMuestraABMC from '../TomaDeMuestraAMC/TomaDeMuestraAMC';
import Error from '../../../../components/Modals/Error/Error';

//import hooks
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

//import services
import { tomasDeMuestraLoteService } from '../../services/tomaDeMuestra.service';
import { renewToken } from '../../../../services/token.service';

//import Context
import { ModoTomaDeMuestraAMCContext } from '../../../../context/ModoTomaDeMuestraAMCContext'

function TomaDeMuestraList({ idLote }){

    const [ tomasDeMuestra, setTomasDeMuestra ] = useState([]);

    let navigate = useNavigate();

    //estado para manejar la visualización del form registro
    const [ formRegistroMuestra, setFormRegistroMuestra ] = useState(false);
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    //estado para manejar la renderización de la lista una vez creado una nueva toma de muestra o cuando se elimina
    const [ nuevaTomaMuestra, setNuevaTomaMuestra ] = useState(false);
    const [ bajaTomaMuestra, setBajaTomaMuestra ] = useState(false);
    const [ modificacionTomaMuestra, setModificacionTomaMuestra ] = useState(false);
    const [ registroTomaMuesta, setRegistroTomaMuestra ] = useState(false);

    //variables para el context
    const [ , setModoTomaDeMuestra ] = useContext(ModoTomaDeMuestraAMCContext);
    
    const handleMostrarRegistrarTomaDeMuestra = () => {
      setModoTomaDeMuestra('alta');
      setFormRegistroMuestra(true);
    }

    const registrarTomaDeMuestra = () => {
      setFormRegistroMuestra(false);
      setNuevaTomaMuestra(true);
    }

    const cancelarTomaDeMuestra = () => {
      setFormRegistroMuestra(false);
    }

    const handleEstadoBajaTomaMuestra = (estadoBaja) => {
      setBajaTomaMuestra(estadoBaja);
    }

    const handleEstadoModificacionTomaMuestra = (estadoModificacion) => {
      setModificacionTomaMuestra(estadoModificacion);
    }

    useEffect(() => {
      if(idLote || nuevaTomaMuestra || bajaTomaMuestra || modificacionTomaMuestra
        || registroTomaMuesta){
        const fetchTomaMuestras = async () => {
          try {
            const listaTM = await tomasDeMuestraLoteService(idLote);
            setTomasDeMuestra(listaTM.data);
            setNuevaTomaMuestra(false);
            setBajaTomaMuestra(false);
            setModificacionTomaMuestra(false);
            setRegistroTomaMuestra(false);
          } catch (error) {
            if(error.response && error.response.status === 401){
              try {
                await renewToken();
                const listaTM = await tomasDeMuestraLoteService(idLote);
                setTomasDeMuestra(listaTM.data);
                setNuevaTomaMuestra(false);
                setBajaTomaMuestra(false);
                setModificacionTomaMuestra(false);
                setRegistroTomaMuestra(false);
              } catch (error) {
                if(error.response && error.response.status === 401){
                  setMostrarErrorVencimientoToken(true);
                }
              }
            }
          }
        };
        fetchTomaMuestras();
      }
      }, [idLote, nuevaTomaMuestra, bajaTomaMuestra, modificacionTomaMuestra, registroTomaMuesta]);

      const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

      const handleEstadoRegistrarTMTomada = (estadoRegistroTomaMuestra) => {
        setRegistroTomaMuestra(estadoRegistroTomaMuestra);
      }
    

    return (
    <> 
      <div className="info-sectionTomasMuestra">
        <header className='cabeceraTomaDeMuestra'>
            <strong className='tituloTomaDeMuestra'>Mis Tomas de Muestra</strong>
        </header>
        <footer className='mostrarTomasMuestra'>
            <button name="botonNuevaToma" className='btn btn-outline-primary btnNuevaToma' title="Nueva Toma De Muestra"
              onClick={handleMostrarRegistrarTomaDeMuestra}>
                <span className="signoMas">+</span>
            </button>
            {tomasDeMuestra.map((tm) => (
              <TomaDeMuestraCard key={tm.id} tomaDeMuestra={tm} onEliminar={handleEstadoBajaTomaMuestra} 
              onModificar={handleEstadoModificacionTomaMuestra} onRegistrarTomada={handleEstadoRegistrarTMTomada}/>
            ))}
        </footer>

            
      </div>
      {formRegistroMuestra && <TomaDeMuestraABMC titulo='Nueva Toma de Muestra'
      nombreBoton='Aceptar' accionCancelar={cancelarTomaDeMuestra} accionConfirmar={registrarTomaDeMuestra}
      idLote={idLote}/>}

      {mostrarErrorVencimientoToken && <Error texto={"Su sesión ha expirado"} 
      onConfirm={handleSesionExpirada}/>
      } 
    </>    
    );
}

export default TomaDeMuestraList;
