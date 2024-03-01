//Estilos
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';

// import hooks
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import utilities
import { cuilValidator } from '../../../../utilities/validarCuil';
import { verifyCuit } from '../../../../utilities/validarCuit';
import { toast } from 'react-toastify';

// import services
import { registrarProductorService, modificarProductorService } from '../../services/productor.service';
import { renewToken } from '../../../../services/token.service';


function ProductorAMC({ accionCancelar, accionConfirmar, modo, productor = undefined,
                        accionActualizarLista = undefined }){

    const { handleSubmit, reset } = useForm();

    const [ modoComponente, setModoComponente ] = useState(modo);

    let navigate = useNavigate();

    // variables para los input del form en modo registro
    const [ nombres, setNombres ] = useState("");
    const [ apellidos, setApellidos ] = useState("");
    const [ cuil, setCuil ] = useState("");
    const [ telefono, setTelefono ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ referencias, setReferencias ] = useState("");

    // variables para los input del form en modo modificacion
    const [ nombresModif, setNombresModif ] = useState("");
    const [ apellidosModif, setApellidosModif ] = useState("");
    const [ cuilModif, setCuilModif ] = useState("");
    const [ telefonoModif, setTelefonoModif ] = useState("");
    const [ emailModif, setEmailModif ] = useState("");
    const [ referenciasModif, setReferenciasModif ] = useState("");

    //variables para manejar la visualización de errores en campos form y validar
    const [ nombreVacio, setNombreVacio ] = useState(false);
    const [ apellidosVacio, setApellidosVacio ] = useState(false);
    const [ cuilVacio, setCuilVacio ] = useState(false);
    const [ telefonoVacio, setTelefonoVacio ] = useState(false);
    const [ telefonoNoValido, setTelefonoNoValido ] = useState(false);
    const [ cuilNoValido, setCuilNoValido ] = useState(false);
    const [ emailNoValido, setEmailNoValido ] = useState(false);

    //variables para manejar el renderizado de alertas de error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarErrorCuilRepetido, setMostrarErrorCuilRepetido ] = useState(false);

    //variables para manejar el renderizado de avisos al usuario
    const [ mostrarAlertaProductorRegistrado, setMostrarAlertaProductorRegistrado ] = useState(false);
    const [ mostrarAlertaProductorModificado, setMostrarAlertaProductorModificado ] = useState(false);

    // funcion toast para alerta nombre vacío
    const mostrarErrorNombreVacio = () => {
        toast.error('Se debe ingresar un nombre', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta apellido vacío
    const mostrarErrorApellidoVacio = () => {
        toast.error('Se debe ingresar un apellido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta cuil vacío
    const mostrarErrorCuilVacio = () => {
        toast.error('Se debe ingresar un cuil', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta teléfono vacío
    const mostrarErrorTelefonoVacio = () => {
        toast.error('Se debe ingresar un teléfono', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta teléfono no válido
    const mostrarErrorTelefonoNoValido = () => {
        toast.error('Se debe ingresar un teléfono de 15 caracteres como máximo', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para cuil no válido
    const mostrarErrorCuiloNoValido = () => {
        toast.error('Se debe ingresar un cuil válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para email no válido
    const mostrarErrorEmailNoValido = () => {
        toast.error('Se debe ingresar un mail válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para cuil repetido
    const mostrarErrorCuilRepetidoToast = () => {
        toast.error('El CUIL ingresado ya se encuentra asociado a otro productor', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para error registro
    const mostrarErrorRegistroToast = () => {
        toast.error('Ha ocurrido un error registrando su productor, intente de nuevo más tarde', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para error modificación
    const mostrarErrorModificacionToast = () => {
        toast.error('Ha ocurrido un error modificando su productor, intente de nuevo más tarde', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }


    const handleChangeNombre = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑçÇ\s]+$/.test(value) || value === "") {
          setNombres(value);
        }
      }
      
      const handleChangeApellidos = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑçÇ\s]+$/.test(value) || value === "") {
          setApellidos(value);
        }
      }

    const handleChangeCuil = (e) => {
        let { value } = e.target;

        value = value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = `${value.substring(0, 2)}-${value.substring(2)}`;
        }

        if (value.length >= 11) {
            value = `${value.substring(0, 11)}-${value.substring(11)}`;
        }

        setCuil(value);

    }

    const handleChangeTelefono = (e) => {
        const { value } = e.target;
        
        // Expresión regular para validar un número de teléfono con signo "+" y otros caracteres
        const telefonoRegex = /^[\d\s+\-()]*$/;
        
        if (telefonoRegex.test(value) || value === "") {
            setTelefono(value);
        }
    }

    const handleChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    }

    const handleChangeReferencias = (e) => {
        const { value } = e.target;
        setReferencias(value);
    }

    useEffect(() => {
        if(modoComponente === "Modificar"){
            setNombresModif(productor.nombre);
            setApellidosModif(productor.apellido);
            setCuilModif(agregarGuiones(productor.cuit_cuil));
            setTelefonoModif(String(productor.numero_telefono));
            if(productor.email){
                setEmailModif(productor.email)
            }
            if(productor.referencia){
                setReferenciasModif(productor.referencia);
            }
        }
    }, [modoComponente])
    
    const handleChangeNombreModif = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑçÇ\s]+$/.test(value) || value === "") {
          setNombresModif(value);
        }
      }
      
      const handleChangeApellidosModif = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑçÇ\s]+$/.test(value) || value === "") {
          setApellidosModif(value);
        }
      }

    const handleChangeCuilModif = (e) => {
        let { value } = e.target;

        value = value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = `${value.substring(0, 2)}-${value.substring(2)}`;
        }

        if (value.length >= 11) {
            value = `${value.substring(0, 11)}-${value.substring(11)}`;
        }

        setCuilModif(value);
    }

    const handleChangeTelefonoModif = (e) => {
        const { value } = e.target;
        
        // Expresión regular para validar un número de teléfono con signo "+" y otros caracteres
        const telefonoRegex = /^[\d\s+\-()]*$/;
        
        if (telefonoRegex.test(value) || value === "") {
            setTelefonoModif(value);
        }
    }

    const handleChangeEmailModif = (e) => {
        const { value } = e.target;
        setEmailModif(value);
    }

    const handleChangeReferenciasModif = (e) => {
        const { value } = e.target;
        setReferenciasModif(value);
    }

    const validarEmail = (texto) => {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return regex.test(texto);
    }

    const handleCancelar = () => {
        reset();
        accionCancelar();
    }

    const handleCancelarEdicion = () => {
        setModoComponente("Consultar");
    }

    const quitarGuiones = (cuil) => {
        return cuil.replace(/-/g, '');
    }

    const agregarGuiones = (cuil) => {
        if (cuil.length < 11) {
            return cuil;
        }
    
        return `${cuil.substring(0, 2)}-${cuil.substring(2, 10)}-${cuil.substring(10)}`;
    }

    const validarForm = () => {
        if (nombres === "") {
            setNombreVacio(true);
            mostrarErrorNombreVacio();
            return false;
        } else {
            setNombreVacio(false);
        }

        if (apellidos === "") {
            setApellidosVacio(true);
            mostrarErrorApellidoVacio();
            return false
        } else {
            setApellidosVacio(false);
        }

        if (cuil === "") {
            setCuilVacio(true);
            mostrarErrorCuilVacio();
            return false;
        } else if(cuilValidator(quitarGuiones(cuil)) || verifyCuit(quitarGuiones(cuil))) {
            setCuilNoValido(false);
            setCuilVacio(false);
        } else{
            setCuilNoValido(true);
            setCuilVacio(false);
            mostrarErrorCuiloNoValido();
            return false;
        }

        if (telefono === "") {
            setTelefonoVacio(true);
            mostrarErrorTelefonoVacio();
            return false;
        } else if (telefono.length >= 15) {
            setTelefonoNoValido(true);
            mostrarErrorTelefonoNoValido();
            return false;
        } else {
            setTelefonoVacio(false);
            setTelefonoNoValido(false);
        }

        if (email !== "") {
            if (validarEmail(email)) {
                setEmailNoValido(false);
            } else {
                setEmailNoValido(true);
                mostrarErrorEmailNoValido();
                return false;
            }
        } else {
            setEmailNoValido(false);
        }

        return true;
    }

    const registrarProductor = async () => {
        const validacion = validarForm();
        if(validacion){
            const productor = {
                nombre: nombres,
                apellido: apellidos,
                cuit_cuil: cuil,
                numero_telefono: telefono
            }
            
            if(email !== ""){
                productor.email = email;
            } else{
                productor.email = "";
            }

            if(referencias !== ""){
                productor.referencia = referencias;
            } else{
                productor.referencia = "";
            }

            try {
                await registrarProductorService(productor);
                setMostrarAlertaProductorRegistrado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                      await renewToken();
                      await registrarProductorService(productor);
                      setMostrarAlertaProductorRegistrado(true);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                      else{
                        mostrarErrorRegistroToast();
                      }
                    }
                  }
                  else if (error.response.status === 302){
                    setMostrarErrorCuilRepetido(true);
                    mostrarErrorCuilRepetidoToast();
                  }
                  else{
                    mostrarErrorRegistroToast();
                  } 
            }
        }
        
    }

    const validarFormModif = () => {
        if (nombresModif === "") {
            setNombreVacio(true);
            mostrarErrorNombreVacio();
            return false;
        } else {
            setNombreVacio(false);
        }

        if (apellidosModif === "") {
            setApellidosVacio(true);
            mostrarErrorApellidoVacio();
            return false
        } else {
            setApellidosVacio(false);
        }

        if (cuilModif === "") {
            setCuilVacio(true);
            mostrarErrorCuilVacio();
            return false;
        } else if(cuilValidator(quitarGuiones(cuilModif)) || verifyCuit(quitarGuiones(cuilModif))) {
            setCuilNoValido(false);
            setCuilVacio(false);
        } else{
            setCuilNoValido(true);
            setCuilVacio(false);
            mostrarErrorCuiloNoValido();
            return false;
        }

        if (telefonoModif === "") {
            setTelefonoVacio(true);
            mostrarErrorTelefonoVacio();
            return false;
        } else if (telefonoModif.length !== 10) {
            setTelefonoNoValido(true);
            mostrarErrorTelefonoNoValido();
            return false;
        } else {
            setTelefonoVacio(false);
            setTelefonoNoValido(false);
        }

        if (emailModif !== "") {
            if (validarEmail(emailModif)) {
                setEmailNoValido(false);
            } else {
                setEmailNoValido(true);
                mostrarErrorEmailNoValido();
                return false;
            }
        } else {
            setEmailNoValido(false);
        }

        return true;
    }

    const modificarProductor = async () => {
        const validacion = validarFormModif();
        if(validacion){
            const productorModificado = {
                nombre: nombresModif,
                apellido: apellidosModif,
                cuit_cuil: quitarGuiones(cuilModif),
                numero_telefono: telefonoModif
            }
            
            if(emailModif !== ""){
                productorModificado.email = emailModif;
            } else{
                productorModificado.email = "";
            }

            if(referenciasModif !== ""){
                productorModificado.referencia = referenciasModif;
            } else{
                productorModificado.referencia = "";
            }


            try {
                await modificarProductorService(productorModificado, productor.id);
                setMostrarAlertaProductorModificado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                      await renewToken();
                      await modificarProductorService(productorModificado, productor.id);
                      setMostrarAlertaProductorModificado(true);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                      else{
                        mostrarErrorModificacionToast();
                      }
                    }
                  }
                  else if (error.response.status === 302){
                    setMostrarErrorCuilRepetido(true);
                    mostrarErrorCuilRepetidoToast();
                  }
                  else{
                    mostrarErrorModificacionToast();
                  } 
            }
        }
        
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    const handleAlertaProductorRegistrado = (e) => {
        if(e){
            setMostrarAlertaProductorRegistrado(false);
            reset();
            accionConfirmar();
        }
    }

    const handleAlertaProductorModificado = (e) => {
        if(e){
            setMostrarAlertaProductorModificado(false);
            reset();
            accionConfirmar();
        }
    }

    const habilitarEdicionProductor = () => {
        setModoComponente("Modificar");
    }


    if(modoComponente === "Registrar"){
        return(
            <>
                {/* FORM REGISTRAR FORMULARIO */}
                <div className="overlay">
                    <Form className="formulario-claro-alargado formCentrado" onSubmit={handleSubmit(registrarProductor)}>
    
                        <div className="seccionTitulo">
                            <strong className="tituloForm">Nuevo Productor</strong>
                        </div>
                                      
                        <div className='columnasProductores'>
    
                            <div className='columnaUnoProductor'>
    
                                {/* Input Nombres */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={nombreVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Nombres</Form.Label>
                                    <Form.Control  type="text" value={nombres}
                                    onChange={handleChangeNombre}/>
                                </Form.Group>
    
                                {/* Input Apellidos */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={apellidosVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Apellidos</Form.Label>
                                    <Form.Control  type="text" value={apellidos}
                                    onChange={handleChangeApellidos}/>
                                </Form.Group>
    
                                {/* Input Cuit o Cuil */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(cuilVacio || cuilNoValido || mostrarErrorCuilRepetido) ? 'labelErrorFormulario' : 'labelFormulario'}>CUIT/CUIL</Form.Label>
                                    <Form.Control  type="text" value={cuil}
                                    onChange={handleChangeCuil}/>
                                </Form.Group>  

                                {/* Input Teléfono */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(telefonoVacio || telefonoNoValido) ? 'labelErrorFormulario' : 'labelFormulario'}>Teléfono</Form.Label>
                                    <Form.Control  type="text" value={telefono}
                                    onChange={handleChangeTelefono}/>
                                </Form.Group>
     
                            </div>
    
                            <div className="columanDosProductor">
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={emailNoValido ? 'labelErrorFormulario' : 'labelFormulario'}>Email</Form.Label>
                                    <Form.Control  type="email" value={email}
                                    onChange={handleChangeEmail}/>
                                </Form.Group>
    
    
                                {/* Input Referencias */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Referencia</Form.Label>
                                    <Form.Control className="inputReferencia" as="textarea" value={referencias} maxLength={98}
                                    onChange={handleChangeReferencias}/>
                                </Form.Group>
    
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="seccionBotonesFormulario margenTop20" controlId="formBotones">
                            <Button className="botonCancelarFormulario" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="botonConfirmacionFormulario" variant="secondary"
                                    type="submit">
                                Registrar
                            </Button>
                        </Form.Group>             
                    </Form>        
                </div>

                {   
                    mostrarAlertaProductorRegistrado &&
                    <Confirm texto={"El productor ha sido registrado correctamente"}
                    onConfirm={handleAlertaProductorRegistrado}/>
                }

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }
                

            </>
        );
    }
    else if (modoComponente === "Consultar") {
        return(
            <>
            {/* FORM CONSULTAR PRODUCTOR */}
                <div className="overlay">
                    <Form className="formulario-claro-alargado formCentrado" onSubmit={handleSubmit(habilitarEdicionProductor)}>
    
                        <div className="seccionTitulo">
                            <strong className="tituloForm">Productor</strong>
                        </div>
                                      
                        <div className='columnasProductores'>
    
                            <div className='columnaUnoProductor'>
    
                                {/* Input Nombres */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={nombreVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Nombres</Form.Label>
                                    <Form.Control  type="text" value={productor.nombre}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Apellidos */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={apellidosVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Apellidos</Form.Label>
                                    <Form.Control  type="text" value={productor.apellido}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Cuit o Cuil */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={cuilVacio ? 'labelErrorFormulario' : 'labelFormulario'}>CUIT/CUIL</Form.Label>
                                    <Form.Control  type="text" value={agregarGuiones(productor.cuit_cuil)}
                                    disabled={true}/>
                                </Form.Group>  

                                {/* Input Teléfono */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control  type="text" value={productor.numero_telefono == null ? "" : productor.numero_telefono}
                                    disabled={true}/>
                                </Form.Group>
     
                            </div>
    
                            <div className="columanDosProductor">
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control  type="email" value={productor.email == null ? "" : productor.email}
                                    disabled={true}/>
                                </Form.Group>
    

                                {/* Input Referencias */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Referencia</Form.Label>
                                    <Form.Control className="inputReferencia" as="textarea" value={productor.referencia == null ? "" : productor.referencia} maxLength={98}
                                    disabled={true}/>
                                </Form.Group>
    
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="seccionBotonesFormulario margenTop20" controlId="formBotones">
                            <Button className="botonCancelarFormulario" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="botonConfirmacionFormulario" variant="secondary"
                                    type="submit">
                                Editar
                            </Button>
                        </Form.Group>             
                    </Form>        
                </div>
            </>
        );
    }
    else if (modoComponente === "Modificar"){
        return(
            <>
                {/* FORM MODIFICAR PRODUCTOR */}
                <div className="overlay">
                    <Form className="formulario-claro-alargado formCentrado" onSubmit={handleSubmit(modificarProductor)}>
    
                        <div className="seccionTitulo">
                            <strong className="tituloForm">Productor</strong>
                        </div>
                                      
                        <div className='columnasProductores'>
    
                            <div className='columnaUnoProductor'>
    
                                {/* Input Nombres */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={nombreVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Nombres</Form.Label>
                                    <Form.Control  type="text" value={nombresModif}
                                    onChange={handleChangeNombreModif}/>
                                </Form.Group>
    
                                {/* Input Apellidos */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={apellidosVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Apellidos</Form.Label>
                                    <Form.Control  type="text" value={apellidosModif}
                                    onChange={handleChangeApellidosModif}/>
                                </Form.Group>
    
                                {/* Input Cuit o Cuil */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(cuilVacio || cuilNoValido || mostrarErrorCuilRepetido) ? 'labelErrorFormulario' : 'labelFormulario'}>CUIT/CUIL</Form.Label>
                                    <Form.Control  type="text" value={cuilModif}
                                    onChange={handleChangeCuilModif}/>
                                </Form.Group>  


                                {/* Input Teléfono */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(telefonoVacio || telefonoNoValido) ? 'labelErrorFormulario' : 'labelFormulario'}>Teléfono</Form.Label>
                                    <Form.Control  type="text" value={telefonoModif}
                                    onChange={handleChangeTelefonoModif}/>
                                </Form.Group>
     
                            </div>
    
                            <div className="columanDosProductor">
    
                            
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={emailNoValido ? 'labelErrorFormulario' : 'labelFormulario'}>Email</Form.Label>
                                    <Form.Control  type="email" value={emailModif}
                                    onChange={handleChangeEmailModif}/>
                                </Form.Group>
    
    
                                {/* Input Referencias */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Referencia</Form.Label>
                                    <Form.Control className="inputReferencia" as="textarea" value={referenciasModif} maxLength={98}
                                    onChange={handleChangeReferenciasModif}/>
                                </Form.Group>
    
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="seccionBotonesFormulario margenTop20" controlId="formBotones">
                            <Button className="botonCancelarFormulario" variant="secondary"
                            onClick={handleCancelarEdicion}>
                                Cancelar
                            </Button>
                            <Button className="botonConfirmacionFormulario" variant="secondary"
                                    type="submit">
                                Aceptar
                            </Button>
                        </Form.Group>             
                    </Form>        
                </div>

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {   
                    mostrarAlertaProductorModificado &&
                    <Confirm texto={"El productor ha sido modificado correctamente"}
                    onConfirm={handleAlertaProductorModificado}/>
                }

            </>
        );
    }
    
}

export default ProductorAMC; 