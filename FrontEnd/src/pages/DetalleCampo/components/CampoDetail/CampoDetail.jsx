//import hooks
import { useNavigate, useParams } from 'react-router-dom';
import {useEffect, useState} from 'react';

//import styles y utilities
import CampoDetailEdit from '../CampoDetailEdit/CampoDetailEdit';

//import components
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import Cookies from 'js-cookie';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Error from '../../../../components/Modals/Error/Error';
import LotesDetail from '../LotesDetail/LotesDetail';

//import services
import { eliminarCampoService } from '../../services/detalleCampo.service';
import { campoService } from '../../../../services/campo.service';
import { renewToken } from '../../../../services/token.service';

//Context
import { MostrarMuestrasProvider } from '../../../../context/MostrarMuestrasContext';
import { IdLoteTomaMuestrasProvider } from '../../../../context/IdLoteTomaMuestrasContext';
import { ModoTomaDeMuestraAMCProvider } from '../../../../context/ModoTomaDeMuestraAMCContext'
import { EstadoSubMuestrasProvider } from '../../../../context/EstadoSubMuestrasContext';
import { CantidadSubMuestrasProvider } from '../../../../context/CantidadSubMuestrasContext';

function CampoDetail() {
  const [ campoDetalle, setCampoDetalle ] = useState(null);
  const { idCampo } = useParams();
  const [ estaEnEdicion, setEstaEnEdicion ] = useState(false);
  const [mostrarDarDeBaja, setMostrarDarDeBaja] = useState(false);
  const [mostrarConfirmacionBaja, setMostrarConfirmacionBaja] = useState(false);
  const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

  let navigate = useNavigate();

  const handleAlerta = () => {
    setMostrarDarDeBaja(true);
  };

  const handleSesionExpirada = () =>{
    setMostrarErrorVencimientoToken(false);
    window.localStorage.removeItem('loggedAgroUser');
    navigate("/");
  }

  const handleConfirmarDarDeBaja = async (confirm) => {
    if (confirm) {
      try {
        await eliminarCampoService(campoDetalle.id);
        setMostrarConfirmacionBaja(true);
        Cookies.remove("idLoteSeleccionadoAConsultar");
        Cookies.remove("nombreLoteSeleccionadoAConsultar");
        Cookies.remove("haLoteSeleccionadoAConsultar");
        Cookies.remove("idLoteAModificar");
        Cookies.remove("nombreLoteAModificar");
      } catch (error) {
        if(error.response && error.response.status === 401){
          try {
            await renewToken();
            await eliminarCampoService(campoDetalle.id);
          } catch (error) {
            if(error.response && error.response.status === 401){
              setMostrarErrorVencimientoToken(true);
            }
          }
        }
      }
      }
    else {
      setMostrarDarDeBaja(!mostrarDarDeBaja);
    }
  };

  const handleBaja = () => {
    setMostrarConfirmacionBaja(!mostrarConfirmacionBaja);
    navigate("/home");
  };

  
  useEffect(() => {
    const fetchCampoDetalle = async () =>{
      try {
        const { data } = await campoService(idCampo);
        setCampoDetalle(data);
      } catch (error) {
        if(error.response && error.response.status === 401){
          try {
            await renewToken();
            const { data } = await campoService(idCampo);
            setCampoDetalle(data);
          } catch (error) {
            if(error.response && error.response.status === 401){
              setMostrarErrorVencimientoToken(true);
            }
          }
        }
      }
    }

    fetchCampoDetalle();
    }, [])


  const handleEdicionCampo = () => {
    setEstaEnEdicion(true);
    Cookies.remove("idLoteSeleccionadoAConsultar");
    Cookies.remove("nombreLoteSeleccionadoAConsultar");
    Cookies.remove("haLoteSeleccionadoAConsultar");
    Cookies.remove("idLoteAModificar");
    Cookies.remove("nombreLoteAModificar");
  }

  if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
    if(!estaEnEdicion){
      if(!campoDetalle){
        return <div>Cargando...</div>
      }
      else{
        return (
          <>
            <NavbarBootstrap/>
            <MostrarMuestrasProvider>
              <IdLoteTomaMuestrasProvider>
                <ModoTomaDeMuestraAMCProvider>
                  <EstadoSubMuestrasProvider>
                    <CantidadSubMuestrasProvider>
                      <LotesDetail campo={campoDetalle} handleModificarCampo={handleEdicionCampo}
                      handleDarDeBajaCampo={handleAlerta}/>
                    </CantidadSubMuestrasProvider>
                  </EstadoSubMuestrasProvider>
                </ModoTomaDeMuestraAMCProvider>
              </IdLoteTomaMuestrasProvider>
            </MostrarMuestrasProvider>
            
      
            {mostrarDarDeBaja && (
              <Alerta
                texto="Si elimina el campo, se borrará toda la información asociada al mismo."
                nombreBoton="Eliminar"
                onConfirm={handleConfirmarDarDeBaja}
              />
            )}

            {mostrarConfirmacionBaja && (
              <Confirm
                texto="El campo ha sido eliminado correctamente"
                onConfirm={handleBaja}
              />
            )}

            {mostrarErrorVencimientoToken && 
              <Error 
              texto={"Su sesión ha expirado"} 
              onConfirm={handleSesionExpirada}/>
            }
            
          </>
        )
      }
    }
    else{
      return <CampoDetailEdit campo={campoDetalle}/>
    }
  }
  else{
    return <NoLogueado/>
  }
}

export default CampoDetail