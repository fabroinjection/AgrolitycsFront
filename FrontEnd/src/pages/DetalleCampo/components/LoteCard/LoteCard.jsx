//Componentes
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from "js-cookie";
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Error from '../../../../components/Modals/Error/Error';

//Estilos
import './LoteCard.css'

//Assets
import iconoMapa from "../../../../assets/iconoMapa.png"
import iconoPala from "../../../../assets/iconoPala.png"
import iconoMenu from "../../../../assets/iconoMenu.png"

//Servicios
import { eliminarLoteService } from '../../services/lotesService';
import { renewToken } from '../../../../services/token.service';

//Hooks
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

//Context
import { MostrarMuestrasContext } from '../../../../context/MostrarMuestrasContext';
import { IdLoteTomaMuestrasContext } from '../../../../context/IdLoteTomaMuestrasContext';

function LoteCard(lote){
    //estados para alertas y confirmación
    const [mostrarDarDeBaja, setMostrarDarDeBaja] = useState(false);
    const [mostrarConfirmacionBaja, setMostrarConfirmacionBaja] = useState(false);
    const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

    //variable para manejar la navegación entre rutas de la página
    let navigate = useNavigate();
    
    //variable context
    const [ , setMostrarMuestras ] = useContext(MostrarMuestrasContext);
    const [ , setIdLoteTomaMuestras ] = useContext(IdLoteTomaMuestrasContext);

    const handleConsultarLote = () => {
        //Elimina cookies
        Cookies.remove("idLoteAModificar");
        Cookies.remove("nombreLoteAModificar");
        //Calculo fecha y hora para la duración de 30 mins de la Cookie
        let currentDate = new Date();
        let expirationDate = new Date(currentDate.getTime() + (30 * 60 * 1000));
        Cookies.set("idLoteSeleccionadoAConsultar", lote.lote.id, {expires: expirationDate});
        Cookies.set("nombreLoteSeleccionadoAConsultar", lote.lote.nombre, {expires: expirationDate});
        Cookies.set("haLoteSeleccionadoAConsultar", lote.lote.hectareas, {expires: expirationDate});
        window.location.reload();
    }

    const handleModificarLote = () => {
        //Elimina cookies
        Cookies.remove("idLoteSeleccionadoAConsultar");
        Cookies.remove("nombreLoteSeleccionadoAConsultar");
        Cookies.remove("haLoteSeleccionadoAConsultar");

        //Calculo fecha y hora para la duración de 30 mins de la Cookie
        let currentDate = new Date();
        let expirationDate = new Date(currentDate.getTime() + (30 * 60 * 1000));
        Cookies.set("idLoteAModificar", lote.lote.id , {expires: expirationDate});
        Cookies.set("nombreLoteAModificar", lote.lote.nombre, {expires: expirationDate});
        window.location.reload();
    }

    const handleEliminarLote = () => {
        //Se muestra la alerta de si desea o no eliminar el lote
        setMostrarDarDeBaja(true);
    }

    const handleConfirmarDarDeBajaLote = async (confirm) => {
        if (confirm) {
          try {
            //Se llama al endpoint para eliminar el lote
            await eliminarLoteService(lote.lote.id);

            //Se muestra la confirmación de que se elimnó correctamente
            setMostrarConfirmacionBaja(true);

            //Se elimina cookies asociadas a la interacción con el mapa relacionadas
            Cookies.remove("idLoteSeleccionadoAConsultar");
            Cookies.remove("nombreLoteSeleccionadoAConsultar");
            Cookies.remove("haLoteSeleccionadoAConsultar");
            Cookies.remove("idLoteAModificar");
            Cookies.remove("nombreLoteAModificar");
          } catch (error) {
            if(error.response && error.response.status === 401){
                try {
                    await renewToken();
                    //Se llama al endpoint para eliminar el lote
                    await eliminarLoteService(lote.lote.id);

                    //Se muestra la confirmación de que se elimnó correctamente
                    setMostrarConfirmacionBaja(true);

                    //Se elimina cookies asociadas a la interacción con el mapa relacionadas
                    Cookies.remove("idLoteSeleccionadoAConsultar");
                    Cookies.remove("nombreLoteSeleccionadoAConsultar");
                    Cookies.remove("haLoteSeleccionadoAConsultar");
                    Cookies.remove("idLoteAModificar");
                    Cookies.remove("nombreLoteAModificar");
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
          }
        } else {
            //Se deja de mostrar la alerta
            setMostrarDarDeBaja(!mostrarDarDeBaja);
        }
    };

    const handleBajaLote = () => {
        //Se deja de mostrar la alerta de la confirmación
        setMostrarConfirmacionBaja(!mostrarConfirmacionBaja);
        window.location.reload();
      };

    const handleTomaMuestras = () => {
        //Se eliminan cookies asociadas al mapa
        Cookies.remove("idLoteSeleccionadoAConsultar");
        Cookies.remove("nombreLoteSeleccionadoAConsultar");
        Cookies.remove("haLoteSeleccionadoAConsultar");
        Cookies.remove("idLoteAModificar");
        Cookies.remove("nombreLoteAModificar");

        //Setea para que se muestren las tomas de muestra y se guarde el id del lote
        setMostrarMuestras(true);
        setIdLoteTomaMuestras(lote.lote.id.toString());
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    return(
        <>
            <article className="loteCard">
                <header className="cabeceraLote">                    
                    <strong className="nombreLote">{lote.lote.nombre}</strong>
                    <aside>
                        <button className="botonesLoteCard" onClick={handleConsultarLote}>
                            <img className="iconosLoteCard" src={iconoMapa} alt="" />
                        </button>
                        <button className="botonesLoteCard" onClick={handleTomaMuestras}>
                            <img className="iconosLoteCard" src={iconoPala} alt="" />
                        </button>
                        <Dropdown className="botonesLoteCard">
                            <Dropdown.Toggle variant="transparent" id="dropdown-menu" className='custom-toggle'>
                                <img className="iconosMenuCard" src={iconoMenu} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item className="custom-modificar-item" onClick={handleModificarLote}>
                                    Modificar
                                </Dropdown.Item>
                                <Dropdown.Item className="custom-eliminar-item" onClick={handleEliminarLote}>
                                    Eliminar
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </aside>
                </header>
            </article>

            {mostrarDarDeBaja && (
                <Alerta
                texto="Si elimina el lote, se eliminarán todas sus tomas de muestras asociadas."
                nombreBoton="Eliminar"
                onConfirm={handleConfirmarDarDeBajaLote}
                />
            )}

            {mostrarConfirmacionBaja && (
                <Confirm
                texto="El lote ha sido eliminado correctamente"
                onConfirm={handleBajaLote}
                />
            )}

            {mostrarErrorVencimientoToken &&
                <Error texto={"Su sesión ha expirado"} 
                onConfirm={handleSesionExpirada}/>
            }  
        </>
    )

}

export default LoteCard;