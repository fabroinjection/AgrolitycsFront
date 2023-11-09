// imports Componentes
import Navbar from "../../../../components/Navbar/Navbar.components"
import { Form } from "react-bootstrap";
import Select from "react-select";
import Confirm from "../../../../components/Modals/Confirm/Confirm";
import Error from "../../../../components/Modals/Error/Error";


// Hooks
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';


// CSS
import './CampoDetailEdit.css'

//Servicios
import { provinciasService } from "../../../../services/provincias.service";
import { localidadesService } from "../../../../services/localidades.service";
import { productoresService } from "../../../../services/productores.service";
import { modificarCampoService } from "../../services/detalleCampo.service";
import { renewToken } from "../../../../services/token.service";




function CampoDetailEdit({campo}) {
  
  const { register, formState: {errors} , handleSubmit } = useForm();

  const [ mostrarConfirmacion, setMostrarConfirmacion ] = useState(false);
  const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

  //states para Nombre Campo
  const [inputNombreValue, setInputNombreValue] = useState(campo.nombre);

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

  let navigate = useNavigate();

  const cancelarModificacion = () =>{
    navigate("/home");
  }

  const modificarCampo = async (data) =>{
    const esProvinciaValida = validarProvincia();
    const esLocalidadValida = validarLocalidad();
    const esProductorValido = validarProductor();

    if(esProvinciaValida && esLocalidadValida && esProductorValido){
      const campoActualizar = {
        id: campo.id,
        nombre: data.nombre,
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

  const handleSelectChangeProvincia = (opcion) => {
    setProvSeleccionada(opcion);
  }

  const validarProvincia = () =>{
    if(provSeleccionada){
      setProvValida(true);
      return true;
    }
    else{
      setProvValida(false)
      return false;
    }
  }

  const fetchProvincias = async () => {
    const { data } = await provinciasService();
    setProvincias(data);
  };

  useEffect(() => {
    try{
      fetchProvincias();
    }
    catch(error)
    {
      if(error.response && error.response.status === 401){
        try {
          renewToken();
          fetchProvincias();
        } catch (error) {
          if(error.response && error.response.status === 401){
            setMostrarErrorVencimientoToken(true);
          }
        }
      }
    }
  }, [setProvincias]);

  const handleSelectChangeLocalidad = (opcion) =>{
    setLocSeleccionada(opcion)
  }

  const validarLocalidad = () =>{
    if(locSeleccionada.data !== provSeleccionada.value){
      setLocValida(false);
      return false;
    }
    setLocValida(true);
    return true;
  }

  const fetchLocalidades = async (id) => {
    const { data } = await localidadesService(id);
    setLocalidades(data);
  };

  useEffect( () =>{
    try {
      fetchLocalidades(provSeleccionada.value);
    } catch (error) {
      //console.log(error)
    }
  },[provSeleccionada])

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
      return false;
    }
  }

  const fetchProductores = async () => {
    const { data } = await productoresService();
    setProductores(data);
  };

  useEffect(() => {
    try{
      fetchProductores();
    }
    catch(error)
    {
      if(error.response && error.response.status === 401){
        try {
          renewToken();
          fetchProductores();
        } catch (error) {
          if(error.response && error.response.status === 401){
            setMostrarErrorVencimientoToken(true);
          }
        }
      }
    }
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

        {/* Form para la modificación de campo */}
        <form className="container mb-3 formEditCampo" onSubmit={handleSubmit(modificarCampo)}>

          {/* Input Nombre Campo */}
          {/* <label className="className='letraInterEditCampo etiquetaDetEditCampo">Nombre Campo</label> */}
          <Form.Control type="text" className="inputEditCampo" 
          {...register("nombre", {
            required: true, minLength: 4, maxLength:30
          })}
          value={inputNombreValue}
          onChange={handleInputNombreChange}
          />
          <div className='alertaEditCampo'>
            {
              errors.nombre?.type === "required" && (
              <span className="campoVacioEditCampo letraInterEditCampo">
                * Ingrese un nombre de campo.
              </span>
              )
            }
            {
              errors.nombre?.type === "minLength" && (
              <span className="campoVacio letraInter">
                * El nombre de campo debe tener como mínimo 4 caracteres.
              </span>
              )
            }
            {
              errors.nombre?.type === "maxLength" && (
              <span className="campoVacio letraInter">
                * El nombre de campo debe tener como máximo 30 caracteres.
              </span>
              )
            }
          </div>     

          {/* Select de Provincia */}
          <div className="mb-3">
            <label className='letraInterEditCampo etiquetaDetEditCampo'>Provincia</label>
            <Select
              className='seleccionablesEditCampo'
              value={provSeleccionada}
              onChange={handleSelectChangeProvincia} 
              defaultValue={{label: campo.provincia_nombre, value: campo.provincia_id}}
              options={
                provincias.map( prov => ({label: prov.nombre, value: prov.id}))
              }
            />
            <div className='alertaEditCampo'>
              {
                !provValida &&
                <span className="campoVacioEditCampo letraInterEditCampo">
                  * Seleccione una Provincia.
                </span>
              }
            </div>
                
          </div>
  
          {/* Select de Localidad */}
          <div className="mb-3 campoDetDet">
            <label className='letraInter etiquetaDet'>Localidad</label>
            <Select
              value={locSeleccionada}
              onChange={handleSelectChangeLocalidad}
              className='seleccionablesEditCampo' 
              defaultValue={{label: campo.localidad_nombre, value: campo.localidad_id, data: campo.provincia_id}}
              options={
                localidades.map( loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id})
              )}
            />
            <div className='alertaEditCampo'>
                {
                  !locValida &&
                  <span className="campoVacioEditCampo letraInterEditCampo">
                    * Seleccione una Localidad Válida.
                  </span>
                }
                </div>

          </div>
  
          {/* Select de Productor */}
          <div className="mb-3 campoDetDet">
            <label className='letraInter etiquetaDet'>Productor</label>
            <Select
              className='seleccionablesEditCampo' 
              value={prodSeleccionado}
              onChange={handleSelectChangeProductor}
              options={
                productores.map( prod => ({label: prod.nombre + " " + prod.apellido
                + " " + prod.cuit_cuil , value: prod.id})
                  )
              }
              defaultValue={{label: campo.productor_nombre + " " + campo.productor_cuit_cuil, value: campo.productor_id}}
            />

          </div>
            
  
            <div className='mb-3 contenedorBotonesEditCampo'>
              <button className="botonesFormEditCampo letraInterEditCampo" onClick={cancelarModificacion}>Cancelar</button>
              <button type="submit" className="botonesFormEditCampo letraInterEditCampo">Modificar</button>
            </div>

  
        </form>

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