// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

// importar hooks
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// importar utilities
import { toast } from 'react-toastify';

function RegistrarUsuarioUno({ usuario, actualizarUsuario, avanzarEtapa }){

    //variables form
    const [ nombre, setNombre ] = useState(usuario.nombre);
    const [ apellido, setApellido ] = useState(usuario.apellido);
    const [ tipoPerfil, setTipoPerfil ] = useState(usuario.tipoPerfil);

    //variables validación
    const [ nombreVacio, setNombreVacio ] = useState(false);
    const [ apellidoVacio, setApellidoVacio ] = useState(false);
    const [ tipoPerfilVacio, setTipoPerfilVacio ] = useState(false);

    // funcion toast para alerta nombre vacío
    const mostrarErrorNombre = () => {
        toast.error('Se debe ingresar un nombre', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta apellido vacío
    const mostrarErrorApellido = () => {
        toast.error('Se debe ingresar un apellido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta rol no seleccionado
    const mostrarErrorRol = () => {
        toast.error('Se debe ingresar un rol', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();

    const guardarEtapa = () => {
        const validacion = validarForm();
        if (validacion) {
            actualizarUsuario({ nombre, apellido, tipoPerfil });
            reset();
            avanzarEtapa();
        }    
    }

    const volver = () => {
        reset();
        navigate("/");
    }

    const validarForm = () => {
        if (nombre === "") {
            setNombreVacio(true);
            mostrarErrorNombre();
            return false;
        } else {
            setNombreVacio(false);
        }
        
        if (apellido === "") {
            setApellidoVacio(true);
            mostrarErrorApellido();
            return false;
        } else {
            setApellidoVacio(false);
        }

        if (tipoPerfil === "") {
            setTipoPerfilVacio(true);
            mostrarErrorRol();
            return false;
        } else {
            setTipoPerfilVacio(false);
        }

        return true;
    }

    const handleChangeNombre = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúüÜñÑçÇ\s]+$/.test(value) || value === "") {
          setNombre(value);
        }
      }
    
    const handleChangeApellido = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúüÜñÑçÇ\s]+$/.test(value) || value === "") {
            setApellido(value);
        }
    }

    const seleccionarRol = (e) => {
        setTipoPerfil(e.target.value);
    };


    return(
        <>
           <Form className='formularioOscuro formCentrado' onSubmit={handleSubmit(guardarEtapa)}>
                <div className='seccionTitulo'>
                    <span className='tituloForm'>Te damos la Bienvenida!</span>
                </div>
                <div>
                    <span>Necesitaremos algunos datos para registrarte.</span>
                </div>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={nombreVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Nombres*</Form.Label>
                    <Form.Control className='inputFormularioOscuro' type='text' value={nombre} onChange={handleChangeNombre} maxLength={30}/>

                </Form.Group>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={apellidoVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Apellidos*</Form.Label>
                    <Form.Control className='inputFormularioOscuro' type='text' value={apellido} onChange={handleChangeApellido} maxLength={30}/>
                </Form.Group>

                <Form.Group className='seccionFormulario'>
                    <Form.Check 
                        className={tipoPerfilVacio ? 'labelErrorFormulario' : 'radioForm'}
                        inline
                        label="Soy estudiante"
                        name="group1"
                        type="radio"
                        value="estudiante"                            
                        checked={tipoPerfil === "estudiante"}
                        onChange={seleccionarRol}
                    />
                    <Form.Check 
                        className={tipoPerfilVacio ? 'labelErrorFormulario' : 'radioForm'}
                        inline
                        label="Soy ingeniero"
                        name="group1"
                        type="radio"
                        value="ingeniero"                            
                        checked={tipoPerfil === "ingeniero"}
                        onChange={seleccionarRol}                           
                    />
                </Form.Group>

                <Form.Group className='seccionFormulario seccionBotonesFormulario'>
                    <Button 
                        variant="outline-primary" 
                        className='botonCancelarFormulario'
                        onClick={volver}
                    >
                        Volver
                    </Button>

                    <Button variant="primary" type='submit' className='botonConfirmacionFormulario'>
                        Siguiente
                    </Button>
                </Form.Group>
           </Form> 
        </>
    );
}

export default RegistrarUsuarioUno;