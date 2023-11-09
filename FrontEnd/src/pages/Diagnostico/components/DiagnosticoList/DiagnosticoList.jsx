// import components
import DiagnosticoCard from '../DiagnosticoCard/DiagnosticoCard'
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Button } from "react-bootstrap";
import Diagnostico from '../Diagnostico/Diagnostico';
import Error from '../../../../components/Modals/Error/Error';

// import hooks
import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// import services
import { buscarTomaMuestraAsociadaService } from '../../../../services/toma_muestra.service';
import { renewToken } from '../../../../services/token.service';
import { getAnalisisService } from '../../../../services/getanalisis.service';
import { listadoDiagnosticosService } from '../../services/diagnostico.service';

// import utilities
import Cookies from 'js-cookie';

import './DiagnosticoList.css';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';

function DiagnosticoList(){

    //variable para manejar la visualización del Form Diagnostico
    const [ mostrarFormDiagnostico, setFormDiagnostico ] = useState(false);

    //variable para el error de vencimiento token
    const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

    //variable para guardar la toma de muestra
    const [ tomaDeMuestra, setTomaDeMuestra ] = useState();

    //variable para guardar el análisis
    const [ analisis, setAnalisis ] = useState();

    //variable para guardar los diagnósticos
    const [ diagnosticos, setDiagnosticos ] = useState();

    const { idTomaMuestra } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        if(idTomaMuestra){
          const fetchTomaMuestra = async () => {
            try {
              const { data } = await buscarTomaMuestraAsociadaService(idTomaMuestra);
              setTomaDeMuestra(data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  renewToken();
                  const { data } = await buscarTomaMuestraAsociadaService(idTomaMuestra);
                  setTomaDeMuestra(data);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }     
          }   
          fetchTomaMuestra();
        }
    
      }, [idTomaMuestra])

      useEffect(() => {
        if(idTomaMuestra){
          const fetchAnalisis = async () => {
            try {
              const { data } = await getAnalisisService(idTomaMuestra);
              setAnalisis(data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  renewToken();
                  const { data } = await getAnalisisService(idTomaMuestra);
                  setAnalisis(data);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }     
          }   
          fetchAnalisis();
        }
    
      }, [idTomaMuestra])

      useEffect(() => {
        if(tomaDeMuestra && analisis){
          const fetchDiagnostico = async () => {
            try {
              const { data } = await listadoDiagnosticosService(analisis[0].id);
              setDiagnosticos(data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  renewToken();
                  const { data } = await listadoDiagnosticosService(analisis[0].id);
                  setDiagnosticos(data);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }     
          }   
          fetchDiagnostico();
        }
    
      }, [tomaDeMuestra, analisis])

    const handleCancelar = () => {
        setFormDiagnostico(false);
    }

    const handleVolver = () => {
        navigate(-1);
    }

    const handleSesionExpirada = () => {
        setMostrarErrorVencimientoToken(false);
        window.localStorage.removeItem('loggedAgroUser');
        navigate("/");
    }

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
      if(tomaDeMuestra && analisis && diagnosticos){
        return(
            <>
                <NavbarBootstrap/>
    
                <div className='contenedorDiagnosticos'>
                    <div className='tituloCentradoListaDiagnostico'>
                        <strong className='tituloDiagnosticoLista'>Diagnósticos - {tomaDeMuestra.codigo}</strong>
                    </div>
                    <div className='tarjetasContenedor'>
                        <div className='tarjetasScroll'>
                            <button name="botonNuevoDiagnostico" className='btn btn-outline-primary btnNuevoDiagnostico' title="Nuevo Diagnóstico" onClick={() => setFormDiagnostico(true)}>
                                <span className="signoMas">+</span>
                            </button>

                            {diagnosticos.map((diagnostico)=>(
                                <DiagnosticoCard key={diagnostico.id} diagnostico={diagnostico} idTomaMuestra={tomaDeMuestra.id}/>
                            ))}

                        </div>
                    </div>
                    <div className='botonNuevaTomaContenedor'>
                        <Button className="estiloBotonesListaDiagno botonVolverDiagnostico" variant="secondary" onClick={handleVolver}>
                            Volver
                        </Button>
                    </div>
                </div>
                {
                    mostrarFormDiagnostico && <Diagnostico idTomaMuestra={idTomaMuestra} accionCancelar={handleCancelar}/>
                }
                {   mostrarErrorVencimientoToken && 
                          <Error 
                          texto={"Su sesión ha expirado"} 
                          onConfirm={handleSesionExpirada}/>
                }
            </>
        );    
    }
    else{
        return(<div>Cargando...</div>)
      }
    }
    else{
      return(<NoLogueado/>)
    }
    
  }

export default DiagnosticoList;
