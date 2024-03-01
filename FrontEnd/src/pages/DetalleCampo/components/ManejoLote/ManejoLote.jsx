import React from "react";

import './ManejoLote.css';
import '../../../../components/Estilos/estilosFormulario.css';
import { Button } from 'react-bootstrap';
import Error from "../../../../components/Modals/Error/Error";
import Cookies from "js-cookie";

import Form from 'react-bootstrap/Form';

//import hooks
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//import context
import { useContext } from "react";
import { MapLayersContext } from "../../../../context/MapLayersContext";
import { HectareasContext } from "../../../../context/HectareasContext";

//import services
import { nuevoLoteService } from "../../services/lotesService";
import { modificarLoteService } from "../../services/lotesService";
import { renewToken } from "../../../../services/token.service";

//import utilities
import { toast } from "react-toastify";


function ManejoLote({ cancelarRegistro, campo, registrar,
    idLoteAModificar = undefined }){

    let navigate = useNavigate();

    //contexto mapa
    const [ mapLayers ] = useContext(MapLayersContext);

    //contexto hectareas
    const [ hectareas ] = useContext(HectareasContext);


    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    //estados para el lote a modificar
    const [ nombreLote, setNombreLote ] = useState(Cookies.get("nombreLoteAModificar"));
    

    const { register, formState: {errors} , handleSubmit, reset } = useForm();

    // funcion toast para alerta nombre vacío
    const mostrarErrorNombre = () => {
        toast.error('Ingrese un nombre de lote', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
        }); 
    }

    // funcion toast para alerta nombre menor 5 car
    const mostrarErrorNombre5Car = () => {
        toast.error('Ingrese un nombre de lote mayor a 5 caracteres', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
        }); 
    }

    // funcion toast para alerta nombre mayor 20 car
    const mostrarErrorNombre20Car = () => {
        toast.error('Ingrese un nombre de lote menor a 20 caracteres', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
        }); 
    }

    // funcion toast para alerta Debe delimitar un lote
    const mostrarErrorUnMapa = () => {
        toast.error('Debe delimitar un lote', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
        }); 
    }

    // funcion toast para alerta Debe delimitar solamente un lote
    const mostrarErrorVariosMapas = () => {
        toast.error('Debe ingresar un solo lote', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
        }); 
    }

    // funcion toast para alerta nombre de lote ya existente
    const mostrarErrorNombreExistente = () => {
        toast.error('El nombre de lote que intenta registrar ya existe para este campo', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
        }); 
    }

    const handleClickCancelar = () => {
        reset();
        if(idLoteAModificar){
            Cookies.remove("idLoteAModificar");
            Cookies.remove("nombreLoteAModificar");
            setNombreLote();
        }
        cancelarRegistro();
    }

    const registrarLote = async (form) => {
        if(idLoteAModificar === undefined){
            if(mapLayers.length === 0 ){
                mostrarErrorUnMapa();
            }
            else if(mapLayers.length > 1){
                mostrarErrorVariosMapas();
            }
            else{
                let coordenadas = "";
                let lote;
                try {
                    mapLayers[0].latlngs.forEach((latlng, index) => {
                        const latitud = latlng.lat
                        const longitud = latlng.lng
                        coordenadas += `{${latitud},${longitud}}`;
                        if (index < mapLayers[0].latlngs.length - 1) {
                          coordenadas += ",";
                        }
                      });

                    lote = {
                        nombre: form.nombre,
                        campo_id: campo.id,
                        coordenadas: coordenadas,
                        hectareas: hectareas
                    }
                } catch (error) {
                    mapLayers[0].latlngs[0].forEach((latlng, index) => {
                        const latitud = latlng.lat;
                        const longitud = latlng.lng;
                        coordenadas += `{${latitud},${longitud}}`;
                    
                        if (index < mapLayers[0].latlngs[0].length - 1) {
                            coordenadas += ",";
                        }
                    });
                    
                    lote = {
                        nombre: form.nombre,
                        campo_id: campo.id,
                        coordenadas: coordenadas,
                        hectareas: hectareas
                    }
                }
                
                try {
                    await nuevoLoteService(lote);
                    reset();
                    registrar(); 
                } catch (error) {
                    if(error.response && error.response.status === 400){
                        mostrarErrorNombreExistente();
                    }
                    else if(error.response && error.response.status === 401){
                        try {
                          await renewToken();
                          await nuevoLoteService(lote);
                          reset();
                          registrar(); 
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                        }
                      }
                }
    
            }       
        }
        else{
            if(mapLayers.length > 1){
                mostrarErrorVariosMapas();
            }
            else if(mapLayers.length === 0){
                const lote = {
                    nombre: form.nombre,
                    campo_id: campo.id,
                    coordenadas: "prev",
                    hectareas: -1
                }
                try {
                    await modificarLoteService(campo.id, idLoteAModificar, lote)
                    reset();
                    Cookies.remove("idLoteAModificar");
                    Cookies.remove("nombreLoteAModificar");
                    registrar(); 
                } catch (error) {
                    if(error.response && error.response.status === 403){
                        mostrarErrorNombreExistente();
                    }
                    else if(error.response && error.response.status === 401){
                        try {
                          await renewToken();
                          await modificarLoteService(campo.id, idLoteAModificar, lote)
                          reset();
                          Cookies.remove("idLoteAModificar");
                          Cookies.remove("nombreLoteAModificar");
                          registrar(); 
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          
                          }
                        }
                      }
                }
            }
            else{
                let coordenadas = "";
                mapLayers.forEach((coordenadasPoligono, index) => {
                const latlngs = coordenadasPoligono[0];
                latlngs.forEach((latlng, i) => {
                    const { lat, lng } = latlng;
                    coordenadas += `{${lat},${lng}}`;
                    if (i < latlngs.length - 1) {
                    coordenadas += ",";
                    }
                });
                if (index < mapLayers.length - 1) {
                    coordenadas += ",";
                }
                });
                  
                const lote = {
                    nombre: form.nombre,
                    campo_id: campo.id,
                    coordenadas: coordenadas,
                    hectareas: hectareas
                }
                try {
                    await modificarLoteService(campo.id, idLoteAModificar, lote)
                    reset();
                    Cookies.remove("idLoteAModificar");
                    Cookies.remove("nombreLoteAModificar");
                    registrar(); 
                } catch (error) {
                    if(error.response && error.response.status === 403){
                        mostrarErrorNombreExistente();   
                    }
                    else if(error.response && error.response.status === 401){
                        try {
                          await renewToken();
                          await modificarLoteService(campo.id, idLoteAModificar, lote)
                          reset();
                          Cookies.remove("idLoteAModificar");
                          Cookies.remove("nombreLoteAModificar");
                          registrar(); 
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          
                          }
                        }
                      }
                    
                }
            }
        }
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    useEffect(() => {
        if (errors.nombre?.type === "required") {
            mostrarErrorNombre();
        } else if (errors.nombre?.type === "minLength") {
            mostrarErrorNombre5Car();
        } else if (errors.nombre?.type === "maxLength") {
            mostrarErrorNombre20Car();
        }
    }, [errors.nombre]);
    

    return(
        <Form className='lote-section' onSubmit={handleSubmit(registrarLote)}>
                <Form.Group className="nuevoNombreLote">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" defaultValue={idLoteAModificar && nombreLote}
                    {...register("nombre", {
                        required: true, minLength: 5, maxLength: 20
                    })}
                    />
                </Form.Group>

            
            
            <strong className='infoNuevoLote'> 
                Delimite su lote en el mapa
            </strong>

            <Form.Group className='botonesNuevoLote'>
                <Button type="submit"
                    className='botonConfirmacionFormulario' variant="secondary" >
                    Guardar
                </Button>
                <Button className='botonCancelarFormulario' variant="secondary" 
                    onClick={handleClickCancelar}>
                    Cancelar
                </Button>
            </Form.Group>
            {
                mostrarErrorVencimientoToken && <Error texto={"Su sesión ha expirado"} onConfirm={handleSesionExpirada}/>
            }  
        </Form>
    );
}

export default ManejoLote;