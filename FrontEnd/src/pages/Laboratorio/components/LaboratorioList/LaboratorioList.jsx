//Estilos
import './LaboratorioList.css';

// import components
import LaboratorioCard from '../LaboratorioCard/LaboratorioCard';
import LaboratorioAMC from '../LaboratorioAMC/LaboratorioAMC';
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Button } from "react-bootstrap";
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Error from '../../../../components/Modals/Error/Error';

// import utilities
import Cookies from 'js-cookie';

// import hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import services
import { laboratoriosService } from '../../../../services/laboratorios.service';
import { renewToken } from '../../../../services/token.service';

function LaboratorioList(){

    const [ laboratorios, setLaboratorios ] = useState([]);

    const [ mostrarFormLaboratorios, setMostrarFormLaboratorios ] = useState(false);

    // manejo de errores con modals vencimiento token
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    // manejo de error de la consulta listado de laboratorios
    const [ errorConsultaLaboratorios, setErrorConsultaLaboratorios ] = useState(false);

    //variables para manejar la actualización de la consulta a labroatorios
    const [ nuevoLaboratorio, setNuevoLaboratorio ] = useState(false);
    const [ actualizacionLaboratorios, setActualizacionLaboratorios ] = useState(false);

    let navigate = useNavigate();

    const handleNavigationHome = () => {
        navigate('/home');
    }

    const handleCancelarForm = () => {
        setMostrarFormLaboratorios(false);
    }

    const registrarNuevoLaboratorio = () => {
        setNuevoLaboratorio(true);
        setMostrarFormLaboratorios(false);
    }

    const actualizacionListaLaboratorios = () => {
        setActualizacionLaboratorios(true);
      }

    useEffect(() => {
        const fetchListadoLaboratorios = async () => {
            try {
              const { data } = await laboratoriosService();
              setLaboratorios(data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  renewToken();
                  const { data } = await laboratoriosService();
                  setLaboratorios(data);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                  else{
                    setErrorConsultaLaboratorios(true);
                  }
                }
              }
              else{
                setErrorConsultaLaboratorios(true);
              }
            }
            
          }   
          fetchListadoLaboratorios();
    }, [])

    useEffect(() => {
        if(nuevoLaboratorio || actualizacionLaboratorios){
            const fetchListadoProductores = async () => {
                try {
                    const { data } = await laboratoriosService();
                    setLaboratorios(data);
                    setNuevoLaboratorio(false);
                    setActualizacionLaboratorios(false);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    try {
                      renewToken();
                      const { data } = await laboratoriosService();
                      setLaboratorios(data);
                      setNuevoLaboratorio(false);
                      setActualizacionLaboratorios(false);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                      else{
                        setErrorConsultaLaboratorios(true);
                      }
                    }
                  }
                  else{
                    setErrorConsultaLaboratorios(true);
                  }
                }     
              }   
              fetchListadoProductores();
        }
    }, [nuevoLaboratorio, actualizacionLaboratorios])

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        return(
            <>
                <NavbarBootstrap/>
        
                <div className='contenedorLaboratorios'>
                    <div className='tituloCentradoListaLaboratorio'>
                        <strong className='tituloLaboratorioLista'>Mis Laboratorios</strong>
                    </div>
                    <div className='tarjetasContenedor'>
                        <div className='tarjetasScroll'>
                            <button name="botonNuevoLaboratorio" className='btn btn-outline-primary btnNuevoLaboratorio' title="Nuevo Diagnóstico"
                            onClick={() => setMostrarFormLaboratorios(true)}>
                                <span className="signoMas">+</span>
                            </button>
    
                            {laboratorios.map((laboratorio)=>(
                                <LaboratorioCard key={laboratorio.id} laboratorio={laboratorio} accionActualizarLista={actualizacionListaLaboratorios}/>
                            ))}
                            
    
                        </div>
                    </div>
                    <div className='botonNuevaTomaContenedor'>
                        <Button className="estiloBotonesListaLaboratorio botonVolverLaboratorio" variant="secondary"
                        onClick={handleNavigationHome}>
                            Volver
                        </Button>
                    </div>
                </div>
    
                {
                    mostrarFormLaboratorios && <LaboratorioAMC accionCancelar={handleCancelarForm} accionConfirmar={registrarNuevoLaboratorio} modo={"Registrar"}/>
                }

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {
                    errorConsultaLaboratorios &&
                    <Error texto={"Ha ocurrido un error obteniendo sus laboratorio, intente nuevamente más tarde"} 
                    onConfirm={() => setErrorConsultaLaboratorios(false)}/>
                }
            </>
        );
    }
    else{
        return(<NoLogueado/>)
    }
    
}

export default LaboratorioList;

