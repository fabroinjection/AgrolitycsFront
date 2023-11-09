import React from "react";

import './ManejoLote.css';
import { Button } from 'react-bootstrap';
import Error from "../../../../components/Modals/Error/Error";
import Cookies from "js-cookie";

//import hooks
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//import context
import { useContext } from "react";
import { MapLayersContext } from "../../../../context/MapLayersContext";
import { HectareasContext } from "../../../../context/HectareasContext";

//import services
import { nuevoLoteService } from "../../services/lotesService";
import { modificarLoteService } from "../../services/lotesService";
import { renewToken } from "../../../../services/token.service";



function ManejoLote({ cancelarRegistro, campo, registrar,
    idLoteAModificar = undefined }){

    let navigate = useNavigate();

    //contexto mapa
    const [ mapLayers ] = useContext(MapLayersContext);

    //contexto hectareas
    const [ hectareas ] = useContext(HectareasContext);

    //estado cantidad de lotes marcados
    const [ mostrarAlertaUnMapa, setMostrarAlertaUnMapa ] = useState(false);
    const [ mostrarAlertaVariosMapas, setMostrarAlertaVariosMapas ] = useState(false);

    //estado mismo nombre de lote
    const [ mostrarError400, setMostrarError400 ] = useState(false);
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    //estados para el lote a modificar
    const [ nombreLote, setNombreLote ] = useState(Cookies.get("nombreLoteAModificar"));
    

    const { register, formState: {errors} , handleSubmit, reset } = useForm();

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
                setMostrarAlertaUnMapa(true);
            }
            else if(mapLayers.length > 1){
                setMostrarAlertaVariosMapas(true);
            }
            else{
                let coordenadas = "";
                mapLayers[0].latlngs.forEach((latlng, index) => {
                    const latitud = latlng.lat
                    const longitud = latlng.lng
                    coordenadas += `{${latitud},${longitud}}`;
                    if (index < mapLayers[0].latlngs.length - 1) {
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
                    await nuevoLoteService(lote);
                    reset();
                    registrar(); 
                } catch (error) {
                    if(error.response && error.response.status === 400){
                        setMostrarError400(true);
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
                setMostrarAlertaVariosMapas(true);
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
                        setMostrarError400(true);
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
                        setMostrarError400(true);   
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
    

    return(
        <form className='lote-section' onSubmit={handleSubmit(registrarLote)}>
            <div className="nuevoNombreLote">
                <label htmlFor="">Nombre</label>
                <input type="text" className='ingresoNombreLote' defaultValue={idLoteAModificar && nombreLote}
                {...register("nombre", {
                    required: true, minLength: 5, maxLength: 20
                })}/>
                <div className="alerta">
                    {
                        errors.nombre?.type === "required" && (
                            <span className="campoVacio">
                                * Ingrese un nombre de lote
                            </span>
                        )
                    }
                    {
                        errors.nombre?.type === "minLength" && (
                            <span className="campoVacio">
                                El nombre de lote debe tener como mínimo 5 caracteres.
                            </span>
                        )
                    }
                    {
                        errors.nombre?.type === "maxLength" && (
                            <span className="campoVacio">
                                El nombre de lote debe tener como máximo 20 caracteres.
                            </span>
                        )
                    }
                </div>

            </div>
            <strong className='infoNuevoLote'> 
                Delimite su lote en el mapa
            </strong>
            <div className='botonesNuevoLote'>
                <Button type="submit"
                className='estiloBotonLote btnGuardarLote' variant="secondary" >
                    Guardar
                </Button>
                <Button className='estiloBotonLote btnCancelarLote' variant="secondary" 
                onClick={handleClickCancelar}>
                    Cancelar
                </Button>
            </div>
            {
                mostrarAlertaVariosMapas && <Error texto="Debe ingresar un solo lote" />
            }
            {
                mostrarAlertaUnMapa && <Error texto="Debe delimitar un lote" />
            }
            {
                mostrarError400 && <Error texto="Debe ingresar un nombre de lote no existente para este campo"/>
            }
            {
                mostrarErrorVencimientoToken && <Error texto={"Su sesión ha expirado"} onConfirm={handleSesionExpirada}/>
            }  
        </form>
    );
}

export default ManejoLote;