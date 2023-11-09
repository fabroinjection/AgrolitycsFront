// import componentes
import {Link, useNavigate} from 'react-router-dom';
import BotonCampo from '../BotonCampo/BotonCampo';
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import Cookies from 'js-cookie';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Error from '../../../../components/Modals/Error/Error';


// import hooks
import { useState, useEffect } from 'react';

// import services
import { camposService } from '../../../../services/campo.service';
import { renewToken } from '../../../../services/token.service';

// import estilos
import './CamposCard.css'


function CamposCard() {

  const [ campos, setCampos ] = useState([]);
  const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

  let navigate = useNavigate('/');
  


  useEffect(() => {
    const fetchCampos = async () =>{
      try {
        const { data } = await camposService();
        setCampos(data);
      } catch (error) {
        if(error.response && error.response.status === 401){
          try {
            await renewToken();
            const { data } = await camposService();
            setCampos(data);
          } catch (error) {
            if(error.response && error.response.status === 401){
              setMostrarErrorVencimientoToken(true);
            }
          }
        }
      }
    }

    fetchCampos();
  }, [])

  const handleSesionExpirada = () =>{
    setMostrarErrorVencimientoToken(false);
    navigate("/");
    window.localStorage.removeItem('loggedAgroUser');
  }
  

  if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
    return (

      <>
        <NavbarBootstrap/>
  
        <div className='container'>
          <Link className='linkBtn' to={'/nuevocampo'}>
              <button className='btn btn-outline-primary btnNuevo'>
                <span className="signoMas">+</span>
              </button>
          </Link>
          
          {
            campos.map(campo => (
                
                <BotonCampo key={campo.id} nombreCampo={campo.nombre} idCampo={campo.id}/>
  
            ))
          } 

          {mostrarErrorVencimientoToken &&
            <Error texto={"Su sesión ha expirado"} 
            onConfirm={handleSesionExpirada}/>
          }  
        
        </div>
      </>
  
    )
  }
  else{
    return <NoLogueado/>
  }

  
}

export default CamposCard