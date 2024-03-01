import { Link } from 'react-router-dom'
// import Button from 'react/button';
import './CerrarSesion.css'
import Button from 'react-bootstrap/Button';
import Alerta from '../../Modals/Alerta/Alerta';

// import de hooks
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import iconoUsuario from '../../../assets/iconoUsuario.png';
import iconoGestionarCuenta from '../../../assets/iconoGestionarCuenta.png';
import iconoCerrarSesion from '../../../assets/iconoCerrarSesion.png';

function CerrarSesion(props) {
    
    const {name, email} = props;
     
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    let navigate = useNavigate();

    const handleClick = () => {
        setMostrarAlerta(!mostrarAlerta);
    };

    const handleConfirmarCierreSession = (confirm) =>{
        if(confirm){
            window.localStorage.removeItem('loggedAgroUser');
            Cookies.remove('email');
            Cookies.remove('username');
            Cookies.remove("idLoteSeleccionadoAConsultar");
            Cookies.remove("nombreLoteSeleccionadoAConsultar");
            Cookies.remove("haLoteSeleccionadoAConsultar");
            Cookies.remove("idLoteAModificar");
            Cookies.remove("nombreLoteAModificar");
            navigate("/");      
        }
        else{
            setMostrarAlerta(!mostrarAlerta);
        }
    }

    const navegarGestionCuenta = () => {
        navigate("/gestionarcuenta");
    }

    return (
        <article className='container fondo '>
            <header className='cabecera'>
                <img className="iconoUsuarioCS" src={iconoUsuario} alt="" />
                <div className='informacion'>
                    <strong>{name}</strong>
                    <span>{email}</span>
                </div>
            </header>

            <div className='contenedorBotonesGestionCuentas'>
                <Button variant='outline-primary' className='botonGestionCuentas' onClick={navegarGestionCuenta}>
                    <img src={iconoGestionarCuenta} alt="" className='iconoBoton'/>{}
                    Gestionar Cuenta
                </Button>

                <Button variant='outline-primary' className='botonGestionCuentas' onClick={handleClick}>
                    <img src={iconoCerrarSesion} alt="" className='iconoBotonCerrarSesion' />{}
                    Cerrar Sesión
                </Button>
            </div>
            {mostrarAlerta && <Alerta texto="¿Desea cerrar la sesión?" nombreBoton="Cerrar" 
            onConfirm={handleConfirmarCierreSession}/>}

        </article>
    )
        
  }
  
  export default CerrarSesion;