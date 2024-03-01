// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';
import iconoVerificacionNegro from "../../../../assets/iconoVerificacionNegro.png";
import iconoVerificacionVerde from "../../../../assets/iconoVerificacionVerde.png";

// importar componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

// importar hooks
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

// importar utilities
import { toast } from 'react-toastify';

function RegistrarUsuarioCuatro({ usuario, actualizarUsuario, avanzarEtapa, volverEtapa }){

    //variables del form
    const [ contraseña, setContraseña ] = useState(usuario.contraseña);
    const [ contraseñaRepetida, setContraseñaRepetida ] = useState(usuario.contraseña);
    const [ terminosAceptados, setTerminosAceptados ] = useState(false);

    //variables de validacion
    const [ contraseñaVacio, setContraseñaVacio ] = useState(false);
    const [ contraseñaRepetidaVacio, setContraseñaRepetidaVacio ] = useState(false);
    const [ contraseñasDistintas, setContraseñasDistintas ] = useState(false);
    const [ ochoCaracteres, setOchoCaracteres ] = useState(false);
    const [ tieneMayuscula, setTieneMayuscula ] = useState(false);
    const [ tieneMinuscula, setTieneMinuscula ] = useState(false);
    const [ tieneNumero, setTieneNumero ] = useState(false);
    const [ tieneCarEspecial, setTieneCarEspecial ] = useState(false);
    const [ contraseñaInsegura, setContraseñaInsegura ] = useState(false);
    const [ terminosValidacion, setTerminosValidacion ] = useState(false);

    //regex para validaciones de contraseña segura
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    // funcion toast para alerta contraseña vacía
    const mostrarErrorContraseñaVacia = () => {
        toast.error('Se debe ingresar una contraseña', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseña repetida vacía
    const mostrarErrorContraseñaRepetidaVacia = () => {
        toast.error('Se debe repetir la contraseña', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseñas distintas
    const mostrarErrorContraseñasDistintas = () => {
        toast.error('Las contraseñas no son iguales', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseña insegura
    const mostrarErrorContraseñaInsegura = () => {
        toast.error('La contraseña ingresada no es segura, debe cumplir con las sugerencias que se indican debajo', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta terminos y condiciones no aceptados
    const mostrarErrorTerminosNoAceptados = () => {
        toast.error('Se deben aceptar los términos y condiciones', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    
    const { handleSubmit, reset } = useForm();

    const registrar = () => {
        const validacion = validarForm();
        if (validacion) {
            actualizarUsuario({ contraseña });
            avanzarEtapa();
        }
        
    }

    const volver = () => {
        reset();
        volverEtapa();
    }

    const handleChangeContraseña = (e) => {
        const { value } = e.target;
        setContraseña(value);
    }

    const handleChangeContraseñaRepetida = (e) => {
        const { value } = e.target;
        setContraseñaRepetida(value);
    }

    useEffect(() => {
        const esOchoCaracteres = contraseña.length >= 8;
        const siTieneMayuscula = uppercaseRegex.test(contraseña);
        const siTieneMinuscula = lowercaseRegex.test(contraseña);
        const siTieneNumero = numberRegex.test(contraseña);
        const siTieneCarEspecial = specialCharRegex.test(contraseña);

        setOchoCaracteres(esOchoCaracteres);
        setTieneMayuscula(siTieneMayuscula);
        setTieneMinuscula(siTieneMinuscula);
        setTieneNumero(siTieneNumero);
        setTieneCarEspecial(siTieneCarEspecial);

    }, [ contraseña ])

    const validarForm = () => {
        if (contraseña === "") {
            setContraseñaVacio(true);
            mostrarErrorContraseñaVacia();
            return false
        } else {
            setContraseñaVacio(false);
        }

        if (contraseñaRepetida === "") {
            setContraseñaRepetidaVacio(true);
            mostrarErrorContraseñaRepetidaVacia();
            return false;
        } else {
            setContraseñaRepetidaVacio(false);
        }

        if (contraseña !== contraseñaRepetida) {
            setContraseñasDistintas(true);
            mostrarErrorContraseñasDistintas();
            return false
        } else {
            setContraseñasDistintas(false);
        }

        if (!ochoCaracteres || !tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneCarEspecial) {
            setContraseñaInsegura(true);
            mostrarErrorContraseñaInsegura();
            return false
        } else {
            setContraseñaInsegura(false);
        }
        
        if (!terminosAceptados) {
            setTerminosValidacion(true);
            mostrarErrorTerminosNoAceptados();
            return false;
        } else {
            setTerminosValidacion(false);
        }

        return true;
    }

    const aceptarTerminos = (e) => {
        setTerminosAceptados(e.target.checked);
    };

    return(
        <>
           <Form className='formularioOscuro formCentrado' onSubmit={handleSubmit(registrar)}>
                <div className='seccionTitulo'>
                    <span className='tituloForm'>Y por último!</span>
                </div>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={(contraseñaVacio || contraseñasDistintas || contraseñaInsegura) ? 'labelErrorFormulario' : 'labelFormulario'}>Contraseña</Form.Label>
                    <Form.Control className='inputFormularioOscuro' type='password' value={contraseña} onChange={handleChangeContraseña}/>

                </Form.Group>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={(contraseñaRepetidaVacio || contraseñasDistintas ) ? 'labelErrorFormulario' : 'labelFormulario'}>Repite la contraseña</Form.Label>
                    <Form.Control className='inputFormularioOscuro' type='password' value={contraseñaRepetida} onChange={handleChangeContraseñaRepetida}/>
                </Form.Group>

                <div className='contenedorReqContraseña'>
                    <span>La contraseña debe contener como mínimo:</span>

                    <div>
                        <img src={ochoCaracteres ? iconoVerificacionVerde : iconoVerificacionNegro} alt="" className='iconoVerificacionContraseña'/>
                        <span className={ochoCaracteres ? 'verificado' : ''}>ocho caracteres.</span>
                    </div>
                    
                    <div>
                        <img src={tieneMayuscula ? iconoVerificacionVerde : iconoVerificacionNegro} alt="" className='iconoVerificacionContraseña'/>
                        <span className={tieneMayuscula ? 'verificado' : ''}>una mayúscula.</span>
                    </div>

                    <div>
                        <img src={tieneMinuscula ? iconoVerificacionVerde : iconoVerificacionNegro} alt="" className='iconoVerificacionContraseña'/>
                        <span className={tieneMinuscula ? 'verificado' : ''}>una minúscula.</span>
                    </div>

                    <div>
                        <img src={tieneNumero ? iconoVerificacionVerde : iconoVerificacionNegro} alt="" className='iconoVerificacionContraseña'/>
                        <span className={tieneNumero ? 'verificado' : ''}>un número.</span>
                    </div>

                    <div>
                        <img src={tieneCarEspecial ? iconoVerificacionVerde : iconoVerificacionNegro} alt="" className='iconoVerificacionContraseña'/>
                        <span className={tieneCarEspecial ? 'verificado' : ''}>un caracter especial.</span>
                    </div>                                  
                </div>

                <Form.Group className='seccionFormulario'>
                    <Form.Check 
                        className={terminosValidacion ? 'labelErrorFormulario' : 'checkboxForm'}
                        label={
                            <>
                              Acepto los{' '}
                              <a href="/terminosycondiciones" target="_blank" rel="noopener noreferrer" className={terminosValidacion ? 'labelErrorFormulario' : ''}>
                                Términos y Condiciones
                              </a>
                            </>
                          }
                        name="group1"
                        type="checkbox"
                        value={terminosAceptados}
                        onChange={aceptarTerminos}
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

                    <Button 
                        variant="primary" 
                        className='botonConfirmacionFormulario'
                        type='submit'
                    >
                        Crear cuenta
                    </Button>
                </Form.Group>
           </Form> 
        </>
    );
}

export default RegistrarUsuarioCuatro;