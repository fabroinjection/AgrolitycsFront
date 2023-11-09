//import components
import NavbarBootstrap from "../../../../components/Navbar/Navbar.components";

//import hooks
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

//import services
import { buscarAnalisisService } from "../../services/analisis.service";
import { renewToken } from "../../../../services/token.service";
import { buscarTomaMuestraAsociadaService } from "../../../../services/toma_muestra.service";

//import components
import Error from "../../../../components/Modals/Error/Error";
import NoLogueado from "../../../../components/Modals/NoLogueado/NoLogueado";
import AnalisisCompleto from "../AnalisisCompleto/AnalisisCompleto";
import AnalisisBasico from "../AnalisisBasico/AnalisisBasico";
import AnalisisAguaUtil from "../AnalisisAguaUtil/AnalisisAguaUtil";

//import contexts
import { HayAnalisisContext } from "../../../../context/HayAnalisisContext";


function Analisis() {

  const { idTomaMuestra } = useParams();
  let navigate = useNavigate();

  //variable para ver si hay analisis seleccionado o es un usuario intentando combinar numeros
  const [ hayAnalisis ] = useContext(HayAnalisisContext);
  const [ alertaAnalisisSeleccionado, setAlertaAnalisisSeleccionado ] = useState(false);
  
  //varibale para guardar el analisis de la toma de muestra
  const [ analisis, setAnalisis ] = useState();

  //variable para guardar la toma de muestra
  const [ tomaDeMuestra, setTomaDeMuestra ] = useState();

  //variable para el error de vencimiento token
  const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

  const renovarToken = async () => {
    await renewToken();
  }

  const handleSesionExpirada = () =>{
    setMostrarErrorVencimientoToken(false);
    window.localStorage.removeItem('loggedAgroUser');
    navigate("/");
  }

  const handleAnalisisNoSeleccionado = () => {
    setAlertaAnalisisSeleccionado(false);
    navigate("/home");
  }

  useEffect(() => {
    if(!hayAnalisis){
      setAlertaAnalisisSeleccionado(true);
    }
  }, [hayAnalisis])

  useEffect(() => {
    if(idTomaMuestra){
      const fetchAnalisis = async () => {
        try {
          const { data } = await buscarAnalisisService(idTomaMuestra);
          setAnalisis(data);
        } catch (error) {
          if(error.response && error.response.status === 401){
            try {
              renovarToken();
              const { data } = await buscarAnalisisService(idTomaMuestra);
              setAnalisis(data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                setMostrarErrorVencimientoToken(true);
              }
            }
          }
        }     
      }   
      fetchAnalisis();
    }

  }, [idTomaMuestra])

  useEffect(() => {
    if(idTomaMuestra){
      const fetchTomaMuestra = async () => {
        try {
          const { data } = await buscarTomaMuestraAsociadaService(idTomaMuestra);
          setTomaDeMuestra(data);
        } catch (error) {
          if(error.response && error.response.status === 401){
            try {
              renovarToken();
              const { data } = await buscarTomaMuestraAsociadaService(idTomaMuestra);
              setTomaDeMuestra(data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                setMostrarErrorVencimientoToken(true);
              }
            }
          }
        }     
      }   
      fetchTomaMuestra();
    }

  }, [idTomaMuestra])

  if(window.localStorage.getItem('loggedAgroUser')){
    if(hayAnalisis){
      if(analisis && tomaDeMuestra){
        if(analisis.length === 0){
          if(hayAnalisis == "Completo"){
            return (
              <>
                {/* Registrar Análisis Completo */}
                <NavbarBootstrap/>
                <AnalisisCompleto tomaDeMuestra={tomaDeMuestra} fechaTomaMuestra={tomaDeMuestra.fecha}/>
                {mostrarErrorVencimientoToken && 
                      <Error 
                      texto={"Su sesión ha expirado"} 
                      onConfirm={handleSesionExpirada}/>
                }
              </>
            );
          }
          else if(hayAnalisis == "Básico"){
            return (
              <>
                {/* Registar Análisis Básico */}
                <NavbarBootstrap/>
                <AnalisisBasico tomaDeMuestra={tomaDeMuestra} fechaTomaMuestra={tomaDeMuestra.fecha}/>
                {mostrarErrorVencimientoToken && 
                      <Error 
                      texto={"Su sesión ha expirado"} 
                      onConfirm={handleSesionExpirada}/>
                }
              </>
            );
          }
          else{
            return (
              <>
                {/* Registar Análisis Agua Útil */}
                <NavbarBootstrap/>
                <AnalisisAguaUtil tomaDeMuestra={tomaDeMuestra} fechaTomaMuestra={tomaDeMuestra.fecha}/>
                {mostrarErrorVencimientoToken && 
                      <Error 
                      texto={"Su sesión ha expirado"} 
                      onConfirm={handleSesionExpirada}/>
                }
              </>
            );
          }
          
        }
        else{
          if(hayAnalisis === "Básico") {
            return (
              <>
                {/* Consultar y Modificar Análisis Básico */}
                <NavbarBootstrap/>
                <AnalisisBasico tomaDeMuestra={tomaDeMuestra} analisisBasico={analisis[0]}/>
                {mostrarErrorVencimientoToken && 
                      <Error 
                      texto={"Su sesión ha expirado"} 
                      onConfirm={handleSesionExpirada}/>
                }
              </>
            );
          }
          else if (hayAnalisis === "Completo") {
            return(
              <>
                {/* Consultar y Modificar Análisis Completo */}
                <NavbarBootstrap/>
                <AnalisisCompleto tomaDeMuestra={tomaDeMuestra} analisisCompleto={analisis[0]}/>
                {mostrarErrorVencimientoToken && 
                      <Error 
                      texto={"Su sesión ha expirado"} 
                      onConfirm={handleSesionExpirada}/>
                }
              </>
            )
          }
          else{
            return(
              <>
                {/* Consultar y Modificar Análisis Agua Útil */}
                <NavbarBootstrap/>
                <AnalisisAguaUtil tomaDeMuestra={tomaDeMuestra} analisisAguaUtil={analisis[0]}/>
                {mostrarErrorVencimientoToken && 
                      <Error 
                      texto={"Su sesión ha expirado"} 
                      onConfirm={handleSesionExpirada}/>
                }
              </>
            )
          }

        }

      }
      else{
        <>
          <NavbarBootstrap/>
          <div>Cargando...</div>
        </>
      }
        
      }
    else{
      return(
        <>
          {alertaAnalisisSeleccionado && <Error texto={"No hay un analisis seleccionado"} onConfirm={handleAnalisisNoSeleccionado}/>}
        </>
      )
      
    }
  }
  else{
    return(
      <NoLogueado/>
    )
  }
}
  export default Analisis;