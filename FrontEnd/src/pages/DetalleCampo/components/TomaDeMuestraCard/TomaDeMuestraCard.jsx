
//import assets
import './TomaDeMuestraCard.css';
import iconoSubmuestras from '../../../../assets/iconoSubmuestras.png';
import iconoRotulo from '../../../../assets/iconoRotulo2.png';
import iconoAnalisis from '../../../../assets/iconoAnalisis.png';
import iconoDiagnostico from '../../../../assets/iconoDiagnostico.png';
import iconoMenu from '../../../../assets/iconoMenu.png';
import iconoRegistroTM from '../../../../assets/iconoRegistroTM.png';


//import components
import Dropdown from 'react-bootstrap/Dropdown';
import TomaDeMuestraABMC from '../TomaDeMuestraAMC/TomaDeMuestraAMC';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Error from '../../../../components/Modals/Error/Error';
import SubmuestrasForm from '../SubmuestrasForm/SubmuestrasForm';
import TomaDeMuestraTomadaForm from '../TomaDeMuestraTomada/TomaDeMuestraTomadaForm';

//import hooks
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

//import context
import { ModoTomaDeMuestraAMCContext } from '../../../../context/ModoTomaDeMuestraAMCContext';
import { ModoPDFContext } from '../../../../context/ModoPDFContext';
import { HayAnalisisContext } from '../../../../context/HayAnalisisContext';

//import utilities
import moment from 'moment';

//import services
import { darDeBajaTomaDeMuestraService } from '../../services/tomaDeMuestra.service';
import { renewToken } from '../../../../services/token.service';



