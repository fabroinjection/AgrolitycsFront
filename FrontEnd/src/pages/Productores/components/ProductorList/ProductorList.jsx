//Estilos
import './ProductorList.css';

// import components
import ProductorCard from '../ProductoresCard/ProductorCard';
import ProductorAMC from '../ProductorAMC/ProductorAMC';
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Button } from "react-bootstrap";
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';

// import hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import utilities
import Cookies from 'js-cookie';

function ProductorList(){

    const [ mostrarFormProductores, setMostrarFormProductores ] = useState();

    let navigate = useNavigate();

    const handleNavigationHome = () => {
        navigate('/home')
    }

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
                    mostrarFormProductores && <ProductorAMC/>
                }
            </>
        );
    }
    else{
        return(<NoLogueado/>)
    }
    
}

export default ProductorList;
