//import hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

//import utilities
import { toast } from 'react-toastify';

//import estilos
import './CampoNew.css';
import '../../../../components/Estilos/estilosFormulario.css';

//import componentes
import { Button } from "react-bootstrap";
import Select from 'react-select'; 
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Cookies from 'js-cookie';
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';

//import servicios
import { provinciasService } from '../../../../services/provincias.service';
import { localidadesService } from '../../../../services/localidades.service';
import { productoresService } from '../../../../services/productores.service';
import { nuevoCampoService } from '../../services/nuevocampo.service';
import { renewToken } from '../../../../services/token.service';



function CampoNew({ onRegistrar, onCancelar }) {

    const { handleSubmit, reset } = useForm();

    //states para nombre
    const [ nombre, setNombre ] = useState('');
    const [ nombreNoValido, setNombreNoValido ] = useState(false);

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

    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    const [ errorProductoresNoRegistrados, setErrorProductoresNoRegistrados ] = useState(false);

    const [ alertaCampoRegistrado, setAlertaCampoRegistrado ] = useState(false);

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

    const mostrarError403 = () => {
      toast.error('Ya existe un campo con ese nombre para el productor seleccionado', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        }); 
    }

    let navigate = useNavigate();

    const cancelarFormulario = () =>{
       reset();
       onCancelar();
     }

    const consultarFormulario = async () => {
        const esNombreValido = validarNombre();
        const esProvinciaValida = validarProvincia();
        const esLocalidadValida = validarLocalidad();
        const esProductorValido = validarProductor();

        if (esNombreValido && esProvinciaValida && esLocalidadValida && esProductorValido){
          const campoEnviar = {
            nombre: nombre,
            localidad_id: parseInt(locSeleccionada.value),
            productor_id: parseInt(prodSeleccionado.value),
          };
          try {
            await nuevoCampoService(campoEnviar);   
            reset();
            setAlertaCampoRegistrado(true);
          } catch (error) {
            if(error.response && error.response.status === 403){
              mostrarError403();
            }
            else if(error.response && error.response.status === 401){
              try {
                await renewToken();
                await nuevoCampoService(campoEnviar);   
                reset();
                setAlertaCampoRegistrado(true);
              } catch (error) {
                if(error.response && error.response.status === 401){
                  setMostrarErrorVencimientoToken(true);
                } else if (error.response && error.response.status === 403) {
                  mostrarError403();
                }
              }
            }
          }
        }
        
     };

    const fetchProvincias = async () => {
      const { data } = await provinciasService();
      setProvincias(data);
    };

    const renovarToken = async () => {
      await renewToken();
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          await fetchProvincias();
        }
        catch(error)
        {
          if(error.response && error.response.status === 401){
            try {
              await renovarToken();
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


    const fetchLocalidades = async (id) => {
      const { data } = await localidadesService(id);
      setLocalidades(data);
    };


    const handleSelectChangeProvincia = (opcion) => {
      setProvSeleccionada(opcion);

    }

    useEffect(() => {
      const fetchData = async () => {
        if (provSeleccionada.value !== "Provincia") {
          try {
            await fetchLocalidades(provSeleccionada.value);
          } catch (error) {
            if (error.response && error.response.status === 401) {
              try {
                await renovarToken();
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


    const validarProvincia = () => {
      if(provSeleccionada && provSeleccionada.value === "Provincia"){
        setProvValida(false);
        mostrarErrorProvinciaVacia();
        return false;
      }
      setProvValida(true);
      return true;
    }


    const handleSelectChangeLocalidad = (opcion) => {
      setLocSeleccionada(opcion);
    }

    const validarLocalidad = () =>{
      if (locSeleccionada.data === 'Localidad') {
        setLocValida(false);
        mostrarErrorLocalidadVacia();
        return false;
      } else if (locSeleccionada.data !== provSeleccionada.value) {
        setLocValida(false);
        mostrarErrorLocalidadNoValida();
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
      if (data.length !== 0) {
        setProductores(data);
      } else {
        setErrorProductoresNoRegistrados(true);
      }
      
    };

    const validarProductor = () =>{
      if(prodSeleccionado.value === "Productor"){
        setProdValido(false);
        mostrarErrorProductorVacio();
        return false;
      }
      setProdValido(true);
      return true;
    }

    const validarNombre = () => {
      if (nombre === '') {
        setNombreNoValido(true);
        mostrarErrorNombre();
        return false;
      } else if (nombre.length < 4) {
        setNombreNoValido(true);
        mostrarErrorNombre4Carac();
        return false;
      } else if (nombre.length > 20) {
        setNombreNoValido(true);
        mostrarErrorNombre20Carac();
        return false;
      }
      setNombreNoValido(false);
      return true;
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          await fetchProductores();
        }
        catch(error)
        {
          if(error.response && error.response.status === 401){
            try {
              await renovarToken();
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

    const handleSesionExpirada = () =>{
      setMostrarErrorVencimientoToken(false);
      navigate("/");
      window.localStorage.removeItem('loggedAgroUser');
    }

    const handleChangeNombre = (e) => {
      const { value } = e.target;
      setNombre(value);
    }

    const handleCerrarAlertaCampoRegistrado = (e) => {
      if (e) {
        setAlertaCampoRegistrado(false);
        onRegistrar();
      }
    }

  if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
    return (
      <>
        <div className='overlay'>
          <Form className='formularioClaro formCentrado' onSubmit={handleSubmit(consultarFormulario)}>
              {/* Título */}
              <div className="seccionTitulo">
                <span className='tituloForm'>Nuevo campo</span>
              </div>

              {/* Input nombre campo */}
              <Form.Group className=' mb-3 seccionFormulario'>
                <Form.Label className={nombreNoValido ? 'labelErrorFormulario' : 'labelFormulario'}>Nombre</Form.Label>
                <Form.Control type='text' className='inputFolrmularioOscuro' value={nombre} onChange={handleChangeNombre}></Form.Control>

              </Form.Group>  

              {/* Select Provincia*/}
              <Form.Group className=' mb-3 seccionFormulario'>
                <Form.Label className={!provValida ? 'labelErrorFormulario' : 'labelFormulario'}>Provincia</Form.Label>
                <Select                
                    value={provSeleccionada}
                    onChange={handleSelectChangeProvincia} 
                    defaultValue={{label: 'Provincia', value: 'Provincia'}}
                    options={
                      provincias.map( prov => ({label: prov.nombre, value: prov.id})
                    )
                  }        
                  />
              </Form.Group>

              {/* Select Localidad*/}
              <Form.Group className=' mb-3 seccionFormulario'>
                <Form.Label className={!locValida ? 'labelErrorFormulario' : 'labelFormulario'}>Localidad</Form.Label>
                <Select
                    value={locSeleccionada}
                    onChange={handleSelectChangeLocalidad} 
                    defaultValue={{label: 'Localidad', value: 'Localidad'}}
                    options={
                      localidades.map( loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id})
                      
                    )
                  }
                  />
              </Form.Group>

              {/* Select Productor*/}
              <Form.Group className=' mb-3 seccionFormulario'>
                <Form.Label className={!prodValido ? 'labelErrorFormulario' : 'labelFormulario'}>Productor</Form.Label>
                <Select                
                    value={prodSeleccionado}
                    onChange={handleSelectChangeProductor} 
                    defaultValue={{label: 'Productor', value: 'Productor'}}
                    options={
                      productores.map( prod => ({label: prod.nombre + " " + prod.apellido 
                      + " " + prod.cuit_cuil , value: prod.id})
                    )
                  }

                  />
              </Form.Group>

              {/* Botones */}
              <Form.Group className="seccionFormulario seccionBotonesFormulario margenTop30" controlId="formBotones">
                <Button className="botonCancelarFormulario" variant="secondary"
                  onClick={cancelarFormulario}>
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
            mostrarErrorVencimientoToken &&
            <Error texto={"Su sesión ha expirado"} 
            onConfirm={handleSesionExpirada}/>
        }  
        {
            alertaCampoRegistrado &&
            <Confirm texto={"El campo ha sido registrado correctamente"} 
            onConfirm={handleCerrarAlertaCampoRegistrado}/>
        }
        {
            errorProductoresNoRegistrados &&
            <Error texto={"Para continuar con el proceso, es necesario registrar al menos un productor antes de crear un nuevo campo."} 
            onConfirm={() => {navigate('/productores')}}/>
        } 
      </>    

    )
  }
  else{
    return <NoLogueado/>
  }
    
  }

export default CampoNew