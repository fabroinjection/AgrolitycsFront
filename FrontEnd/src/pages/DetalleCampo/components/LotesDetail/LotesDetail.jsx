import LoteoMapa from "../../../../components/Maps/LoteoMapa/LoteoMapa";
import './LotesDetail.css';
import InfoLotes from "../InfoLotes/InfoLotes";
import ManejoLote from '../ManejoLote/ManejoLote';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Cookies from "js-cookie";
import VerLote from "../VerLote/VerLote";
import TomaDeMuestraList from "../TomaDeMuestraList/TomaDeMuestraList";
import MapaSubmuestras from "../../../../components/Maps/MapaSubmuestras/MapaSubmuestras"
import InfoSubmuestra from "../InfoSubmuestra/InfoSubmuestra";
import Error from "../../../../components/Modals/Error/Error";

//import hooks
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

//import services
import { listaLotesService } from "../../services/lotesService";
import { renewToken } from "../../../../services/token.service";

//import context
import { MapLayersProvider } from '../../../../context/MapLayersContext';
import { PolygonCoordsProvider } from '../../../../context/PolygonCoordsContext';
import { HectareasProvider } from '../../../../context/HectareasContext';
import { MostrarMuestrasContext } from "../../../../context/MostrarMuestrasContext";
import { IdLoteTomaMuestrasContext } from "../../../../context/IdLoteTomaMuestrasContext";
import { EstadoSubMuestrasContext } from "../../../../context/EstadoSubMuestrasContext";


function LotesDetail({ campo, handleModificarCampo, handleDarDeBajaCampo }) {
  const [estaEnRegistro, setEstaEnRegistro] = useState(false);
  const [mostrarConfirmRegistroLote, setMostrarConfirmRegistroLote] = useState(false);
  const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);
  const [hayLoteSeleccionadoConsulta, setHayLoteSeleccionadoConsulta] = useState(Cookies.get("idLoteSeleccionadoAConsultar"));
  const [hayLoteAModificar, setHayLoteAModificar] = useState(Cookies.get("idLoteAModificar"));
  const [ haySubmuestras ] = useContext(EstadoSubMuestrasContext);

  const [lotes, setLotes] = useState(null);

  //variable context
  const [ mostrarMuestras ] = useContext(MostrarMuestrasContext);
  const [ idLoteTomaMuestras ] = useContext(IdLoteTomaMuestrasContext);

  let navigate = useNavigate();

  const seEstaRegistrandoLote = () => {
    setEstaEnRegistro(true);
  };

  const seRegistraLote = () => {
    setEstaEnRegistro(false);
    Cookies.remove("nombreLoteAModificar");
    setMostrarConfirmRegistroLote(true);
  };

  const handleRegistrarLote = (confirm) => {
    if (confirm) {
      window.location.reload();
    }
  };

  const seCancelaRegistroLote = () => {
    setEstaEnRegistro(false);
    window.location.reload();
  };

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const listaLotes = await listaLotesService(campo.id);
        setLotes(listaLotes.data);
      } catch (error) {
        if(error.response && error.response.status === 401){
          try {
            await renewToken();
            const listaLotes = await listaLotesService(campo.id);
            setLotes(listaLotes.data);
          } catch (error) {
            if(error.response && error.response.status === 401){
              setMostrarErrorVencimientoToken(true);
            }
          }
        }
      }
    };

    fetchLotes();
  }, []);

  const handleSesionExpirada = () =>{
    setMostrarErrorVencimientoToken(false);
    navigate("/");
    window.localStorage.removeItem('loggedAgroUser');
  }

  useEffect(() => {
    // Código para que la cookie se verifique y borre si no hay un lote seleccionado a consultar
    if(Cookies.get("idLoteSeleccionadoAConsultar")){
      setHayLoteSeleccionadoConsulta(Cookies.get("idLoteSeleccionadoAConsultar"));
    }
    else{
      setHayLoteSeleccionadoConsulta(undefined);
    }
  })

  useEffect(() => {
    // Código para que la cookie se verifique y borre si no hay un lote seleccionado a consultar
    if(Cookies.get("idLoteAModificar")){
      setHayLoteAModificar(Cookies.get("idLoteAModificar"));
    }
    else{
      setHayLoteAModificar(undefined);
    }
  })
  
  if(!mostrarMuestras){
    return (
      <>
        <PolygonCoordsProvider>
          <MapLayersProvider>
            <HectareasProvider>
              <div className="containerNuevoLote">
                <article className="info-sectionNuevoLote">
                  {lotes ?                 
                    <InfoLotes
                      actualizarRegistrarLote={seEstaRegistrandoLote}
                      campo={campo}
                      handleModificarCampo={handleModificarCampo}
                      handleDarBajaCampo={handleDarDeBajaCampo}
                      lotes={lotes}
                    />
                    :
                    <InfoLotes
                      actualizarRegistrarLote={seEstaRegistrandoLote}
                      campo={campo}
                      handleModificarCampo={handleModificarCampo}
                      handleDarBajaCampo={handleDarDeBajaCampo}
                      lotes={[]}
                    />
                  }

                </article>
                <div className="map-sectionNuevoLote">

                  {hayLoteSeleccionadoConsulta ? <VerLote />
                  : estaEnRegistro ? (
                    <ManejoLote
                      cancelarRegistro={seCancelaRegistroLote}
                      campo={campo}
                      registrar={seRegistraLote}
                    />
                  ) : null}

                  {hayLoteAModificar 
                  ? <ManejoLote 
                      cancelarRegistro={seCancelaRegistroLote}
                      campo={campo}
                      registrar={seRegistraLote}
                      idLoteAModificar={hayLoteAModificar}
                    />
                  : null

                  }

                  {lotes ?
                    lotes.length !== 0 ? (
                        <LoteoMapa
                          habilitado={estaEnRegistro}
                          registro={true}
                          campo={campo}
                          lotes={lotes}
                        />
                      ) :
                      <LoteoMapa
                        habilitado={estaEnRegistro}
                        registro={true}
                        campo={campo}
                        lotes={lotes}
                      />
                    :
                    <div>
                      Cargando...
                    </div>
                  }

                </div>
              </div>
            </HectareasProvider>
          </MapLayersProvider>
        </PolygonCoordsProvider>


        {mostrarConfirmRegistroLote && (
          <Confirm
            texto={hayLoteAModificar ? "El lote se ha modificado correctamente" : "El lote ha sido registrado correctamente"}
            onConfirm={handleRegistrarLote}
          />
        )}

        {mostrarErrorVencimientoToken &&
          <Error texto={"Su sesión ha expirado"} 
          onConfirm={handleSesionExpirada}/>
        }  
      </>
    );
  }
  else{
    return(
      <div className="containerNuevoLote">
        <article className="info-sectionNuevoLote">
          <InfoLotes
            actualizarRegistrarLote={seEstaRegistrandoLote}
            campo={campo}
            handleModificarCampo={handleModificarCampo}
            handleDarBajaCampo={handleDarDeBajaCampo}
            lotes={lotes}
          />

        </article>
        <div className="map-sectionNuevoLote">
          {haySubmuestras ?
          <>
            <InfoSubmuestra tomaMuestra={haySubmuestras}/>
            <MapaSubmuestras/> 
          </>
          : 
          <TomaDeMuestraList idLote={idLoteTomaMuestras}/>}

        </div>

        {mostrarErrorVencimientoToken &&
          <Error texto={"Su sesión ha expirado"} 
          onConfirm={handleSesionExpirada}/>
        }  

      </div>


    )
  }

}

export default LotesDetail;