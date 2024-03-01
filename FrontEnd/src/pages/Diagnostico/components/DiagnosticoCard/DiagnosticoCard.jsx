//Componentes
import Dropdown from 'react-bootstrap/Dropdown';
import { Stack, Button } from 'react-bootstrap';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Error from '../../../../components/Modals/Error/Error';

//Estilos
import '../../../../components/Estilos/estilosCard.css';


//Utilities
import moment from 'moment/moment';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

//Assets
import iconoDropdown from '../../../../assets/iconoDropdown.png';
import iconoFertilizante from '../../../../assets/iconoFertilizante.png';

//Hooks
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

//Services
import { getCultivoService } from '../../../../services/diagnosticos.service';
import { renewToken } from '../../../../services/token.service';
import { eliminarDiagnosticoService } from '../../services/diagnostico.service';

//Context
import { IdDiagnosticoContext } from '../../../../context/IdDiagnosticoContext';
import { ModoPDFContext } from '../../../../context/ModoPDFContext';


function DiagnosticoCard({ diagnostico, idTomaMuestra, onEliminar }){

    const [ cultivoNombre, setCultivoNombre ] = useState();

    const [ , setIdDiagnostico ] = useContext(IdDiagnosticoContext);
    const [ , setModoPDF ] = useContext(ModoPDFContext);

    const [ mostrarDarDeBajaDiagnostico, setMostrarDarDeBajaDiagnostico ] = useState(false);
    const [ mostrarConfirmacionBaja, setMostrarConfirmacionBaja ] = useState(false);
    const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

    const mostrarErrorUsuarioNoEncontrado = () => {
        toast.error('Usuario no encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorDiagnosticoNoEncontrado = () => {
        toast.error('Diagnóstico no encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorAnalisisNoEncontrado = () => {
        toast.error('Análisis no encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorTMNoEncontrada = () => {
        toast.error('Toma de muestra no encontrada', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorEstadoNoEncontrado = () => {
        toast.error('Estado no encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorNoDiagnosticada = () => {
        toast.error('La toma de muestra no está diagnosticada', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorLoteNoEncontrado = () => {
        toast.error('Lote no encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorCampoNoEncontrado = () => {
        toast.error('Campo no encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorProductorNoEncontrado = () => {
        toast.error('Productor no encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorNoTienePermisos = () => {
        toast.error('No tiene permisos para borrar el diagnóstico', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorTratamientosAsociados = () => {
        toast.error('No puede eliminar un diagnóstico con tratamientos asociados.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    let navigate = useNavigate();

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    useEffect(() => {
        if (diagnostico) {
          const fetchCultivoNombre = async () => {
            const { data } = await getCultivoService(diagnostico.cultivo_id);
            setCultivoNombre(data);
          };
    
          fetchCultivoNombre();
        }
      }, []);

    const handleConsultarDiagnostico = () => {
        setModoPDF('consulta diagnostico');
        setIdDiagnostico(diagnostico.id);
        Cookies.set("Cultivo", diagnostico.cultivo_id);
        navigate(`/verPDF/${idTomaMuestra}`);
    }

    const handleAlertaEliminarDiagnostico = () => {
        setMostrarDarDeBajaDiagnostico(!mostrarDarDeBajaDiagnostico);
    }

    const handleConfirmarDarDeBaja = async (confirm) => {
        if (confirm) {
          try {
            await eliminarDiagnosticoService(diagnostico.id);
            setMostrarConfirmacionBaja(true);
          } catch (error) {
            if(error.response && error.response.status === 401){
                try {
                    await renewToken();
                    await eliminarDiagnosticoService(diagnostico.id);
                    setMostrarConfirmacionBaja(true);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  } else if (error.response.status === 404) {
                    mostrarErrorUsuarioNoEncontrado();
                  } else if (error.response.status === 413) {
                    mostrarErrorDiagnosticoNoEncontrado();
                  } else if (error.response.status === 412) {
                    mostrarErrorAnalisisNoEncontrado();
                  } else if (error.response.status === 405) {
                    mostrarErrorTMNoEncontrada();
                  } else if (error.response.status === 411) {
                    mostrarErrorEstadoNoEncontrado();
                  } else if (error.response.status === 410) {
                    mostrarErrorNoDiagnosticada();
                  } else if (error.response.status === 406) {
                    mostrarErrorLoteNoEncontrado();
                  } else if (error.response.status === 407) {
                    mostrarErrorCampoNoEncontrado();
                  } else if (error.response.status === 408) {
                    mostrarErrorProductorNoEncontrado();
                  } else if (error.response.status === 409) {
                    mostrarErrorNoTienePermisos();
                  } else if (error.response.status === 414) {
                    mostrarErrorTratamientosAsociados();
                  }
                }
            } else if (error.response.status === 404) {
                mostrarErrorUsuarioNoEncontrado();
            } else if (error.response.status === 413) {
                mostrarErrorDiagnosticoNoEncontrado();
            } else if (error.response.status === 412) {
                mostrarErrorAnalisisNoEncontrado();
            } else if (error.response.status === 405) {
                mostrarErrorTMNoEncontrada();
            } else if (error.response.status === 411) {
                mostrarErrorEstadoNoEncontrado();
            } else if (error.response.status === 410) {
                mostrarErrorNoDiagnosticada();
            } else if (error.response.status === 406) {
                mostrarErrorLoteNoEncontrado();
            } else if (error.response.status === 407) {
                mostrarErrorCampoNoEncontrado();
            } else if (error.response.status === 408) {
                mostrarErrorProductorNoEncontrado();
            } else if (error.response.status === 409) {
                mostrarErrorNoTienePermisos();
            } else if (error.response.status === 414) {
                mostrarErrorTratamientosAsociados();
            }
          }
        } else {
            setMostrarDarDeBajaDiagnostico(!mostrarDarDeBajaDiagnostico);
        }
    };

    const handleBajaDiagnostico = () => {
        setMostrarConfirmacionBaja(!mostrarConfirmacionBaja);
        onEliminar();
      };

    if(cultivoNombre){
        return(
            <>
                <Stack direction="horizontal" gap={0} className="card">
                    <div className='p-2'>
                        <strong className='nombre-card'>{moment(diagnostico.fecha_alta).format("DD/MM/YYYY")} - {cultivoNombre} - {diagnostico.rendimiento_esperado} Ton/ha</strong>
                    </div>
                    <div className='p-2 ms-auto'>
                        <Button
                            className='boton-card'
                            variant='secondary'
                        >
                            <img className="icono-card" src={iconoFertilizante} alt="" onClick={handleConsultarDiagnostico}/>
                        </Button>
                        <Dropdown className="boton-card">
                                <Dropdown.Toggle variant="transparent" id="dropdown-menu" className='custom-toggle'>
                                    <img className="icono-dropdown" src={iconoDropdown} alt="" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="custom-dropdown-menu">
                                    <Dropdown.Item className="custom-eliminar-item" onClick={handleAlertaEliminarDiagnostico}>
                                        Eliminar
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                    </div>
                </Stack>

                {mostrarDarDeBajaDiagnostico && (
                <Alerta
                texto="¿Desea eliminar el Diagnóstico?"
                nombreBoton="Eliminar"
                onConfirm={handleConfirmarDarDeBaja}
                />
                )}
                {mostrarConfirmacionBaja && (
                <Confirm
                texto="El diagnóstico ha sido eliminado correctamente."
                onConfirm={handleBajaDiagnostico}
                />
                )}

                {mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado."} 
                    onConfirm={handleSesionExpirada}/>
                } 
            </>
        )
    }


}

export default DiagnosticoCard;