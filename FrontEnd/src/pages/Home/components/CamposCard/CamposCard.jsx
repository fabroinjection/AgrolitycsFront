// import componentes
import CampoNew from '../CampoNew/CampoNew';
import BotonCampo from '../BotonCampo/BotonCampo';
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import Cookies from 'js-cookie';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Error from '../../../../components/Modals/Error/Error';
import HelpButton from '../../../../components/Ayuda/HelpButton';


// import hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import services
import { camposService } from '../../../../services/campo.service';
import { renewToken } from '../../../../services/token.service';

// import estilos
import './CamposCard.css'


function CamposCard() {

  const [ campos, setCampos ] = useState([]);
  const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

  const [ formNuevoCampo, setFormNuevoCampo ] = useState(false);
  const [ actualizarListadoCampos, setActualizarListadoCampos ] = useState(false);

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
  }, [actualizarListadoCampos])

  const handleSesionExpirada = () =>{
    setMostrarErrorVencimientoToken(false);
    navigate("/");
    window.localStorage.removeItem('loggedAgroUser');
  }

  const registrarNuevoCampo = () => {
    setActualizarListadoCampos(!actualizarListadoCampos);
    setFormNuevoCampo(false);
  }
  

  if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
    return (

      <>
        <NavbarBootstrap/>
  
        <div className='centrarTitulo'>
          <h1 className='tituloCampos'>Mis Campos</h1>
        </div>        
        <div className='container'>
          <button className='btn btn-outline-primary btnNuevo' onClick={() => {setFormNuevoCampo(true)}}>
            <span className="signoMas">+</span>
          </button>

          
          {
            campos.map(campo => (
                
                <BotonCampo key={campo.id} nombreCampo={campo.nombre} idCampo={campo.id}/>
  
            ))
          } 

          { 
            mostrarErrorVencimientoToken &&
            <Error texto={"Su sesión ha expirado"} 
            onConfirm={handleSesionExpirada}/>
          }

          {
            formNuevoCampo &&
            <CampoNew onRegistrar={registrarNuevoCampo} onCancelar={() => {setFormNuevoCampo(false)}}/>
          }
        
        </div>
        <HelpButton/>
      </>
  
    )
  }
  else{
    return <NoLogueado/>
  }

  
}

export default CamposCard