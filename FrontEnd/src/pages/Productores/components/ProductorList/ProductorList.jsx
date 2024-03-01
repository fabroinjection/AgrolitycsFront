//Estilos
import './ProductorList.css';
import '../../../../components/Estilos/estilosFormulario.css';

// import components
import ProductorCard from '../ProductoresCard/ProductorCard';
import ProductorAMC from '../ProductorAMC/ProductorAMC';
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Button } from "react-bootstrap";
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Error from '../../../../components/Modals/Error/Error';
import HelpButton from '../../../../components/Ayuda/HelpButton';


// import hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import utilities
import Cookies from 'js-cookie';

// import services
import { productoresService } from '../../../../services/productores.service';
import { renewToken } from '../../../../services/token.service';


function ProductorList(){

    const [ productores, setProductores ] = useState([]);
    
    //variables para actualizar la consulta de todos los productores
    const [ nuevoProductor, setNuevoProductor ] = useState(false);
    const [ actualizacionProductores, setActualizacionProductores ] = useState(false);

    //variables para manejar el renderizado de alertas de error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarErrorConsultaProductores, setMostrarErrorConsultaProductores ] = useState(false);

    const [ mostrarFormProductores, setMostrarFormProductores ] = useState();

    let navigate = useNavigate();

    const handleNavigationHome = () => {
        navigate('/home')
    }

    const actualizacionListaProductores = () => {
      setActualizacionProductores(true);
    }

    const registrarProductor = () => {
        setMostrarFormProductores(false);
        setNuevoProductor(true);
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    const handleErrorConsultaProductores = () => {
        setMostrarErrorConsultaProductores(false);
        navigate('/home');
    }

    useEffect(() => {
        const fetchListadoProductores = async () => {
            try {
              const { data } = await productoresService();
              setProductores(data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  renewToken();
                  const { data } = await productoresService();
                  setProductores(data);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }     
          }   
          fetchListadoProductores();
    }, [])

    useEffect(() => {
        const fetchListadoProductores = async () => {
            try {
              const { data } = await productoresService();
              setProductores(data);
              setNuevoProductor(false);
              setActualizacionProductores(false);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  renewToken();
                  const { data } = await productoresService();
                  setProductores(data);
                  setNuevoProductor(false);
                  setActualizacionProductores(false);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }     
          }   
          fetchListadoProductores();
    }, [nuevoProductor, actualizacionProductores])

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        return(
            <>
                <NavbarBootstrap/>
        
                <div className='contenedorProductores'>
                    <div className='tituloCentradoListaProductor'>
                        <strong className='tituloProductorLista'>Mis Productores</strong>
                    </div>
                    <div className='tarjetasContenedor'>
                        <div className='tarjetasScroll'>
                            <Button name="botonNuevoProductor" 
                              className='boton-agregar-productor' 
                              title="Nuevo Productor"
                              variant='secondary'
                            onClick={() => {setMostrarFormProductores(true)}}>
                                <span>+ Agregar productor</span>
                            </Button>
                            <div className='contenedor-cards'>

                            
                            {productores.map((productor)=>(
                              <ProductorCard key={productor.id} productor={productor} accionActualizarLista={actualizacionListaProductores}/>
                            ))}    
                            </div>
                        </div>
                    </div>

                    <div className='botonNuevaTomaContenedor'>
                        <Button className="botonCancelarFormulario" variant="secondary"
                        onClick={handleNavigationHome}>
                            Volver
                        </Button>
                    </div>
                </div>

                <HelpButton/>

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {
                    mostrarErrorConsultaProductores &&
                    <Error texto={"Ha ocurrido un error buscando sus productores, intente de nuevo más tarde"} 
                    onConfirm={handleErrorConsultaProductores}/>
                }

                {
                    mostrarFormProductores && <ProductorAMC accionCancelar={() => setMostrarFormProductores(false)}
                    accionConfirmar={registrarProductor} modo={"Registrar"}/>
                }
            </>
        );
    }
    else{
        return(<NoLogueado/>)
    }
    
}

export default ProductorList;
