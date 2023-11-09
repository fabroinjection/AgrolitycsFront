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

function CerrarSesion(props) {
    
    const {name, email} = props;
     
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    let navigate = useNavigate();

    const handleClick = () => {
        setMostrarAlerta(!mostrarAlerta);
    };

    const handleConfirmarCierreSession = (confirm) =>{
        if(confirm){
            try {
                window.localStorage.removeItem('loggedAgroUser');
                Cookies.remove('email');
                Cookies.remove('username');
                Cookies.remove("idLoteSeleccionadoAConsultar");
                Cookies.remove("nombreLoteSeleccionadoAConsultar");
                Cookies.remove("haLoteSeleccionadoAConsultar");
                Cookies.remove("idLoteAModificar");
                Cookies.remove("nombreLoteAModificar");
                navigate("/");
            } catch (error) {
                //
            }            
            
        }
        else{
            setMostrarAlerta(!mostrarAlerta);
        }
    }

    return (
        <article className='container fondo letraInter'>
            <header className='cabecera'>
                <img className="iconoUsuarioCS" src={iconoUsuario} alt="" />
                <div className='informacion'>
                    <strong>{name}</strong>
                    <span>{email}</span>
                </div>
            </header>

            <Link className='linkEditarCerrarSesion' to={"/login"}>
            <Button className='btnEditar' variant="link">
                Editar
            </Button>
            </Link>
            
            <button className='btnCerrarSesion' onClick={handleClick}>
                Cerrar Sesión
            </button>
            {mostrarAlerta && <Alerta texto="¿Desea cerrar la sesión?" nombreBoton="Cerrar" 
            onConfirm={handleConfirmarCierreSession}/>}

        </article>
    )
        
  }
  
  export default CerrarSesion;