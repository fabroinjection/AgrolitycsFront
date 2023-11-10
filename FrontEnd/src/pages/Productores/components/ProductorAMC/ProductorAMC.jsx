//Estilos
import './ProductorAMC.css';

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
    const [ email, setEmail ] = useState("");
    const [ referencias, setReferencias ] = useState("");

    // variables para los input del form en modo modificacion
    const [ nombresModif, setNombresModif ] = useState("");
    const [ apellidosModif, setApellidosModif ] = useState("");
    const [ cuilModif, setCuilModif ] = useState("");
    const [ emailModif, setEmailModif ] = useState("");
    const [ referenciasModif, setReferenciasModif ] = useState("");

    //variables para manejar la visualización de errores en campos form y validar
    const [ nombreVacio, setNombreVacio ] = useState(false);
    const [ apellidosVacio, setApellidosVacio ] = useState(false);
    const [ cuilVacio, setCuilVacio ] = useState(false);
    const [ cuilNoValido, setCuilNoValido ] = useState(false);
    const [ emailNoValido, setEmailNoValido ] = useState(false);

    //variables para manejar el renderizado de alertas de error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarErrorRegistro, setMostrarErrorRegistro ] = useState(false);
    const [ mostrarErrorModificacion, setMostrarErrorModificacion ] = useState(false);
    const [ mostrarErrorCuilRepetido, setMostrarErrorCuilRepetido ] = useState(false);

    //variables para manejar el renderizado de avisos al usuario
    const [ mostrarAlertaProductorRegistrado, setMostrarAlertaProductorRegistrado ] = useState(false);
    const [ mostrarAlertaProductorModificado, setMostrarAlertaProductorModificado ] = useState(false);

    const handleChangeNombre = (e) => {
        const { value } = e.target;
      
        // Verificar si el valor no contiene números y no contiene caracteres especiales
        if (!/\d/.test(value) && /^[A-Za-z\s]+$/.test(value)) {
          setNombres(value);
        } else if (value === ""){
            setNombres(value);
        }
      }
      
      const handleChangeApellidos = (e) => {
        const { value } = e.target;
      
        // Verificar si el valor no contiene números y no contiene caracteres especiales
        if (!/\d/.test(value) && /^[A-Za-z\s]+$/.test(value)) {
          setApellidos(value);
        } else if (value === ""){
            setApellidos(value);
        }
      }

    const handleChangeCuil = (e) => {
        const { value } = e.target;
        setCuil(value);
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
            setCuilModif(productor.cuit_cuil);
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
      
        // Verificar si el valor no contiene números y no contiene caracteres especiales
        if (!/\d/.test(value) && /^[A-Za-z\s]+$/.test(value)) {
          setNombresModif(value);
        } else if (value === ""){
            setNombresModif(value);
        }
      }
      
      const handleChangeApellidosModif = (e) => {
        const { value } = e.target;
      
        // Verificar si el valor no contiene números y no contiene caracteres especiales
        if (!/\d/.test(value) && /^[A-Za-z\s]+$/.test(value)) {
          setApellidosModif(value);
        } else if (value === ""){
            setApellidosModif(value);
        }
      }

    const handleChangeCuilModif = (e) => {
        const { value } = e.target;
        setCuilModif(value);
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

    const validarForm = () => {
        if (nombres === "") {
            setNombreVacio(true);
            return false;
        } else {
            setNombreVacio(false);
        }

        if (apellidos === "") {
            setApellidosVacio(true);
            return false
        } else {
            setApellidosVacio(false);
        }

        if (cuil === "") {
            setCuilVacio(true);
            return false;
        } else if(cuilValidator(cuil) || verifyCuit(cuil)) {
            setCuilNoValido(false);
            setCuilVacio(false);
        } else{
            setCuilNoValido(true);
            setCuilVacio(false);
            return false;
        }

        if (email !== "") {
            if (validarEmail(email)) {
                setEmailNoValido(false);
            } else {
                setEmailNoValido(true);
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
                        setMostrarErrorRegistro(true);
                      }
                    }
                  }
                  else if (error.response.status === 302){
                    setMostrarErrorCuilRepetido(true);
                  }
                  else{
                    setMostrarErrorRegistro(true);
                  } 
            }
        }
        
    }

    const validarFormModif = () => {
        if (nombresModif === "") {
            setNombreVacio(true);
            return false;
        } else {
            setNombreVacio(false);
        }

        if (apellidosModif === "") {
            setApellidosVacio(true);
            return false
        } else {
            setApellidosVacio(false);
        }

        if (cuilModif === "") {
            setCuilVacio(true);
            return false;
        } else if(cuilValidator(cuilModif) || verifyCuit(cuilModif)) {
            setCuilNoValido(false);
            setCuilVacio(false);
        } else{
            setCuilNoValido(true);
            setCuilVacio(false);
            return false;
        }

        if (emailModif !== "") {
            if (validarEmail(emailModif)) {
                setEmailNoValido(false);
            } else {
                setEmailNoValido(true);
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
                cuit_cuil: cuilModif,
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
                        setMostrarErrorModificacion(true);
                      }
                    }
                  }
                  else if (error.response.status === 302){
                    setMostrarErrorCuilRepetido(true);
                  }
                  else{
                    setMostrarErrorModificacion(true);
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
            {console.log(mostrarAlertaProductorRegistrado)}
                <div className="overlay">
                    <Form className="formProductor formCentrado" onSubmit={handleSubmit(registrarProductor)}>
    
                        <div className="formTituloProductor">
                            <strong className="tituloFormProductor">Nuevo Productor</strong>
                        </div>
                                      
                        <div className='columnasProductores'>
    
                            <div className='columnaUnoProductor'>
    
                                {/* Input Nombres */}
                                <Form.Group className="mb-3 seccionNombreProd">
                                    <Form.Label className={nombreVacio ? 'labelErrorInput' : ''}>Nombres</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={nombres}
                                    onChange={handleChangeNombre}/>
                                </Form.Group>
    
                                {/* Input Apellidos */}
                                <Form.Group className="mb-3 seccionApellidos">
                                    <Form.Label className={apellidosVacio ? 'labelErrorInput' : ''}>Apellidos</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={apellidos}
                                    onChange={handleChangeApellidos}/>
                                </Form.Group>
    
                                {/* Input Cuit o Cuil */}
                                <Form.Group className="mb-3 seccionCuitCuil">
                                    <Form.Label className={cuilVacio ? 'labelErrorInput' : ''}>Cuit/Cuil</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={cuil}
                                    onChange={handleChangeCuil}/>
                                </Form.Group>  
     
                            </div>
    
                            <div className="columanDosProductor">
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control className="inputProductores" type="email" value={email}
                                    onChange={handleChangeEmail}/>
                                </Form.Group>
    
    
                                {/* Input Referencias */}
                                <Form.Group className="mb-3 seccionReferencia">
                                    <Form.Label>Referencia</Form.Label>
                                    <Form.Control className="inputProductoresRef" as="textarea" value={referencias}
                                    onChange={handleChangeReferencias}/>
                                </Form.Group>
    
                                {/* Mensaje de Faltan Campos */}
                                <Form.Group className="mb-3">
                                    {(nombreVacio || apellidosVacio || cuilVacio) && <Form.Label className='labelErrorInput'>*Se debe ingresar los campos en rojo</Form.Label>}
                                    {cuilNoValido && <Form.Label className='labelErrorInput'>*Se debe ingresar un cuil o cuit válido</Form.Label>}
                                    {emailNoValido && <Form.Label className='labelErrorInput'>*Email en formato no válido</Form.Label>}
                                </Form.Group>
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                            <Button className="estiloBotonesProductor botonCancelarProductor" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="estiloBotonesProductor botonConfirmarProductor" variant="secondary"
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

                {
                    mostrarErrorRegistro &&
                    <Error texto={"Ha ocurrido un error registrando su productor, intente de nuevo más tarde"} 
                    onConfirm={() => setMostrarErrorRegistro(false)}/>
                }

                {
                    mostrarErrorCuilRepetido &&
                    <Error texto={"El CUIL ingresado ya se encuentra asociado a otro productor."} 
                    onConfirm={() => setMostrarErrorCuilRepetido(false)}/>
                }

                

            </>
        );
    }
    else if (modoComponente === "Consultar") {
        return(
            <>
                <div className="overlay">
                    <Form className="formProductor formCentrado" onSubmit={handleSubmit(habilitarEdicionProductor)}>
    
                        <div className="formTituloProductor">
                            <strong className="tituloFormProductor">Productor</strong>
                        </div>
                                      
                        <div className='columnasProductores'>
    
                            <div className='columnaUnoProductor'>
    
                                {/* Input Nombres */}
                                <Form.Group className="mb-3 seccionNombreProd">
                                    <Form.Label className={nombreVacio ? 'labelErrorInput' : ''}>Nombres</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={productor.nombre}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Apellidos */}
                                <Form.Group className="mb-3 seccionApellidos">
                                    <Form.Label className={apellidosVacio ? 'labelErrorInput' : ''}>Apellidos</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={productor.apellido}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Cuit o Cuil */}
                                <Form.Group className="mb-3 seccionCuitCuil">
                                    <Form.Label className={cuilVacio ? 'labelErrorInput' : ''}>Cuit/Cuil</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={productor.cuit_cuil}
                                    disabled={true}/>
                                </Form.Group>  
     
                            </div>
    
                            <div className="columanDosProductor">
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control className="inputProductores" type="email" value={productor.email == null ? "" : productor.email}
                                    disabled={true}/>
                                </Form.Group>
    
    
                                {/* Input Referencias */}
                                <Form.Group className="mb-3 seccionReferencia">
                                    <Form.Label>Referencia</Form.Label>
                                    <Form.Control className="inputProductoresRef" as="textarea" value={productor.referencia == null ? "" : productor.referencia}
                                    disabled={true}/>
                                </Form.Group>
    
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                            <Button className="estiloBotonesProductor botonCancelarProductor" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="estiloBotonesProductor botonConfirmarProductor" variant="secondary"
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
                <div className="overlay">
                    <Form className="formProductor formCentrado" onSubmit={handleSubmit(modificarProductor)}>
    
                        <div className="formTituloProductor">
                            <strong className="tituloFormProductor">Productor</strong>
                        </div>
                                      
                        <div className='columnasProductores'>
    
                            <div className='columnaUnoProductor'>
    
                                {/* Input Nombres */}
                                <Form.Group className="mb-3 seccionNombreProd">
                                    <Form.Label className={nombreVacio ? 'labelErrorInput' : ''}>Nombres</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={nombresModif}
                                    onChange={handleChangeNombreModif}/>
                                </Form.Group>
    
                                {/* Input Apellidos */}
                                <Form.Group className="mb-3 seccionApellidos">
                                    <Form.Label className={apellidosVacio ? 'labelErrorInput' : ''}>Apellidos</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={apellidosModif}
                                    onChange={handleChangeApellidosModif}/>
                                </Form.Group>
    
                                {/* Input Cuit o Cuil */}
                                <Form.Group className="mb-3 seccionCuitCuil">
                                    <Form.Label className={cuilVacio ? 'labelErrorInput' : ''}>Cuit/Cuil</Form.Label>
                                    <Form.Control className="inputProductores" type="text" value={cuilModif}
                                    onChange={handleChangeCuilModif}/>
                                </Form.Group>  
     
                            </div>
    
                            <div className="columanDosProductor">
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control className="inputProductores" type="email" value={emailModif}
                                    onChange={handleChangeEmailModif}/>
                                </Form.Group>
    
    
                                {/* Input Referencias */}
                                <Form.Group className="mb-3 seccionReferencia">
                                    <Form.Label>Referencia</Form.Label>
                                    <Form.Control className="inputProductoresRef" as="textarea" value={referenciasModif}
                                    onChange={handleChangeReferenciasModif}/>
                                </Form.Group>
    
                                {/* Mensaje de Faltan Campos */}
                                <Form.Group className="mb-3">
                                    {(nombreVacio || apellidosVacio || cuilVacio) && <Form.Label className='labelErrorInput'>*Se debe ingresar los campos en rojo</Form.Label>}
                                    {cuilNoValido && <Form.Label className='labelErrorInput'>*Se debe ingresar un cuil o cuit válido</Form.Label>}
                                    {emailNoValido && <Form.Label className='labelErrorInput'>*Email en formato no válido</Form.Label>}
                                </Form.Group>
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                            <Button className="estiloBotonesProductor botonCancelarProductor" variant="secondary"
                            onClick={handleCancelarEdicion}>
                                Cancelar
                            </Button>
                            <Button className="estiloBotonesProductor botonConfirmarProductor" variant="secondary"
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
                    mostrarErrorModificacion &&
                    <Error texto={"Ha ocurrido un error modificando su productor, intente de nuevo más tarde"} 
                    onConfirm={() => setMostrarErrorModificacion(false)}/>
                }

                {
                    mostrarErrorCuilRepetido &&
                    <Error texto={"El CUIL ingresado ya se encuentra asociado a otro productor."} 
                    onConfirm={() => setMostrarErrorCuilRepetido(false)}/>
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