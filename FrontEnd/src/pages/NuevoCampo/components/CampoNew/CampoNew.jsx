//import hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

//import estilos
import './CampoNew.css';

//import componentes
import Select from 'react-select'; 
import Navbar from '../../../../components/Navbar/Navbar.components';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Cookies from 'js-cookie';
import Error from '../../../../components/Modals/Error/Error';

//import servicios
import { provinciasService } from '../../../../services/provincias.service';
import { localidadesService } from '../../../../services/localidades.service';
import { productoresService } from '../../../../services/productores.service';
import { nuevoCampoService } from '../../services/nuevocampo.service';
import { renewToken } from '../../../../services/token.service';


function CampoNew() {

    const { register, formState: {errors} , handleSubmit, reset } = useForm();

    //states para Provincia
    const [ provincias, setProvincias ] = useState([]);
    const [ provSeleccionada, setProvSeleccionada ] = useState({label: 'Provincia', value: 'Provincia'});
    const [ provValida, setProvValida ] = useState(true);

    //states para Localidad
    const [ localidades, setLocalidades ] = useState([]);
    const [ locSeleccionada, setLocSeleccionada ] = useState({label: 'Localidad', value: 'Localidad', data: 'Localidad'});
    const [ locValida, setLocValida ] = useState(true);

    //states para Productores
    const [ productores, setProductores ] = useState([]);
    const [ prodSeleccionado, setProdSeleccionado ] = useState({label: 'Productor', value: 'Productor'});
    const [ prodValido, setProdValido ] = useState(true);

    //estado para alerta campo existente con ese nombre para el productor seleccionado
    const [ mostrarError403, setMostrarError403 ] = useState(false);
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);



    let navigate = useNavigate();

    const cancelarFormulario = () =>{
       reset();
       navigate("/home");
     }

    const consultarFormulario = async (data) => {
        const esProvinciaValida = validarProvincia();
        const esLocalidadValida = validarLocalidad();
        const esProductorValido = validarProductor();

        if (esProvinciaValida && esLocalidadValida && esProductorValido){
          const campoEnviar = {
            nombre: data.nombre,
            localidad_id: parseInt(locSeleccionada.value),
            productor_id: parseInt(prodSeleccionado.value),
          };
          try {
            await nuevoCampoService(campoEnviar);   
            reset();
            navigate("/home"); //Volver al inicio
          } catch (error) {
            if(error.response && error.response.status === 403){
              setMostrarError403(true);
            }
            else if(error.response && error.response.status === 401){
              try {
                await renewToken();
                await nuevoCampoService(campoEnviar);   
                reset();
                navigate("/home"); //Volver al inicio
              } catch (error) {
                if(error.response && error.response.status === 401){
                  setMostrarErrorVencimientoToken(true);
                }
              }
            }
          }
        }
        else{
            //
        }
        
     };

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


    const fetchLocalidades = async (id) => {
      const { data } = await localidadesService(id);
      setLocalidades(data);
    };


    const handleSelectChangeProvincia = (opcion) => {
      setProvSeleccionada(opcion);

    }

    useEffect( () =>{
      try {
        fetchLocalidades(provSeleccionada.value);
      } catch (error) {
        //console.log(error)
      }
    },[provSeleccionada])


    const validarProvincia = () =>{

      if(provSeleccionada && provSeleccionada.value === "Provincia"){
        setProvValida(false);
        return false;
      }
      setProvValida(true);
      return true;
    }


    const handleSelectChangeLocalidad = (opcion) => {
      setLocSeleccionada(opcion);
    }

    const validarLocalidad = () =>{
 
      if((locSeleccionada.data === "Localidad") 
      || (locSeleccionada.data !== provSeleccionada.value)){
        setLocValida(false);
        return false;
      }
      setLocValida(true);
      return true;

    }

    const handleSelectChangeProductor = (opcion) =>{
      setProdSeleccionado(opcion);
    }

    const fetchProductores = async () => {
      const { data } = await productoresService();
      setProductores(data);
    };

    const validarProductor = () =>{
      if(prodSeleccionado.value === "Productor"){
        setProdValido(false);
        return false;
      }
      setProdValido(true);
      return true;
    }

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

    const handleSesionExpirada = () =>{
      setMostrarErrorVencimientoToken(false);
      navigate("/");
      window.localStorage.removeItem('loggedAgroUser');
    }




  if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
    return (
      <>
        <Navbar/>


        {/* Formulario registrar campo */}
        <form className='container formSuperpuesto' onSubmit={handleSubmit(consultarFormulario)}>
          <fieldset className="">
      
          

              {/* Título */}
            <div className="mb-3 titulo">
              <span className='letraInter'>Agregar campo</span>
            </div>

              {/* Nombre del campo*/}
              <div className='mb-3 campo'>
                
                <input type="text" className="form-control" aria-describedby="nombreHelp" name="nombre"
                  placeholder="Nombre del campo"
                  {...register("nombre", {
                  required: true, minLength: 4, maxLength: 30})} />
                    <div className='alerta'>
                      {
                        errors.nombre?.type === "required" && (
                        <span className="campoVacio letraInter">
                          * Ingrese un nombre de campo.
                        </span>
                        )
                      }
                      {
                        errors.nombre?.type === "minLength" && (
                        <span className="campoVacio letraInter">
                          El nombre de campo debe tener como mínimo 4 caracteres.
                        </span>
                        )
                      }
                      {
                        errors.nombre?.type === "maxLength" && (
                        <span className="campoVacio letraInter">
                          El nombre de campo debe tener como máximo 30 caracteres.
                        </span>
                        )
                      }
                    </div>                
                        
              </div>

              {/* Seleccionar una provincia */}
              <div className="mb-3 campo">
                
                <Select                
                  value={provSeleccionada}
                  onChange={handleSelectChangeProvincia}
                  className='seleccionables' 
                  defaultValue={{label: 'Provincia', value: 'Provincia'}}
                  options={
                    provincias.map( prov => ({label: prov.nombre, value: prov.id})
                  )
                }
                  
                />
                <div className='alerta'>
                  {
                    !provValida &&
                    <span className="campoVacio letraInter">
                      * Seleccione una Provincia.
                    </span>
                  }
                </div>
                
              </div>

              {/* Seleccionar una localidad */}
              <div className="mb-3 campo">
                <Select
                  value={locSeleccionada}
                  onChange={handleSelectChangeLocalidad}
                  className='seleccionables' 
                  defaultValue={{label: 'Localidad', value: 'Localidad'}}
                  options={
                    localidades.map( loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id})
                    
                  )
                }

                />
                <div className='alerta'>
                {
                  !locValida &&
                  <span className="campoVacio letraInter">
                    * Seleccione una Localidad Válida.
                  </span>
                }
                </div>
                
              </div>


              <div className="mb-3 campo">
                
                <Select                
                  value={prodSeleccionado}
                  onChange={handleSelectChangeProductor}
                  className='seleccionables' 
                  defaultValue={{label: 'Productor', value: 'Productor'}}
                  options={
                    productores.map( prod => ({label: prod.nombre + " " + prod.apellido 
                    + " " + prod.cuit_cuil , value: prod.id})
                  )
                }

                />
                <div className='alerta'>
                  {
                    !prodValido &&
                    <span className="campoVacio letraInter">
                      * Seleccione un Productor.
                    </span>
                  }
                </div>
                
              </div>

          

                {/* Botones */}
              <div className='contenedorBotones'>

                {/* Boton cancelar */}
                <button  className='botonesForm letraInter' onClick={cancelarFormulario}>
                  Cancelar
                </button>

                {/* Boton Confirmar */}
                <button className='botonesForm letraInter' type='submit'>
                  Confirmar
                </button>
              </div>
          </fieldset>             

          {mostrarError403 && (
          <Error
            texto="Ya existe un campo con ese nombre para el productor seleccionado"
          />
          )}

        </form>

        {
          mostrarErrorVencimientoToken &&
          <Error texto={"Su sesión ha expirado"} 
          onConfirm={handleSesionExpirada}/>
        }  
      </>    

    )
  }
  else{
    return <NoLogueado/>
  }
    
  }

export default CampoNew