// import hooks
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// import components
import ConsultarTratamientoRealizado from '../ConsultarTratamientoRealizado/ConsultarTratamientoRealizado';
import TratamientoRealizadoAM from '../TratamientoRealizadoAM/TratamientoRealizadoAM';
import TratamientoRealizadoMod from '../TratamientoRealizadoMod/TratamientoRealizoMod';
import Error from '../../../../components/Modals/Error/Error';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';

// import services
import { consultarTratamientoService } from '../../services/consultarTratamiento.service';
import { renewToken } from '../../../../services/token.service';

// import utilities
import Cookies from 'js-cookie';


function TratamientoRealizado() {

    let navigate = useNavigate();

    const { idTomaMuestra } = useParams();

    const [ tratamiento, setTratamiento ] = useState();

    const [ modoComponente, setModoComponente ] = useState('Consulta');

    // estados para errores
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ errorUsuarioNoValido, setErrorUsuarioNoValido ] = useState(false);
    const [ errorAnalisisNoEncontrado, setErrorAnalisisNoEncontrado ] = useState(false);
    const [ errorTMNoEncontrada, setErrorTMNoEncontrada ] = useState(false);
    const [ errorLoteNoEncontrado, setErrorLoteNoEncontrado ] = useState(false);
    const [ errorCampoNoEncontrado, setErrorCampoNoEncontrado ] = useState(false);
    const [ errorNoTienePermisos, setErrorNoTienePermisos ] = useState(false);
    const [ errorInesperadoConsulta, setErrorInesperadoConsulta ] = useState(false);
    const [ errorDiagnosticoNoEncontrado, setErrorDiagnosticoNoEncontrado ] = useState(false);

    // estado para volver a realizar la consulta del tratamiento, una vez se haya modificado
    const [ modificacionTratamiento, setModificacionTratamiento ] = useState(false);

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    useEffect(() => {
        const fetchTratamiento = async () => {
            try {
                const { data } = await consultarTratamientoService(idTomaMuestra);
                setTratamiento(data);
            } catch (error) {
                let status = error.response.status;
                if (status === 401) {
                    try {
                        await renewToken();
                        const { data } = await consultarTratamientoService(idTomaMuestra);
                        setTratamiento(data);
                    } catch (error) {
                        status = error.response.status;
                        if (status === 402) {
                            setErrorUsuarioNoValido(true);
                        }
                        else if (status === 403 ) {
                            setModoComponente('Registro');
                        }
                        else if (status === 404) {
                            setErrorDiagnosticoNoEncontrado(true);
                        }
                        else if (status === 405) {
                            setErrorAnalisisNoEncontrado(true);
                        }
                        else if (status === 406) {
                            setErrorTMNoEncontrada(true);
                        }
                        else if (status === 407) {
                            setErrorLoteNoEncontrado(true);
                        }
                        else if (status === 408) {
                            setErrorCampoNoEncontrado(true);
                        }
                        else if (status === 409) {
                            setErrorNoTienePermisos(true);
                        }
                        else {
                            setErrorInesperadoConsulta(true);
                        }
                    }
                }
                else if (status === 402) {
                    setErrorUsuarioNoValido(true);
                }
                else if (status === 403) {
                    setModoComponente('Registro');
                }
                else if (status === 404) {
                    setErrorDiagnosticoNoEncontrado(true);
                }
                else if (status === 405) {
                    setErrorAnalisisNoEncontrado(true);
                }
                else if (status === 406) {
                    setErrorTMNoEncontrada(true);
                }
                else if (status === 407) {
                    setErrorLoteNoEncontrado(true);
                }
                else if (status === 408) {
                    setErrorCampoNoEncontrado(true);
                }
                else if (status === 409) {
                    setErrorNoTienePermisos(true);
                }
                else {
                    setErrorInesperadoConsulta(true);
                }
            }
        }
        fetchTratamiento();
    }, [idTomaMuestra, modificacionTratamiento])

    const modificarTratamiento = () => {
        setModificacionTratamiento(!modificacionTratamiento);
        setTimeout(() => {setModoComponente('Consulta');}, 2000);
    }

    const handleErrorNoExisteDiagnostico = () => {
        setErrorDiagnosticoNoEncontrado(false);
        navigate('/home');
    }


    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        if ( modoComponente === 'Consulta' ) {
            return (
            <>
                <ConsultarTratamientoRealizado  idTomaMuestra={idTomaMuestra} tratamiento={tratamiento} onEditar={() => {setModoComponente('Modificacion')}}/>
                    {
                        mostrarErrorVencimientoToken &&
                        <Error texto={"Su sesión ha expirado"} 
                        onConfirm={handleSesionExpirada}/>
                    }
                    {
                        errorUsuarioNoValido &&
                        <Error texto={"El usuario no es válido."} 
                        onConfirm={() => setErrorUsuarioNoValido(false)}/>
                    }
                    {
                        errorAnalisisNoEncontrado &&
                        <Error texto={"El análisis no fue encontrado."} 
                        onConfirm={() => setErrorAnalisisNoEncontrado(false)}/>
                    }
                    {
                        errorTMNoEncontrada &&
                        <Error texto={"La toma de muestra no fue encontrada."} 
                        onConfirm={() => setErrorTMNoEncontrada(false)}/>
                    }
                    {
                        errorLoteNoEncontrado &&
                        <Error texto={"El lote no fue encontrado."} 
                        onConfirm={() => setErrorLoteNoEncontrado(false)}/>
                    }
                    {
                        errorCampoNoEncontrado &&
                        <Error texto={"El campo no fue encontrado."} 
                        onConfirm={() => setErrorCampoNoEncontrado(false)}/>
                    }
                    {
                        errorNoTienePermisos &&
                        <Error texto={"No tiene permisos para ejecutar esta operación."} 
                        onConfirm={() => setErrorNoTienePermisos(false)}/>
                    }
                    {
                        errorDiagnosticoNoEncontrado &&
                        <Error texto={"No existen diagnósticos asociados para realizar un tratamiento."} 
                        onConfirm={handleErrorNoExisteDiagnostico}/>
                    }
                    {
                        errorInesperadoConsulta &&
                        <Error texto={"Ocurrió un error inesperado al consultar el tratamiento."} 
                        onConfirm={() => setErrorInesperadoConsulta(false)}/>
                    }
                </>
            )
        } 
        else if ( modoComponente === 'Registro' ) {
            return(
                <>
                    <TratamientoRealizadoAM idTomaMuestra={idTomaMuestra} />
                </>
            )
        }
        else if ( modoComponente === 'Modificacion' ) {
            return(
                <>
                    <TratamientoRealizadoMod idTomaMuestra={idTomaMuestra} tratamiento={tratamiento} onCancelar={() => {setModoComponente('Consulta')}} onModificar={modificarTratamiento}/>
                </>
            )
        }
    } else {
        return(
            <NoLogueado />
        )
    }
    

  
  
}

export default TratamientoRealizado