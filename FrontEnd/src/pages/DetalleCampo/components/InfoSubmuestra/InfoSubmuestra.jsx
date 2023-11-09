//importar estilos
import './InfoSubmuestra.css';

//importar componentes
import { Button } from 'react-bootstrap';

//importar hooks
import { useContext } from 'react';

//importar context
import { EstadoSubMuestrasContext } from '../../../../context/EstadoSubMuestrasContext';

function InfoSubmuestra({ tomaMuestra }){

    const [ , setHaySubmuestras ] = useContext(EstadoSubMuestrasContext);

    return(
        <>
            {/* Cabecera que contiene los datos de submuestra y botones */}
            <div className="info-submuestra">

                {/* informacioón lote y submuestras */}
                <div className="datos-submuestra">
                    <strong className='info-lote'>
                        {tomaMuestra.lote_nombre}
                    </strong>
                    <span>
                       {tomaMuestra.codigo} - Muestreo {tomaMuestra.tipo_muestreo_nombre}
                    </span>
                </div>

                {/* botones para cerrar e imprimir mapa de lote con submuestras */}
                <div className='botones-submuestra'>
                    <Button className='estilo-boton-Submuestra btn-cancelar-submuestra' variant="secondary" onClick={() => setHaySubmuestras()}>
                        Cancelar
                    </Button>
            </div>
            </div>
        </>
    );
}

export default InfoSubmuestra;