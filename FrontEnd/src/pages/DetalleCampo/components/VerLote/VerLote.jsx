
import { useState } from 'react';
import './VerLote.css';
import '../../../../components/Estilos/estilosFormulario.css';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

function VerLote(){
    const [nombreLote] = useState(Cookies.get("nombreLoteSeleccionadoAConsultar"));
    const [haLote] = useState(Cookies.get("haLoteSeleccionadoAConsultar"));

    const handleCerrarConsulta = () => {
        Cookies.remove("idLoteSeleccionadoAConsultar");
        Cookies.remove("nombreLoteSeleccionadoAConsultar");
        Cookies.remove("haLoteSeleccionadoAConsultar");
        window.location.reload();
    }
    
    return(
        <>
                <div className="map-sectionVerLote">
                    <div className="manejo-verLote-wrapper">
                        <div className='verLote-section'>
                            <div className='datosLote'>
                                <strong className='infoVerLote'> 
                                    {nombreLote}
                                </strong>
                                <span className='info-hectarea'>
                                    {haLote + " " + "ha."}
                                </span>
                            </div>                            
                            <div className='botonesVerLote'>
                                <Button className='botonCancelarFormulario' variant="secondary" onClick={handleCerrarConsulta}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

        </>
    )
}

export default VerLote;