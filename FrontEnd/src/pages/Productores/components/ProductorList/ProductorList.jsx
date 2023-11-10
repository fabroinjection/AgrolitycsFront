//Estilos
import './ProductorList.css';

// import components
import ProductorCard from '../ProductoresCard/ProductorCard';
import ProductorAMC from '../ProductorAMC/ProductorAMC';
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Button } from "react-bootstrap";
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Error from '../../../../components/Modals/Error/Error';

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
        if(nuevoProductor || actualizacionProductores){
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
        }
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
                            <button name="botonNuevoProductor" className='btn btn-outline-primary btnNuevoProductor' title="Nuevo Productor"
                            onClick={() => {setMostrarFormProductores(true)}}>
                                <span className="signoMas">+</span>
                            </button>

                            {productores.map((productor)=>(
                              <ProductorCard key={productor.id} productor={productor} accionActualizarLista={actualizacionListaProductores}/>
                            ))}    
                        </div>
                    </div>

                    <div className='botonNuevaTomaContenedor'>
                        <Button className="estiloBotonesListaProductor botonVolverProductor" variant="secondary"
                        onClick={handleNavigationHome}>
                            Volver
                        </Button>
                    </div>
                </div>

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
