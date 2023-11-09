//Componentes
import Dropdown from 'react-bootstrap/Dropdown';

//Estilos
import './DiagnosticoCard.css'

//Utilities
import moment from 'moment/moment';
import Cookies from 'js-cookie';

//Assets
import iconoVerDiagnostico from "../../../../assets/iconoVerDiagnostico.png"
import iconoMenu from "../../../../assets/iconoMenu.png"

//Hooks
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

//Services
import { getCultivoService } from '../../../../services/diagnosticos.service';

//Context
import { IdDiagnosticoContext } from '../../../../context/IdDiagnosticoContext';
import { ModoPDFContext } from '../../../../context/ModoPDFContext';


function DiagnosticoCard({ diagnostico, idTomaMuestra }){

    const [ cultivoNombre, setCultivoNombre ] = useState();

    const [ , setIdDiagnostico ] = useContext(IdDiagnosticoContext);
    const [ , setModoPDF ] = useContext(ModoPDFContext);

    let navigate = useNavigate();

    useEffect(() => {
        if (diagnostico) {
          const fetchCultivoNombre = async () => {
            const { data } = await getCultivoService(diagnostico.cultivo_id);
            setCultivoNombre(data);
          };
    
          fetchCultivoNombre();
        }
      }, []);

    const handleConsultarDiagnostico = () => {
        setModoPDF('consulta diagnostico');
        setIdDiagnostico(diagnostico.id);
        Cookies.set("Cultivo", diagnostico.cultivo_id);
        navigate(`/verPDF/${idTomaMuestra}`);
    }

    if(cultivoNombre){
        return(
            <>
                <article className="diagnosticoCard">
                    <header className="cabeceraDiagnostico">                    
                        <strong className="nombreDiagno">{moment(diagnostico.fecha_alta).format("DD/MM/YYYY")} - {cultivoNombre} - {diagnostico.rendimiento_esperado} Ton/ha</strong>
                        <aside>
                            <button className="botonesDiagnosticoCard" >
                                <img className="iconosDiagnosticoCard" src={iconoVerDiagnostico} alt="" onClick={handleConsultarDiagnostico}/>
                            </button>
                            <Dropdown className="botonesDiagnosticoCard">
                                <Dropdown.Toggle variant="transparent" id="dropdown-menu" className='custom-toggle'>
                                    <img className="iconosMenuCard" src={iconoMenu} alt="" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="custom-dropdown-menu">
                                    <Dropdown.Item className="custom-modificar-item">
                                        Modificar
                                    </Dropdown.Item>
                                    <Dropdown.Item className="custom-eliminar-item">
                                        Eliminar
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </aside>
                    </header>
                </article>
            </>
        )
    }


}

export default DiagnosticoCard;