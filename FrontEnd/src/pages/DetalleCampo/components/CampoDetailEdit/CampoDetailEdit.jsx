// imports Componentes
import Navbar from "../../../../components/Navbar/Navbar.components"
import Select from "react-select";
import Confirm from "../../../../components/Modals/Confirm/Confirm";
import Error from "../../../../components/Modals/Error/Error";
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";

// Hooks
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';


// CSS
import './CampoDetailEdit.css'
import '../../../../components/Estilos/estilosFormulario.css';

//Servicios
import { provinciasService } from "../../../../services/provincias.service";
import { localidadesService } from "../../../../services/localidades.service";
import { productoresService } from "../../../../services/productores.service";
import { modificarCampoService } from "../../services/detalleCampo.service";
import { renewToken } from "../../../../services/token.service";

//import utilities
import { toast } from 'react-toastify';


function CampoDetailEdit({campo}) {
  
  const { register, formState: {errors} , handleSubmit } = useForm();

  const [ mostrarConfirmacion, setMostrarConfirmacion ] = useState(false);
  const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

  //states para Nombre Campo
  const [inputNombreValue, setInputNombreValue] = useState(campo.nombre);
  const [ nombreNoValido, setNombreNoValido ] = useState(false);

  //states para Provincia
  const [ provincias, setProvincias ] = useState([]);
  const [ provSeleccionada, setProvSeleccionada ] = useState({
    label: campo.provincia_nombre, 
    value: campo.provincia_id,
  });
  const [ provValida, setProvValida ] = useState(true);

  //states para Localidad
  const [ localidades, setLocalidades ] = useState([]);
  const [ locSeleccionada, setLocSeleccionada ] = useState({
    label: campo.localidad_nombre, 
    value: campo.localidad_id,
    data: campo.provincia_id
  });
  const [ locValida, setLocValida ] = useState(true);

  //states para Productores
  const [ productores, setProductores ] = useState([]);
  const [ prodSeleccionado, setProdSeleccionado ] = useState({
    label: campo.productor_nombre + " " + campo.productor_cuit_cuil, 
    value: campo.productor_id,
    data: campo.productor_cuit_cuil});
  const [ prodValido, setProdValido ] = useState(true);

  // funcion toast para alerta nombre vacío
  const mostrarErrorNombre = () => {
    toast.error('Ingrese un nombre de campo', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }); 
  }

  // funcion toast para alerta nombre menor a 4 car
  const mostrarErrorNombre4Carac = () => {
    toast.error('Ingrese un nombre que tenga como mínimo 4 caracteres', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }); 
  }

  // funcion toast para alerta nombre mayor a 20 car
  const mostrarErrorNombre20Carac = () => {
    toast.error('Ingrese un nombre que tenga como máximo 20 caracteres', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }); 
  }

  // funcion toast para alerta provincia vacía
  const mostrarErrorProvinciaVacia = () => {
    toast.error('Ingrese una provincia', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }); 
  }

  // funcion toast para alerta localidad vacía
  const mostrarErrorLocalidadVacia = () => {
    toast.error('Ingrese una localidad', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }); 
  }

  // funcion toast para alerta localidad no valida
  const mostrarErrorLocalidadNoValida = () => {
    toast.error('Ingrese una localidad válida para la provincia ingresada', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }); 
  }

  // funcion toast para alerta productor vacío
  const mostrarErrorProductorVacio = () => {
    toast.error('Ingrese un productor', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }); 
  }

  let navigate = useNavigate();

  const cancelarModificacion = () =>{
    navigate("/home");
  }

  const modificarCampo = async () => {
    const esNombreValido = validarNombre();
    const esProvinciaValida = validarProvincia();
    const esLocalidadValida = validarLocalidad();
    const esProductorValido = validarProductor();

    if(esNombreValido && esProvinciaValida && esLocalidadValida && esProductorValido){
      const campoActualizar = {
        id: campo.id,
        nombre: inputNombreValue,
        localidad_id: locSeleccionada.value,
        productor_id: prodSeleccionado.value
      };
      
      try {
        await modificarCampoService(campoActualizar);
        setMostrarConfirmacion(true);
      } catch (error) {
        if(error.response && error.response.status === 401){
          try {
            await renewToken();
            await modificarCampoService(campoActualizar);
            setMostrarConfirmacion(true);
          } catch (error) {
            if(error.response && error.response.status === 401){
              setMostrarErrorVencimientoToken(true);
            }
          }
        }
      }
      
      
    }
  }

  const validarNombre = () => {
    if (inputNombreValue === '') {
      setNombreNoValido(true);
      mostrarErrorNombre();
      return false;
    } else if (inputNombreValue.length < 4) {
      setNombreNoValido(true);
      mostrarErrorNombre4Carac();
      return false;
    } else if (inputNombreValue.length > 20) {
      setNombreNoValido(true);
      mostrarErrorNombre20Carac();
      return false;
    }
    setNombreNoValido(false);
    return true;
  }

  const handleSelectChangeProvincia = (opcion) => {
    setProvSeleccionada(opcion);
  }

  const validarProvincia = () =>{
    if(provSeleccionada){
      setProvValida(true);
      return true;
    }
    else{
      setProvValida(false);
      mostrarErrorProvinciaVacia();
      return false;
    }
  }

  const fetchProvincias = async () => {
    const { data } = await provinciasService();
    setProvincias(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProvincias();
      }
      catch(error)
      {
        if(error.response && error.response.status === 401){
          try {
            await renewToken();
            await fetchProvincias();
          } catch (error) {
            if(error.response && error.response.status === 401){
              setMostrarErrorVencimientoToken(true);
            }
          }
        }
      }
    };
    fetchData();
  }, [setProvincias]);

  const handleSelectChangeLocalidad = (opcion) =>{
    setLocSeleccionada(opcion)
  }

  const validarLocalidad = () =>{
    if(locSeleccionada.data !== provSeleccionada.value){
      setLocValida(false);
      mostrarErrorLocalidadNoValida();
      return false;
    }
    setLocValida(true);
    return true;
  }

  const fetchLocalidades = async (id) => {
    const { data } = await localidadesService(id);
    setLocalidades(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (provSeleccionada.value !== "Provincia") {
        try {
          await fetchLocalidades(provSeleccionada.value);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            try {
              await renewToken();
              await fetchLocalidades(provSeleccionada.value);
            } catch (error) {
              if (error.response && error.response.status === 401) {
                setMostrarErrorVencimientoToken(true);
              }
            }
          }
        }
      }
    };
  
    fetchData();
  }, [provSeleccionada]);

  const handleSelectChangeProductor = (opcion) =>{
    setProdSeleccionado(opcion);
  }

  const validarProductor = () =>
  {
    if(prodSeleccionado){
      setProdValido(true);
      return true;
    }
    else{
      setProdValido(false);
      mostrarErrorProductorVacio();
      return false;
    }
  }

  const fetchProductores = async () => {
    const { data } = await productoresService();
    setProductores(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProductores();
      }
      catch(error)
      {
        if(error.response && error.response.status === 401){
          try {
            await renewToken();
            await fetchProductores();
          } catch (error) {
            if(error.response && error.response.status === 401){
              setMostrarErrorVencimientoToken(true);
            }
          }
        }
      }
    };
    fetchData();
  }, [setProductores]);

  const handleInputNombreChange = (event) =>{
    setInputNombreValue(event.target.value);
  }

  const handleConfirmacionModificar = (e) =>{
    if(e){
        setMostrarConfirmacion(!mostrarConfirmacion);
        navigate(-1);
    }
  }

  const handleSesionExpirada = () =>{
    setMostrarErrorVencimientoToken(false);
    navigate("/");
    window.localStorage.removeItem('loggedAgroUser');
  }


  return (
    <>
        <Navbar />

        <div className="overlay">
          <Form className="formularioClaro formCentrado" onSubmit={handleSubmit(modificarCampo)}>
              {/* Título */}
              <div className="seccionTitulo">
                <span className='tituloForm'>Modificar campo</span>
              </div>

              {/* Input nombre campo */}
              <Form.Group className="mb-3 seccionFormulario">
                <Form.Label className={nombreNoValido ? 'labelErrorFormulario' : "labelFormulario"}>Nombre</Form.Label>
                <Form.Control type="text" className="inputFolrmularioOscuro" 
                value={inputNombreValue}
                onChange={handleInputNombreChange}
                />
              </Form.Group>

              {/* Select Provincia */}
              <Form.Group className="mb-3 seccionFormulario">
                <Form.Label className={!provValida ? 'labelErrorFormulario' : "labelFormulario"}>Provincia</Form.Label>
                <Select
                value={provSeleccionada}
                onChange={handleSelectChangeProvincia} 
                defaultValue={{label: campo.provincia_nombre, value: campo.provincia_id}}
                options={
                  provincias.map( prov => ({label: prov.nombre, value: prov.id}))
                }
              />
              </Form.Group>

              {/* Select Localidad */}
              <Form.Group className="mb-3 seccionFormulario">
                <Form.Label className={!locValida ? 'labelErrorFormulario' : "labelFormulario"}>Localidad</Form.Label>
                <Select
                value={locSeleccionada}
                onChange={handleSelectChangeLocalidad}
                defaultValue={{label: campo.localidad_nombre, value: campo.localidad_id, data: campo.provincia_id}}
                options={
                  localidades.map( loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id})
                )}
                />
              </Form.Group>

              {/* Select Productor */}
              <Form.Group className="mb-3 seccionFormulario">
                <Form.Label className={!prodValido ? 'labelErrorFormulario' : "labelFormulario"}>Productor</Form.Label>
                <Select
                  value={prodSeleccionado}
                  onChange={handleSelectChangeProductor}
                  options={
                    productores.map( prod => ({label: prod.nombre + " " + prod.apellido
                    + " " + prod.cuit_cuil , value: prod.id})
                      )
                  }
                  defaultValue={{label: campo.productor_nombre + " " + campo.productor_cuit_cuil, value: campo.productor_id}}
                />
              </Form.Group>

              {/* Botones */}
              <Form.Group className="seccionFormulario seccionBotonesFormulario margenTop30" controlId="formBotones">
                <Button className="botonCancelarFormulario" variant="secondary"
                  onClick={cancelarModificacion}>
                    Cancelar
                </Button>
                <Button className="botonConfirmacionFormulario" variant="secondary"
                  type="submit">
                    Modificar
                </Button>
              </Form.Group> 
          </Form>
        </div>

      {
        mostrarConfirmacion &&
        <Confirm texto="El campo ha sido modificado correctamente" 
        onConfirm={handleConfirmacionModificar} />
      }

      {
        mostrarErrorVencimientoToken &&
        <Error texto={"Su sesión ha expirado"} 
        onConfirm={handleSesionExpirada}/>
      }  
    </>
  )
}

export default CampoDetailEdit