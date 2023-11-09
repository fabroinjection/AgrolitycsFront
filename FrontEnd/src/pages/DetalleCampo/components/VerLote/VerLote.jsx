
import { useState } from 'react';
import './VerLote.css';
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
                                <span>
                                    {haLote + " " + "ha."}
                                </span>
                            </div>                            
                            <div className='botonesVerLote'>
                                <Button className='estiloBotonVerLote btnCerrarLote' variant="secondary" onClick={handleCerrarConsulta}>
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