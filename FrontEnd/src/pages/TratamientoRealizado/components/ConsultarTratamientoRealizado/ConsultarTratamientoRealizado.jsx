import '../../components/estilosTratamientoRealizado.css';

import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import FertilizanteCard from '../FertilizanteCard/FertilizanteCard';
import { Form } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import '../../../../components/Estilos/estilosFormulario.css';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import SpinnerAgrolitycs from '../../../../components/Spinner/SpinnerAgrolitycs';

// import hooks
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// import services
import { datosRotuloService } from '../../../../services/toma_muestra.service';
import { eliminarTratamientoService } from '../../../../services/eliminarTratamiento.service';
import { renewToken } from '../../../../services/token.service';

// import utilities
import Cookies from 'js-cookie';
import Alerta from '../../../../components/Modals/Alerta/Alerta';


function ConsultarTratamientoRealizado({ idTomaMuestra, tratamiento, onEditar }){

    let navigate = useNavigate();

    // estado para guardar el nombre lote y el id campo
    const [ nombreLote, setNombreLote ] = useState();
    const [ idCampo, setIdCampo ] = useState();

    // estados para errores
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ errorUsuarioNoValido, setErrorUsuarioNoValido ] = useState(false);
    const [ errorTratamientoNoEncontrado, setErrorTratamientoNoEncontrado ] = useState(false);
    const [ errorEliminacion, setErrorEliminacion ] = useState(false);

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    // alerta para solicitar confirmación de eliminación
    const [ solicitarConfirmacionEliminacion, setSolicitarConfirmacionEliminacion ] = useState(false);

    // estado para avisar que se eliminó correctamente el tratamiento
    const [ alertaTratamientoEliminado, setAlertaTratamientoEliminado ] = useState(false);


    useEffect(() => {
        if (idTomaMuestra) {
            const fetchNombreLote = async () => {
                try {
                    const { data } = await datosRotuloService(idTomaMuestra);
                    setNombreLote(data.Lote_nombre);
                    setIdCampo(data.Campo_id);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            await renewToken();
                            const { data } = await datosRotuloService(idTomaMuestra);
                            setNombreLote(data.Lote_nombre);
                            setIdCampo(data.Campo_id);
                        } catch (error) {
                            if(error.response && error.response.status === 401){
                                setMostrarErrorVencimientoToken(true);
                            }
                        }
                    }
                }
            }
            fetchNombreLote();
        }
    }, [idTomaMuestra])

    const handleHabilitarEdicion = () => {
        onEditar();
    }

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
                            setErrorUsuarioNoValido(true);
                        }
                        else if (status === 404) {
                            setErrorTratamientoNoEncontrado(true);
                        }
                        else {
                            setErrorEliminacion(true);
                        }
                    }
                }
                else if (status === 402) {
                    setErrorUsuarioNoValido(true);
                }
                else if (status === 404) {
                    setErrorTratamientoNoEncontrado(true);
                }
                else {
                    setErrorEliminacion(true);
                }
            }
        } else {
            setSolicitarConfirmacionEliminacion(false);
        }
    }

    const finalizarEliminacion = (confirm) => {
        if (confirm) {
            setAlertaTratamientoEliminado(false);
            navigate(`/detalleCampo/${idCampo}`);
        }
    }

    if (window.localStorage.getItem('loggedAgroUser') && Cookies.get()) {
        if (tratamiento && nombreLote) {   
            return(
                <>
                <NavbarBootstrap></NavbarBootstrap>
    
                    {/* Consultar tratamiento realizado */}
                    <Form className='contenedorTratamiento'>
                        <div className='contenedorTituloTratamiento'>
                            <h1>Tratamiento {nombreLote}</h1>
                        </div>
                        <div>
                            <span>Indique la cantidad de cada fertilizante que se aplicó al lote.</span>
                        </div>
    
                        {/* Listado de fertlizantes */}
                        {
                            tratamiento.fertilizantes_aplicados.map((fertilizante, indice) => (
                                <FertilizanteCard 
                                    key={indice} 
                                    fertilizante={fertilizante.nombre_fertilizante} 
                                    kgHa={fertilizante.kgPorHa}
                                    modo={'Consultar'} 
                                />
                            ))
                        }
   
    
                        {/* Input Observaciones */}
                        <Form.Group>
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control as="textarea" className='inputObservaciones' disabled={true} value={tratamiento.observaciones}></Form.Control>
                        </Form.Group>
    
                        {/* Botones */}
                            <Stack direction='horizontal' gap={0} className='seccionBotonesConsultarTratamiento'>
                                <div className='p-2'>
                                    <Button className="estiloBotonesTratamiento botonCancelarTratamiento" variant="secondary" onClick={() => {navigate(-1)}}>
                                    Volver
                                    </Button>
                                </div>
                                <div className='p-2'>
                                    <Button className="estiloBotonesTratamiento botonConfirmarTratamiento" variant="secondary" onClick={handleHabilitarEdicion}
                                        type="submit">
                                        Editar
                                    </Button>
                                </div>
                                <div className='p-2 ms-auto'>
                                    <Button className="estiloBotonesTratamiento botonCancelarTratamiento" variant="secondary" onClick={() => {setSolicitarConfirmacionEliminacion(true)}}>
                                        Eliminar
                                    </Button>
                                </div>
                            </Stack>
                    </Form>

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
                    {
                        errorUsuarioNoValido &&
                        <Error texto={"El usuario para realizar esta operación no es válido."} 
                        onConfirm={() => {setErrorUsuarioNoValido(false)}}/>
                    }
                    {
                        errorTratamientoNoEncontrado &&
                        <Error texto={"El tratamiento para eliminar no fue encontrado."} 
                        onConfirm={() => {setErrorTratamientoNoEncontrado(false)}}/>
                    }
                    {
                        errorEliminacion &&
                        <Error texto={"Ocurrió un error inesperado durante la eliminación."} 
                        onConfirm={() => {setErrorEliminacion(false)}}/>
                    }
                    {
                        alertaTratamientoEliminado &&
                        <Confirm texto={"El tratamiento ha sido eliminado correctamente."} onConfirm={finalizarEliminacion}/>
                    }
                </>
            );
        } else {
            return(
                <>
                    <SpinnerAgrolitycs/>
                    {
                        mostrarErrorVencimientoToken &&
                        <Error texto={"Su sesión ha expirado"} 
                        onConfirm={handleSesionExpirada}/>
                    }
                </>
                
            )
        }
    } else {
        return(<NoLogueado />)
    }
    
}

export default ConsultarTratamientoRealizado;