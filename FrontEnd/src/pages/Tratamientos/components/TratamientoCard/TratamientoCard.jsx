// Estilos
import '../../../../components/Estilos/estilosCard.css';

// Iconos
import iconoTratamiento from '../../../../assets/iconoTratamiento.png';
import iconoBorrar from '../../../../assets/iconoBorrar.png';

// Componentes
import { Stack, Button } from 'react-bootstrap';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Error from '../../../../components/Modals/Error/Error';

// Utilities
import moment from 'moment';
import { toast } from 'react-toastify';

// Hooks
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Services
import { tomaDeMuestraTratamientoService } from '../../services/tratamientos.service';
import { eliminarTratamientoService } from '../../../../services/eliminarTratamiento.service';
import { renewToken } from '../../../../services/token.service';

function TratamientoCard({ tratamiento, onEliminar, postEliminar }) {

    let navigate = useNavigate();

    const [ tomaMuestra, setTomaMuestra ] = useState();

    // estados para errores
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    // alerta para solicitar confirmación de eliminación
    const [ solicitarConfirmacionEliminacion, setSolicitarConfirmacionEliminacion ] = useState(false);

    // estado para avisar que se eliminó correctamente el tratamiento
    const [ alertaTratamientoEliminado, setAlertaTratamientoEliminado ] = useState(false);

    // funcion toast para alerta usuario no valido
    const mostrarErrorUsuarioNoValido = () => {
        toast.error('El usuario para realizar esta operación no es válido.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta tratamiento no valido
    const mostrarErrorTratamientoNoValido = () => {
        toast.error('El tratamiento para eliminar no fue encontrado.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta error inesperado
    const mostrarErrorInesperado = () => {
        toast.error('Ocurrio un error inesperado.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta tratamiento no valido
    const mostrarErrorEliminacion = () => {
        toast.error('Ocurrió un error inesperado durante la eliminación.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const handleNavigateTratamiento = () => {
        navigate(`/tratamientoRealizado/${tomaMuestra.id}`);
    }

    useEffect(() => {
        if (tratamiento) {
            const fetchTM = async () => {
                try {
                    const { data } = await tomaDeMuestraTratamientoService(tratamiento.id);
                    setTomaMuestra(data);
                } catch (error) {
                    if (error.response.status === 401) {
                        try {
                            await renewToken();
                            const { data } = await tomaDeMuestraTratamientoService(tratamiento.id);
                            setTomaMuestra(data);
                        } catch (error) {
                            if (error.response.status === 401) {
                                setMostrarErrorVencimientoToken(true);
                            } else {
                                mostrarErrorInesperado();
                            }
                        }
                    } else {
                        mostrarErrorInesperado();
                    }
                }
            }
            fetchTM();
        }
    }, [tratamiento]);

    const eliminarTratamiento = async (confirm) => {
        if (confirm) {
            setSolicitarConfirmacionEliminacion(false);
            try {
                await eliminarTratamientoService(tratamiento.id);
                setAlertaTratamientoEliminado(true);
            } catch (error) {
                let status = error.response.status;
                if (status === 401) {
                    try {
                        await renewToken();
                        await eliminarTratamientoService(tratamiento.id);
                        setAlertaTratamientoEliminado(true);
                    } catch (error) {
                        status = error.response.status;
                        if (status === 401) {
                            setMostrarErrorVencimientoToken(true);
                        } else if (status === 402) {
                            mostrarErrorUsuarioNoValido();
                        }
                        else if (status === 404) {
                            mostrarErrorTratamientoNoValido();
                        }
                        else {
                            mostrarErrorEliminacion();
                        }
                    }
                }
                else if (status === 402) {
                    mostrarErrorUsuarioNoValido();
                }
                else if (status === 404) {
                    mostrarErrorTratamientoNoValido();
                }
                else {
                    mostrarErrorEliminacion();
                }
            }
        } else {
            setSolicitarConfirmacionEliminacion(false);
        }
    }

    const finalizarEliminacion = (confirm) => {
        if (confirm) {
            setAlertaTratamientoEliminado(false);
            onEliminar();
            setTimeout(() => {
                postEliminar();
            }, 5000);
        }
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    return (
        <>
            <Stack direction='horizontal' gap={0} className='card'>
                <div className='p-2'>
                    <strong className='nombre-card'>Tratamiento - {moment(tratamiento.fecha_alta).format('DD/MM/YYYY')}</strong>
                </div>
                {tomaMuestra && 
                    <div className='p-2 ms-auto'>
                        <Button className='boton-card' onClick={handleNavigateTratamiento}>
                            <img className='icono-card' src={iconoTratamiento} alt="" />
                        </Button>
                        <Button className='boton-card' onClick={() => {setSolicitarConfirmacionEliminacion(true)}}>
                            <img className='icono-card' src={iconoBorrar} alt="" />
                        </Button>
                    </div>
                }
                
            </Stack>
            {
                alertaTratamientoEliminado &&
                <Confirm texto={"El tratamiento ha sido eliminado correctamente."} onConfirm={finalizarEliminacion}/>
            }

            {
                solicitarConfirmacionEliminacion &&
                <Alerta texto={"¿Desea eliminar el tratamiento?"}
                nombreBoton={"Eliminar"} onConfirm={eliminarTratamiento}/>
            }
            {
                mostrarErrorVencimientoToken &&
                <Error texto={"Su sesión ha expirado"} 
                onConfirm={handleSesionExpirada}/>
            }
        </>
    );
}

export default TratamientoCard;