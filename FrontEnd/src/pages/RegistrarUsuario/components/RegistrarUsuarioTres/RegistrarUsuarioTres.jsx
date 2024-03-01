// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';

// importar componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

// importar hooks
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// importar utilities
import { validarEmail } from '../../../../utilities/validarEmail';
import { toast } from 'react-toastify';

// importar services
import { validarUsuarioExistenteService } from '../../../../services/usuarios.service';

function RegistrarUsuarioTres({ usuario, actualizarUsuario, avanzarEtapa, volverEtapa }){

    //variables form
    const [ email, setEmail ] = useState(usuario.email);
    const [ emailRepetido, setEmailRepetido ] = useState(usuario.email);

    //variables validacion
    const [ emailVacio, setEmailVacio ] = useState(false);
    const [ emailRepetidoVacio, setEmailRepetidoVacio ] = useState(false);
    const [ emailFormatoNoValido, setEmailFormatoNoValido ] = useState(false);
    const [ emailRepetidoFormatoNoValido, setEmailRepetidoFormatoNoValido ] = useState(false);
    const [ emailsDistintos, setEmailDistintos ] = useState(false);
    const [ emailExistente, setEmailExistente ] = useState(false);

    // funcion toast para alerta email vacío
    const mostrarErrorEmailVacio = () => {
        toast.error('Se debe ingresar un email', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta repetición email vacío
    const mostrarErrorEmailRepetidoVacio = () => {
        toast.error('Se debe repetir el email', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta email formato no válido
    const mostrarErrorEmailNoValido = () => {
        toast.error('Se debe ingresar un email en formato válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta email distinto del repetido
    const mostrarErrorEmailDistintos = () => {
        toast.error('Los mails ingresados no coinciden', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta email existente para otro usuario
    const mostrarErrorEmailExistente = () => {
        toast.error('El email ingresado ya se encuentra registrado en la plataforma', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }



    const { handleSubmit, reset } = useForm();

    const guardarEtapa = async () => {
        const validacion = validarForm();
        const validacionEmailExistente = await validarEmailNoExistente();
        if (validacion && validacionEmailExistente) {
            actualizarUsuario({ email })
            reset();
            avanzarEtapa();    
        }
        
    }

    const volver = () => {
        volverEtapa();
    }

    const handleChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    }

    const handleChangeEmailRepetido = (e) => {
        const { value } = e.target;
        setEmailRepetido(value);
    }

    const validarEmailNoExistente = async () => {
        try {
            await validarUsuarioExistenteService(email);
            setEmailExistente(false);
            return true;
        } catch (error) {
            setEmailExistente(true);
            mostrarErrorEmailExistente();
            return false;
        }
    }

    const validarForm = () => {
        if (email === "") {
            setEmailVacio(true);
            mostrarErrorEmailVacio();
            return false;
        } else {
            setEmailVacio(false);
        }

        if (emailRepetido === "") {
            setEmailRepetidoVacio(true);
            mostrarErrorEmailRepetidoVacio();
            return false;
        } else {
            setEmailRepetidoVacio(false);
        }

        if (validarEmail(email)) {
            setEmailFormatoNoValido(false);
        } else {
            setEmailFormatoNoValido(true);
            mostrarErrorEmailNoValido();
            return false;
        }

        if (validarEmail(emailRepetido)) {
            setEmailRepetidoFormatoNoValido(false);
        } else {
            setEmailRepetidoFormatoNoValido(true);
            mostrarErrorEmailNoValido();
            return false;
        }

        if (email === emailRepetido) {
            setEmailDistintos(false);
        } else {
            setEmailDistintos(true);
            mostrarErrorEmailDistintos();
            return false;
        }

        return true;
    }

    return(
        <>
           <Form className='formularioOscuro formCentrado' onSubmit={handleSubmit(guardarEtapa)}>
                <div className='seccionTitulo'>
                    <span className='tituloForm'>Necesitamos tu correo!</span>
                </div>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={(emailVacio || emailFormatoNoValido || emailsDistintos || emailExistente) ? 'labelErrorFormulario' : 'labelFormulario'}>Correo electrónico*</Form.Label>
                    <Form.Control className='inputFormularioOscuro' type='email' value={email} onChange={handleChangeEmail}/>

                </Form.Group>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={(emailRepetidoVacio || emailRepetidoFormatoNoValido || emailsDistintos || emailExistente) ? 'labelErrorFormulario' : 'labelFormulario'}>Repite el correo electrónico*</Form.Label>
                    <Form.Control className='inputFormularioOscuro' type='email' value={emailRepetido} onChange={handleChangeEmailRepetido}/>
                </Form.Group>

                <Form.Group className='seccionFormulario seccionBotonesFormulario'>
                    <Button 
                        variant="outline-primary" 
                        className='botonCancelarFormulario'
                        onClick={volver}
                    >
                        Volver
                    </Button>
                    <Button 
                        variant="primary" 
                        className='botonConfirmacionFormulario'
                        type='submit'
                    >
                        Siguiente
                    </Button>
                </Form.Group>
           </Form> 
        </>
    );
}

export default RegistrarUsuarioTres;