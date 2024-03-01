// import Estilos
import './DiagnosticoList.css';
import '../../../../components/Estilos/estilosFormulario.css';
import '../../../../components/Estilos/estilosListados.css';

// import components
import DiagnosticoCard from '../DiagnosticoCard/DiagnosticoCard'
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Button } from "react-bootstrap";
import Diagnostico from '../Diagnostico/Diagnostico';
import Error from '../../../../components/Modals/Error/Error';
import SpinnerAgrolitycs from '../../../../components/Spinner/SpinnerAgrolitycs';

// import hooks
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// import services
import { buscarTomaMuestraAsociadaService } from '../../../../services/toma_muestra.service';
import { renewToken } from '../../../../services/token.service';
import { getAnalisisService } from '../../../../services/getanalisis.service';
import { listadoDiagnosticosService } from '../../services/diagnostico.service';

// import utilities
import Cookies from 'js-cookie';


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

    const [ actualizar, setActualizar ] = useState(false);

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
    
      }, [tomaDeMuestra, analisis, actualizar])

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

    const actualizarListado = () => {
      setActualizar(!actualizar);
    }

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
      if(tomaDeMuestra && analisis && diagnosticos){
        return(
            <>
                <NavbarBootstrap/>
    
                <div className='contenedor-listado'>
                    <div className='sector-titulo-listado'>
                        <strong className='titulo-listado'>Diagnósticos - {tomaDeMuestra.codigo}</strong>
                    </div>
                    <div className='listado-contenedor'>
                        <div className='listado-scroll'>
                            <Button
                              className='boton-agregar'
                              variant='secondary'
                              title='Nuevo Dignóstico'
                              onClick={() => setFormDiagnostico(true)}
                            >
                                + Agregar Diagnóstico
                            </Button>

                            <div className='contenedor-tarjetas'>
                              {diagnosticos.map((diagnostico)=>(
                                  <DiagnosticoCard key={diagnostico.id} diagnostico={diagnostico} idTomaMuestra={tomaDeMuestra.id} onEliminar={actualizarListado}/>
                              ))}
                            </div>


                        </div>
                    </div>
                    <div className='seccion-boton-volver'>
                        <Button 
                        className="botonCancelarFormulario" 
                        variant="secondary" 
                        onClick={handleVolver}>
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
          return(
          <SpinnerAgrolitycs/>
          )
        }
    }
    else{
      return(<NoLogueado/>)
    }
    
  }

export default DiagnosticoList;
