// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';
import './MensajeConfirmacionUsuario.css';

// importar componentes
import { Button } from 'react-bootstrap';

// importar hooks
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function MensajeConfirmacionUsuario({ email, registrarUsuario }){

    let navigate = useNavigate();

    useEffect(() => {
        registrarUsuario();
    }, [registrarUsuario])

    return(
        <>
        <div className='formularioOscuro formCentrado'>
            <div className='mensajeCentrado'>
            <span className='tituloMensajeUsuario'>Se ha enviado un correo a {email} para cofirmar su cuenta y poder iniciar sesión.</span>
            </div>
            <div className='botonCentrado'>
                <Button variant='primary' className='botonConfirmacionFormulario' onClick={() => navigate("/")}> Iniciar Sesión</Button>
            </div>
        </div>
        </>
    );
}

export default MensajeConfirmacionUsuario;
