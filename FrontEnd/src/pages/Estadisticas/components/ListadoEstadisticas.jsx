// importar estilos
import './estadisticas.css';
import '../../../components/Estilos/estilosFormulario.css';
import '../../../components/Estilos/estilosListados.css';

// importar componentes
import NavbarBootstrap from '../../../components/Navbar/Navbar.components';
import { Button } from 'react-bootstrap';
import HelpButton from '../../../components/Ayuda/HelpButton';

// import hooks
import { useNavigate } from 'react-router-dom';

function ListadoEstadisticas() {

    let navigate = useNavigate();

    const handleNavigationHome = () => {
        navigate('/home')
    }

    const handleNavigationPorcentajeFertilizantes = () => {
        navigate('/porcentaje-fertilizantes')
    }

    const handleNavigationNutrientesPorLote = () => {
        navigate('/nutrientes-por-lote')
    }

    return(
        <>
        <NavbarBootstrap />
        <div className='contenedor-listado'>
            <div className='sector-titulo-listado'>
                <div>
                    <strong className='titulo-listado'>Estadísticas</strong>
                </div>
                <div>
                    <strong>Seleccione la estadística que desea visualizar.</strong>
                </div>                
            </div>
            <div className='listado-contenedor'>
                <div className='listado-scroll'>
                    <Button
                        name='porcentaje-fertilizantes'
                        className='boton-estadistica'
                        title='Porcentaje de fertilizantes aplicados por lote'
                        variant='secondary'
                        onClick={handleNavigationPorcentajeFertilizantes}
                        >
                        <span className='nombre-boton-estadistica'>Porcentaje de fertilizantes aplicados por lote</span>                         
                    </Button>
                    <Button
                        name='nutrientes-por-lote'
                        className='boton-estadistica'
                        title='Evolución de nutrientes por lote'
                        variant='secondary'
                        onClick={handleNavigationNutrientesPorLote}
                        >
                        <span className='nombre-boton-estadistica'>Evolución de nutrientes por lote</span> 
                    </Button>
                </div>
                <div className='seccion-boton-volver'>
                    <Button
                        className='botonCancelarFormulario'
                        variant='secondary'
                        onClick={handleNavigationHome}
                    >
                        Volver
                    </Button>
                </div>
            </div>

        </div>
        <HelpButton/>

        </>
    );
}

export default ListadoEstadisticas;