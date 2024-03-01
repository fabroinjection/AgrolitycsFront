// importar estilos
import '../../../components/Estilos/estilosFormulario.css';
import './VerificacionEmail.css';

// importar componentes
import { Button } from 'react-bootstrap';
import Error from '../../../components/Modals/Error/Error';
import SpinnerAgrolitycs from '../../../components/Spinner/SpinnerAgrolitycs';

// importar hooks
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// importar servicios
import { verificarEmailService } from '../services/verificarEmail.service';


function VerificacionEmail() {

    let navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    //variable para manejar el tiempo de espera a que el Back verifique
    const [ verificado, setVerificado ] = useState(false);

    //variable para mostrar error en la verificación
    const [ mostrarErrorVerificacion, setMostrarErrorVerificacion ] = useState(false);

    useEffect(() => {
        const fetchVerificarEmail = async () => {
            try {
                await verificarEmailService(token);
                setVerificado(true);
            } catch (error) {
                if (error.response) {
                    setMostrarErrorVerificacion(true);
                }
            }
        };
        if (token) {
            fetchVerificarEmail();
        }
    }, [token]);

    const navegarInicioSesion = () => {
        setVerificado(false);
        navigate("/");
    }

    if (verificado) {
        return(
            <>
                <div className="fondoImagen">
                    <div className="formularioOscuro formCentrado">
                        <div className='mensajeCentro'>
                            <span className='tituloMensaje'>Se ha verificado su cuenta y ya puede iniciar sesión.</span>
                        </div>
                        <div className='botonCentro'>
                            <Button variant='primary' className='botonConfirmacionFormulario' onClick={navegarInicioSesion}> Iniciar Sesión</Button>
                        </div>
                    </div>
                </div>

                {
                    mostrarErrorVerificacion &&
                    <Error texto={"Ha ocurrido un error verificando su email, intente nuevamente más tarde"} 
                    onConfirm={() => setMostrarErrorVerificacion(false)}/>
                }
            </>
        )
    } else {
        return(
            <SpinnerAgrolitycs/>
        )
    }
    
}

export default VerificacionEmail