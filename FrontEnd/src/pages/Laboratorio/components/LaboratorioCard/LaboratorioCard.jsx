//Estilos
import './LaboratorioCard.css'

//Imagenes iconos
import iconoBorrar from '../../../../assets/iconoBorrar.png';
import iconoTuboEnsayo from '../../../../assets/iconoTuboEnsayo.png';

//import hooks
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import components
import LaboratorioAMC from '../LaboratorioAMC/LaboratorioAMC';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Error from '../../../../components/Modals/Error/Error';
import Stack from 'react-bootstrap/Stack';

// import services
import { eliminarLaboratorioService } from '../../services/laboratorio.service';
import { renewToken } from '../../../../services/token.service';
import Confirm from '../../../../components/Modals/Confirm/Confirm';

function LaboratorioCard({ laboratorio, accionActualizarLista }){

    let navigate = useNavigate();
    
    // variable para manejar la visualización del form laboratorio    
    const [ mostrarFormLaboratorio, setMostrarFormLaboratorio ] = useState(false);

    // varuable para manejar la visualización de la alerta de error
    const [ mostrarAlertaConfirmacionEliminacion, setMostrarAlertaConfirmacionEliminacion ] = useState(false);

    // variable para informar que se eliminó el laboratorio
    const [ mostrarAlertaLaboratorioEliminado, setMostrarAlertaLaboratorioEliminado ] = useState(false);

    // manejo de errores con modals vencimiento token
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    // variable manejo error en la eliminacion
    const [ errorEliminacion, setErrorEliminacion ] = useState(false);
    const [ errorUsuarioNoEncontrado, setErrorUsuarioNoEncontrado ] = useState(false);
    const [ errorLaboratorioAsociado, setErrorLaboratorioAsociado ] = useState(false);

    const modificarLaboratorio = () => {
        setMostrarFormLaboratorio(false);
        accionActualizarLista();
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    const handleErrorEliminacion = (confirm) => {
        if(confirm){
            setErrorEliminacion(false);
        }
        
    }

    const handleAlertaLaboratorioEliminado = (confirm) => {
        if(confirm){
            accionActualizarLista();
            setMostrarAlertaConfirmacionEliminacion(false);
        }
        
    }
    
    const eliminarLaboratorio = async (confirm) => {
        if(confirm){
            try {
                setMostrarAlertaConfirmacionEliminacion(false);
                await eliminarLaboratorioService(laboratorio.id);
                setMostrarAlertaLaboratorioEliminado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        renewToken();
                        setMostrarAlertaConfirmacionEliminacion(false);
                        await eliminarLaboratorioService(laboratorio.id);
                        setMostrarAlertaLaboratorioEliminado(true);
                    } catch (error) {
                        if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                        }
                        else if(error.response.status === 404){
                            setErrorUsuarioNoEncontrado(true);
                        }
                        else if(error.response.status === 405){
                            setErrorLaboratorioAsociado(true);
                        }
                        else {
                        setErrorEliminacion(true);
                        }
                    }
                }
                else if(error.response.status === 404){
                    setErrorUsuarioNoEncontrado(true);
                }
                else if(error.response.status === 405){
                    setErrorLaboratorioAsociado(true);
                }
                else {
                    setErrorEliminacion(true);
                }
            }
        } else {
            setMostrarAlertaConfirmacionEliminacion(false);
        }
    }

        return(
            <>
                <Stack direction="horizontal" gap={3} className='laboratorio-card'>
                    <div className="p-2">
                        <strong className="nombreLaboratorio">{laboratorio.nombre}</strong>
                    </div>
                    <div className="p-2 ms-auto">
                        <button className="botonesLaboratorioCard" onClick={() => {setMostrarFormLaboratorio(true)}}>
                            <img className="iconosLaboratorioCard" src={iconoTuboEnsayo} alt=""/>
                        </button>
                        <button className="botonesLaboratorioCard" >
                            <img className="iconosLaboratorioCard" src={iconoBorrar} onClick={() => {setMostrarAlertaConfirmacionEliminacion(true)}} alt=""/>
                        </button>
                    </div>
                </Stack>

                {
                    mostrarFormLaboratorio && <LaboratorioAMC accionCancelar={() => {setMostrarFormLaboratorio(false)}}
                    accionConfirmar={modificarLaboratorio} laboratorio={laboratorio} modo={"Consultar"}/>
                }

                {
                    mostrarAlertaConfirmacionEliminacion && <Alerta texto={"¿Desea eliminar el laboratorio?"} nombreBoton={"Eliminar"}
                    onConfirm={eliminarLaboratorio}/>
                }

                {
                    mostrarAlertaLaboratorioEliminado && <Confirm texto={"El Laboratorio ha sido eliminado correctamente"}
                    onConfirm={handleAlertaLaboratorioEliminado}/>
                }

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {
                    errorUsuarioNoEncontrado &&
                    <Error texto={"El usuario no se ha encontrado."} 
                    onConfirm={() => setErrorUsuarioNoEncontrado(false)}/>
                }

                {
                    errorLaboratorioAsociado &&
                    <Error texto={"No puede eliminarse el laboratorio, ya que tiene análisis y resultados asociados"} 
                    onConfirm={() => setErrorLaboratorioAsociado(false)}/>
                }

                {
                    errorEliminacion &&
                    <Error texto={"Ha ocurrido un error mientras eliminabamos el laboratorio, intente nuevamente más tarde"} 
                    onConfirm={handleErrorEliminacion}/>
                }

                
            </>
        )
    }


export default LaboratorioCard;