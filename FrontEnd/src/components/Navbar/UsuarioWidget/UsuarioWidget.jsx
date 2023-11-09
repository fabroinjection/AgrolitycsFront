
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUser } from '@fortawesome/free-solid-svg-icons'
// import {
//   findIconDefinition
// } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './UsuarioWidget.css'
import { useState } from 'react';
import CerrarSesion from '../CerrarSesión/CerrarSesion';

// import Context
// import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';

import iconoUsuario from '../../../assets/iconoUsuario.png';

function UsuarioWidget() {
  // const userLookup= { prefix: 'fas', iconName: 'user' };
  // library.add(faUser)
  // const coffeeIconDefinition = findIconDefinition(userLookup);

  // const { usuarioLogueado } = useContext(UserContext);

  const emailUsuario = Cookies.get('email');
  const nombreUsuario = Cookies.get('username');

  const [mostrarCerrarSesion, setMostrarCerrarSesion] = useState(false);

  const handleClick = () => {
    setMostrarCerrarSesion(!mostrarCerrarSesion);
  };

  return (
    <>
        <button className='btn' onClick={handleClick}>
          <img className="iconoUsuario" src={iconoUsuario} alt="" />
        </button>
        {mostrarCerrarSesion && <CerrarSesion name={nombreUsuario} email={emailUsuario} />}
      
        
    </>
  )
}

export default UsuarioWidget