// eslint-disable-next-line react/prop-types
function TomaDeMuestraCard({ tomaDeMuestra, onEliminar, onModificar, onRegistrarTomada }){
    let navigate = useNavigate();

    //estados para manejar la visualización de los distintos formularios y alertas
    const [ formConsultaTomaDeMuestra, setFormConsultaTomaDeMuestra ] = useState(false);
    const [ alertaConfirmacionDarDeBajaTM, setAlertaConfirmacionDarDeBajaTM ] = useState(false);
    const [ formModificacionTomaDeMuestra, setFormModificacionTomaDeMuestra ] = useState(false);
    const [ alertaTMModificada, setAlertaTMModificada ] = useState(false);
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ formCantidadSubmuestras, setFormCantidadSubmuestras ] = useState(false);
    const [ mostrarErrorTMSinAnalisis, setMostrarErrorTMSinAnalisis ] = useState(false);
    const [ mostrarEnDesarrollo, setMostrarEnDesarrollo ] = useState(false);
    const [ mostrarFormTomaMuestraTomada, setMostrarFormTomaMuestraTomada ] = useState(false);
    const [ alertaTMTomadaRegistrada, setAlertaTMTomadaRegistrada ] = useState(false);
    const [ mostrarErrorTMPendienteParaAnalisis, setMostrarErrorTMPendienteParaAnalisis ] = useState(false);

    //variables del contexto modo form toma de muestra
    const [ modoTomaDeMuestra, setModoTomaDeMuestra ] = useContext(ModoTomaDeMuestraAMCContext);

    //variable para setear el modo del pdf
    const [ , setModoPDF ] = useContext(ModoPDFContext);

    //variable context para validar que hay analisis seleccionado
    const [ , setHayAnalisis ] = useContext(HayAnalisisContext);

    const handleConsultarTomaDeMuestra = () => {
        setModoTomaDeMuestra('consulta');
        setFormConsultaTomaDeMuestra(true);
    }

    const handleCancelarFormulario = () => {
        if (modoTomaDeMuestra === 'consulta') {
            setFormConsultaTomaDeMuestra(false);
        }
        else if (modoTomaDeMuestra === 'edición') {
            setFormModificacionTomaDeMuestra(false);
        }
    }

    const handleHabilitarEdicionTomaDeMuestra = () => {
        setFormConsultaTomaDeMuestra(false);
        setModoTomaDeMuestra('edición');
        setFormModificacionTomaDeMuestra(true);
    }

    const solicitarConfirmacionDarDeBajaTomaDeMuestra = () => {
        setAlertaConfirmacionDarDeBajaTM(true);
    }

    const handleDarDeBajaTomaDeMuestra = async (confirm) => {
        if(confirm){
            try {
                await darDeBajaTomaDeMuestraService(tomaDeMuestra.id);
                setAlertaConfirmacionDarDeBajaTM(false);
                onEliminar(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                      await renewToken();
                      await darDeBajaTomaDeMuestraService(tomaDeMuestra.id);
                      setAlertaConfirmacionDarDeBajaTM(false);
                      onEliminar(true);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                    }
                  }
            }
        }
        else{
            setAlertaConfirmacionDarDeBajaTM(false);
            onEliminar(false);
        }
    }

    const handleModificarTomaDeMuestra = () => {
        onModificar(true);
        setFormModificacionTomaDeMuestra(false);
        setAlertaTMModificada(true);
    }

    const handleRegistrarTomaDeMuestraTomada = () => {
        onRegistrarTomada(true);
        setMostrarFormTomaMuestraTomada(false);
        setAlertaTMTomadaRegistrada(true);
    }
    
    const handleSubmuestrasForm = () => {
        setFormCantidadSubmuestras(true);
    }

    const handleGenerarRotulo = () => {
        setModoPDF('rotulo');
        navigate(`/verPDF/${tomaDeMuestra.id}`)
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    const cancelarFormSubmuestras = () => {
        setFormCantidadSubmuestras(false);
    }

    const handleNavegacionAlAnalisis = () => {
        if (tomaDeMuestra.estado_toma_de_muestra_id === "Pendiente"){
            setMostrarErrorTMPendienteParaAnalisis(true);
        }
        else{
            setHayAnalisis(tomaDeMuestra.tipo_analisis_suelo_a_realizar_nombre);
            navigate(`/analisis/${tomaDeMuestra.id}`);
        }
        
    }

    const handleFormularioGeneracionDiagnostico = () => {
        if(tomaDeMuestra.estado_toma_de_muestra_id === "Analizada" || tomaDeMuestra.estado_toma_de_muestra_id === "Diagnosticada"){
            if (tomaDeMuestra.tipo_analisis_suelo_a_realizar_nombre === "Agua Útil") {
                setModoPDF("diagnostico");
                navigate(`/verPDF/${tomaDeMuestra.id}`);
            }
            else {
                navigate(`/diagnostico/${tomaDeMuestra.id}`);
            }
        }
        else{
            setMostrarErrorTMSinAnalisis(true);
        }
         
        
    }

    return (
        <>
            <article className='tomaMuestraCard'>
                <header className='cabeceraTomaMuestra'>
                    {/* Este código y fecha son los que cambian para cada toma de muestra */}
                    <strong className='infoTomaMuestra'>{tomaDeMuestra.codigo} - {moment(tomaDeMuestra.fecha).format('DD/MM/YYYY')}</strong>
                    <aside>

                        {/* Cambia el color del fondo según el estado en que se encuentra */}
                        <div className="estadoTomaMuestra estadoDiagnosticada"
                        style={{
                            backgroundColor:
                                tomaDeMuestra.estado_toma_de_muestra_id === "Pendiente"
                                ? "#E55959"
                                : tomaDeMuestra.estado_toma_de_muestra_id === "Tomada"
                                ? "#F6A254"
                                : tomaDeMuestra.estado_toma_de_muestra_id === "Analizada"
                                ? "#F6E654"
                                : '#09B81A'
                            }}>
                                
                            <span className='nombreEstado'>{tomaDeMuestra.estado_toma_de_muestra_id}</span>
                        </div>
                        {/* {tomaDeMuestra.estado_toma_de_muestra_id === "Pendiente" &&
                            <button className="botonesTomaMuestraCard" onClick={() => setMostrarFormTomaMuestraTomada(true)}>
                                <img className="iconosTomaMuestraCard" src={iconoRegistroTM} alt="" title='Registrar Toma de Muestra como Tomada'/>
                            </button>
                        } */}
                        <button
                            className={`botonesTomaMuestraCard ${tomaDeMuestra.estado_toma_de_muestra_id !== 'Pendiente' ? 'button-disabled' : ''}`}
                            onClick={() => setMostrarFormTomaMuestraTomada(true)}
                        >
                            <img className="iconosTomaMuestraCard" src={iconoRegistroTM} alt="" title='Registrar Toma de Muestra como Tomada'/>
                        </button>
                        
                        <button className="botonesTomaMuestraCard" onClick={handleSubmuestrasForm}>
                            <img className="iconosTomaMuestraCard" src={iconoSubmuestras} alt="" title='Generar indicadores en el mapa'/>
                        </button>
                        <button className="botonesTomaMuestraCard" onClick={handleGenerarRotulo}>
                            <img className="iconosGrandes" src={iconoRotulo} alt="" title='Generar Rotulo'/>
                        </button>
                        <button className="botonesTomaMuestraCard" onClick={handleNavegacionAlAnalisis}>
                            <img className="iconosTomaMuestraCard" src={iconoAnalisis} alt="" title='Análisis'/>
                        </button>
                        <button className="botonesTomaMuestraCard" onClick={handleFormularioGeneracionDiagnostico}>
                            <img className="iconosTomaMuestraCard" src={iconoDiagnostico} alt="" title='Diagnóstico'/>
                        </button>
                        <Dropdown className="botonesLoteCard">
                            <Dropdown.Toggle variant="transparent" id="dropdown-menu" className='custom-toggle'>
                                <img className="iconosGrandes" src={iconoMenu} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item className="custom-modificar-item" onClick={handleConsultarTomaDeMuestra}>
                                    Ver Información
                                </Dropdown.Item>
                                <Dropdown.Item className="custom-eliminar-item" onClick={solicitarConfirmacionDarDeBajaTomaDeMuestra}>
                                    Eliminar
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </aside>
                </header>
            </article>

            {formConsultaTomaDeMuestra && <TomaDeMuestraABMC titulo={tomaDeMuestra.codigo} nombreBoton='Editar'
            accionCancelar={handleCancelarFormulario} accionConfirmar={handleHabilitarEdicionTomaDeMuestra}
            tomaDeMuestra={tomaDeMuestra}/>}

            {formModificacionTomaDeMuestra && <TomaDeMuestraABMC titulo={"Editar " + tomaDeMuestra.codigo} nombreBoton='Aceptar'
            accionCancelar={handleCancelarFormulario} accionConfirmar={handleModificarTomaDeMuestra}
            tomaDeMuestra={tomaDeMuestra}/>}

            {alertaConfirmacionDarDeBajaTM && <Alerta texto={"¿Desea eliminar la toma de muestra? Se borrarán todos los análisis asociados a la misma."} nombreBoton={"Eliminar"}
            onConfirm={handleDarDeBajaTomaDeMuestra}/>}

            {alertaTMModificada && <Confirm texto={"La Toma de Muestra ha sido modificada correctamente"} onConfirm={()=>{setAlertaTMModificada(false)}}/>}

            {mostrarErrorVencimientoToken && <Error texto={"Su sesión ha expirado"} onConfirm={handleSesionExpirada}/>}  

            {formCantidadSubmuestras && <SubmuestrasForm accionCancelar={cancelarFormSubmuestras} tomaMuestra={tomaDeMuestra}/>}

            {mostrarErrorTMSinAnalisis && <Error texto={"No puede realizar un diagnóstico de una toma de muestra sin análisis asociado"}
            onConfirm={() => {setMostrarErrorTMSinAnalisis(false)}}/>}

            {mostrarEnDesarrollo && <Error texto={"En desarrollo"}
            onConfirm={() => {setMostrarEnDesarrollo(false)}}/>}

            {mostrarFormTomaMuestraTomada && <TomaDeMuestraTomadaForm accionCancelar={() => setMostrarFormTomaMuestraTomada(false)}
            fechaEstimada={tomaDeMuestra.fecha} accionConfirmar={handleRegistrarTomaDeMuestraTomada}
            idTM={tomaDeMuestra.id}/>}

            {alertaTMTomadaRegistrada && <Confirm texto={"La Toma de Muestra ha sido registrada como Tomada correctamente"} onConfirm={()=>{setAlertaTMTomadaRegistrada(false)}}/>}

            {mostrarErrorTMPendienteParaAnalisis && <Error texto={"No puede registrar un análisis de una toma de muestra en estado Pendiente"}
            onConfirm={() => {setMostrarErrorTMPendienteParaAnalisis(false)}}/>}
        </>
    );
}

export default TomaDeMuestraCard;