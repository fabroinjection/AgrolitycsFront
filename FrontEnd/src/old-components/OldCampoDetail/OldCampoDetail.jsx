import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import './CampoDetail.css';
import {useEffect, useState} from 'react';
import { campoService } from '../../../../services/campo.service';
import Button from 'react-bootstrap/Button';

import CampoDetailEdit from '../CampoDetailEdit/CampoDetailEdit';
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import { eliminarCampoService } from '../../services/detalleCampo.service';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Cookies from 'js-cookie';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';




function OldCampoDetail() {
  const [ campoDetalle, setCampoDetalle ] = useState(null);
  const { idCampo } = useParams();
  const [ estaEnEdicion, setEstaEnEdicion ] = useState(false);

  const [ mostrarDarDeBaja, setMostrarDarDeBaja ] = useState(false);
  const [ mostrarConfirmacionBaja, setMostrarConfirmacionBaja ] = useState(false);
  
  useEffect(() => {
    const fetchCampoDetalle = async () =>{
      try {
        const { data } = await campoService(idCampo);
        setCampoDetalle(data);
      } catch (error) {
        //
      }
    }

    fetchCampoDetalle();
    }, [])


  let navigate = useNavigate();

  const cerrarConsulta = () =>{
      navigate("/home");
  }

  const handleAlerta = () => {
    setMostrarDarDeBaja(!mostrarDarDeBaja);
  }

  const handleConfirmarDarDeBaja = async (confirm) => {
    if(confirm){
      try {
        await eliminarCampoService(campoDetalle.id);
        setMostrarConfirmacionBaja(true);

      } catch (error) {
        //        
      }
      
    }
    else{
      setMostrarDarDeBaja(!mostrarDarDeBaja);
    }
  }

  const handleBaja = () =>{
    setMostrarConfirmacionBaja(!mostrarConfirmacionBaja);
    navigate("/home");
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
      
            <fieldset className="container mb-3 detalleCampoDet">
              
                <div className="tituloDet">
                    <span className="letraInter">{campoDetalle.nombre}</span>
                </div>
                
      
                {/* Select de Provincia */}
                <div className="mb-3 campoDetDet">
                  <label className="letraInter etiquetaDet">Provincia</label>
                  <Select
                    unstyled
                    className="seleccionablesDet" 
                    isDisabled = {true}
                    defaultValue={{label: campoDetalle.provincia_nombre, value: campoDetalle.provincia_id}}
                  />
                    
                </div>
      
                {/* Select de Localidad */}
                <div className="mb-3 campoDetDet">
                  <label className="letraInter etiquetaDet">Localidad</label>
                  <Select
                    unstyled
                    className="seleccionablesDet" 
                    isDisabled = {true}
                    defaultValue={{label: campoDetalle.localidad_nombre, value: campoDetalle.localidad_id}}
                  />
      
                </div>
      
                {/* Select de Productor */}
                <div className="mb-3 campoDetDet">
                  <label className="letraInter etiquetaDet">Productor</label>
                  <Select
                    unstyled
                    className="seleccionablesDet" 
                    isDisabled = {true}
                    defaultValue={{label: campoDetalle.productor_nombre + "   " + campoDetalle.productor_cuit_cuil, value: campoDetalle.productor_id, data: campoDetalle.productor_cuit_cuil}}
                  />
      
                </div>
                
      
                <div className="mb-3 contenedorBotonesDet">
                    <button type="submit" className="botonesFormDet letraInter" onClick={() => setEstaEnEdicion(true)}>
                      Editar</button>
                    <button className="botonesFormDet letraInter" onClick={cerrarConsulta}>Cerrar</button>
                    
                </div>
      
                <div className="eliminarCentrado">
                  <Button className="botonEliminar" variant="link" onClick={handleAlerta}>
                    Eliminar
                  </Button>
                </div>
                  
                {mostrarDarDeBaja && <Alerta texto="¿Desea eliminar el campo?" nombreBoton="Eliminar"
                onConfirm={handleConfirmarDarDeBaja}/>}

                {mostrarConfirmacionBaja && <Confirm texto="El campo ha sido eliminado correctamente"
                onConfirm={handleBaja}/>}

      
                
            </fieldset>
      
      
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

export default OldCampoDetail