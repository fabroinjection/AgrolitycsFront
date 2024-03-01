// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';

// importar componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

// importar hooks
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// importar services
import { validarUsuarioExistenteService } from '../../../../services/usuarios.service';
import { enviarMailRestablecimientoService } from '../../services/solicitudRestablecer.service';

// importar utilities
import { validarEmail } from '../../../../utilities/validarEmail';
import { toast } from 'react-toastify';
import MensajeEmail from '../../../RestablecerContraseña/components/MensajeEmail/MensajeEmail';

function SolicitudRestablecerPassword(){

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();

    const [ email, setEmail ] = useState("");

    //variables validacion
    const [ emailExistente, setEmailExistente ] = useState(false);
    const [ emailVacio, setEmailVacio ] = useState(false);
    const [ emailFormatoNoValido, setEmailFormatoNoValido ] = useState(false);

    //estado renderizacion mail enviado
    const [ mailEnviado, setMailEnviado ] = useState(false);
    
    // funcion toast para error en el mail
    const mostrarErrorOcurrido = () => {
        toast.error('Ocurrió un error al intentar restablecer su contraseña, intente nuevamente más tarde.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para error mail vacio
    const mostrarErrorMailVacio = () => {
        toast.error('Debe ingresar un mail.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para error formato mail
    const mostrarErrorMailNoValido = () => {
        toast.error('Debe ingresar un mail en formato válido.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para error mail no existente
    const mostrarErrorMailNoExistente = () => {
        toast.error('El mail ingresado no se encuentra registrado en la plataforma.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const handleChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    }

    const validarEmailNoExistente = async () => {
        if (email === "") {
            return false;
        } else {
            try {
                await validarUsuarioExistenteService(email);
                setEmailExistente(true);
                mostrarErrorMailNoExistente();
                return false;
            } catch (error) {
                setEmailExistente(false);
                return true;
            }
        }
    }

    const validarIngresoEmail = () => {
        if (email === "") {
            setEmailVacio(true);
            mostrarErrorMailVacio();
            return false;
        } else {
            setEmailVacio(false);
        }

        if (validarEmail(email)) {
            setEmailFormatoNoValido(false);
        } else {
            setEmailFormatoNoValido(true);
            mostrarErrorMailNoValido();
            return false;
        }

        return true;
        
    }

    const enviarMailReestablecimiento = async () => {
        const validarEmailIngresado = validarIngresoEmail();
        const validarNoExistente = await validarEmailNoExistente();
        if (validarEmailIngresado && validarNoExistente) {
            try {
                await enviarMailRestablecimientoService(email);
                setMailEnviado(true);
            } catch (error) {
                if (error.response) {
                    mostrarErrorOcurrido();
                }
            }
            
        }
    }

    const cancelar = () => {
        reset();
        navigate("/");
    }

    if (!mailEnviado) {
        return(
            <>
            <div className='fondoImagen'>
            <Form className='formularioOscuro formCentrado' onSubmit={handleSubmit(enviarMailReestablecimiento)}>
                    <div className='seccionTitulo'>
                        <span className='tituloForm'>Recuperá tu cuenta</span>
                    </div>
    
                    <Form.Group className='seccionFormulario'>
                        <Form.Label className={(emailVacio || emailExistente || emailFormatoNoValido) ? 'labelErrorFormulario' : 'labelFormulario'}>Ingresá tu correo electrónico</Form.Label>
                        <Form.Control className='inputFormularioOscuro' type='email' value={email} onChange={handleChangeEmail}/>
    
                    </Form.Group>
    
                    <Form.Group className='seccionFormulario seccionBotonesFormulario'>
                        <Button variant="outline-primary" className='botonCancelarFormulario' onClick={cancelar}>Cancelar</Button>
                        <Button variant="primary" className='botonConfirmacionFormulario' type='submit'>Enviar mail</Button>
                    </Form.Group>
               </Form> 
            </div>
            </>
        );
    }
    else{
        return(<MensajeEmail email={email}/>)
    }
    
}

export default SolicitudRestablecerPassword;
