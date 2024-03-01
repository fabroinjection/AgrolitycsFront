//import assets y css
import './infoLotes.css';
import '../../../../components/Estilos/estilosDropdown.css';

import iconoDropdown from '../../../../assets/iconoDropdown.png'

//import components
import LoteCard from '../LoteCard/LoteCard';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'js-cookie';
import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';

//import hooks
import { useNavigate } from "react-router";
import { useState, useContext } from 'react';

//import context
import { MostrarMuestrasContext } from '../../../../context/MostrarMuestrasContext';




function InfoLotes({ actualizarRegistrarLote, campo, handleModificarCampo, 
    handleDarBajaCampo, lotes }){

    //Cookies para deshabilitar el registrar
    const [hayLoteSeleccionadoConsulta] = useState(Cookies.get("idLoteSeleccionadoAConsultar"));
    const [hayLoteAModificar] = useState(Cookies.get("idLoteAModificar"));

    //Context para que cuando se haga click en registrar nuevo lote, se salga de la ventana de las tomas de muestras
    const [ , setMostrarMuestras ] = useContext(MostrarMuestrasContext);
    
    
    let navigate = useNavigate();

    const handleCLickNuevoLote = () => {
        setMostrarMuestras(false);
        actualizarRegistrarLote();
    }

    const handleCerrarPestaña = () => {
        Cookies.remove("idLoteSeleccionadoAConsultar");
        Cookies.remove("nombreLoteSeleccionadoAConsultar");
        Cookies.remove("haLoteSeleccionadoAConsultar");
        Cookies.remove("idLoteAModificar");
        Cookies.remove("nombreLoteAModificar");
        navigate("/home");
    }


    return(
        <>
            <div className='boton-wrapper'>
                <CloseButton onClick={handleCerrarPestaña}></CloseButton>
            </div>                    
            <header className="header">
                <div className="campo-wrapper">
                    <strong className='nombreCampoConsulta'>{campo.nombre}</strong>                            
                    <span className='infoCampo'>{campo.localidad_nombre} - {campo.provincia_nombre}</span>
                    <span className='infoCampo'>Productor: {campo.productor_nombre}</span>   
                    <span className='infoCampo'>CUIT/CUIL: {campo.productor_cuit_cuil}</span>                                                  
                </div>
                <aside>
                    <Dropdown>
                        <Dropdown.Toggle variant="transparent" id="dropdown-menu" className='custom-toggle'>
                            <img className="icono-dropdown" src={iconoDropdown} alt="" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item className="custom-modificar-item" onClick={handleModificarCampo}>Modificar</Dropdown.Item>
                            <Dropdown.Item className="custom-eliminar-item" onClick={handleDarBajaCampo}>Eliminar</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </aside>
            </header>                   
                
            { (hayLoteSeleccionadoConsulta || hayLoteAModificar) ? null 
                :
                <Button 
                    variant='Secodary'
                    className='boton-agregar-lote'
                    onClick={handleCLickNuevoLote}
                >
                    + Agregar lote
                </Button>
            }
            <div className="fields-section">
                
                {lotes.map((lote)=>(
                    <LoteCard key={lote.id} lote={lote}/>
                ))}                        
            </div>
        </>
    );
}

export default InfoLotes;