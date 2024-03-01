// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';

// importar componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Select from 'react-select';
import Error from '../../../../components/Modals/Error/Error';

// importar hooks
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

// importar servicios
import { provinciasServiceSinAuth } from '../../../../services/provincias.service';
import { localidadesServiceSinAuth } from '../../../../services/localidades.service';

// import utilities
import { toast } from 'react-toastify';

function RegistrarUsuarioDos({ usuario, actualizarUsuario, avanzarEtapa, volverEtapa }){

    //variables para el form
    const [ provincia, setProvincia ] = useState({label: usuario.provincia, value: usuario.idProvincia});
    const [ localidad, setLocalidad ] = useState({label: usuario.localidad, value: usuario.idLocalidad, data:usuario.idProvincia});

    //variables para las consultas
    const [ provincias, setProvincias ] = useState([]);
    const [ localidades, setLocalidades ] = useState([]);

    //alertas errores consultas
    const [ errorConsultaProvincias, setErrorConsultaProvincias ] = useState(false);
    const [ errorConsultaLocalidades, setErrorConsultaLocalidades ] = useState(false);

    //variables para errores del form
    const [ provinciaVacio, setProvinciaVacio ] = useState(false);
    const [ LocalidadVacia, setLocalidadVacia ] = useState(false);
    const [ localidadNoValida, setLocalidadNoValida ] = useState(false);

    // funcion toast para alerta provincia vacía
    const mostrarErrorProvinciaVacia = () => {
        toast.error('Se debe ingresar una provincia', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta localidad vacía
    const mostrarErrorLocalidadVacia = () => {
        toast.error('Se debe ingresar una localidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta localidad no válida
    const mostrarErrorLocalidadNoValida = () => {
        toast.error('Se debe ingresar una localidad válida para la provincia ingresada', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }


    const { handleSubmit, reset } = useForm();

    const guardarEtapa = () => {
        const validacion = validarForm();
        if (validacion) {
            actualizarUsuario({ 
                provincia: provincia.label, 
                idProvincia: provincia.value,
                localidad: localidad.label,
                idLocalidad: localidad.value
            });
            reset();
            avanzarEtapa();
        }
        
    }

    const volver = () => {
        volverEtapa();
    }

    useEffect(() => {
        const fetchProvincias = async () => {
            try {
                const { data } = await provinciasServiceSinAuth();
                setProvincias(data);
            } catch (error) {
                if (error.response) {
                    setErrorConsultaProvincias(true);
                }
            }
        }
        fetchProvincias();
    }, [])

    useEffect(() => {
        if (provincia.value !== 0) {
            const fetchLocalidades = async () => {
                try {
                    const { data } = await localidadesServiceSinAuth(provincia.value);
                    setLocalidades(data);
                } catch (error) {
                    if (error.response) {
                        setErrorConsultaLocalidades(true);
                    }
                }
            }
            fetchLocalidades();
        }
        
    }, [provincia])

    const handleChangeProvincia = (opcion) => {
        setProvincia(opcion);
    }

    const handleChangeLocalidad = (opcion) => {
        setLocalidad(opcion);
    }

    const validarForm = () => {
        if (provincia.value === 0) {
            setProvinciaVacio(true);
            mostrarErrorProvinciaVacia();
            return false;
        } else {
            setProvinciaVacio(false);
        }

        if (localidad.value === 0){
            setLocalidadVacia(true);
            mostrarErrorLocalidadVacia();
            return false;
        } else {
            if (localidad.data !== provincia.value) {
                setLocalidadVacia(false);
                setLocalidadNoValida(true);
                mostrarErrorLocalidadNoValida();
                return false;
            } else {
                setLocalidadNoValida(false);
                setLocalidadVacia(false);
            }
        }

        return true
    }

    return(
        <>
           <Form className='formularioOscuro formCentrado transicionIzqDer' onSubmit={handleSubmit(guardarEtapa)}>
                <div className='seccionTitulo'>
                    <span className='tituloForm'>¿De dónde eres?</span>
                </div>
                <div>
                    <span>Algunos datos más.</span>
                </div>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={provinciaVacio ? 'labelErrorFormulario' : 'labelFormulario'}>Provincia*</Form.Label>
                    <Select
                        value={provincia}
                        onChange={handleChangeProvincia}
                        options={
                            provincias.map( prov => ({label: prov.nombre, value: prov.id}) )
                        }
                    />

                </Form.Group>

                <Form.Group className='seccionFormulario'>
                    <Form.Label className={(LocalidadVacia || localidadNoValida) ? 'labelErrorFormulario' : 'labelFormulario'}>Localidad*</Form.Label>
                    <Select
                        value={localidad}
                        onChange={handleChangeLocalidad}
                        options={
                            localidades.map( loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id}) )
                        }
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
                        type='submit' 
                        className='botonConfirmacionFormulario'
                    >
                        Siguiente
                    </Button>
                </Form.Group>
           </Form> 

            {
                errorConsultaProvincias &&
                <Error texto={"Ha ocurrido un error trayendo las provincias, intente de nuevo más tarde"} 
                onConfirm={() => setErrorConsultaProvincias(false)}/>
            }

            {
                errorConsultaLocalidades &&
                <Error texto={"Ha ocurrido un error trayendo las localidades, intente de nuevo más tarde"} 
                onConfirm={() => setErrorConsultaLocalidades(false)}/>
            }
        </>
    );
}

export default RegistrarUsuarioDos;