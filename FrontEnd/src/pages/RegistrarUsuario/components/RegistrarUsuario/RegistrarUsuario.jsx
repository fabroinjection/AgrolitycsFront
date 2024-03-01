// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';

// importar componentes
import RegistrarUsuarioUno from '../RegistrarUsuarioUno/RegistrarUsuarioUno';
import RegistrarUsuarioDos from '../RegistrarUsuarioDos/RegistrarUsuarioDos';
import RegistrarUsuarioTres from '../RegistrarUsuarioTres/RegistrarUsuarioTres';
import RegistrarUsuarioCuatro from '../RegistrarUsuarioCuatro/RegistrarUsuarioCuatro';
import MensajeConfirmacionUsuario from '../MensajeConfirmacion/MensajeConfirmacionUsuario';
import Error from '../../../../components/Modals/Error/Error';

// importar hooks
import { useState } from 'react';

// importar servicios
import { signUp } from '../../services/registrarUsuario.service';

function RegistrarUsuario(){

    //variables para el manejo del registro con todos los componentes
    const [ etapaForm, setEtapaForm ] = useState(1);
    const [ usuario, setUsuario ] = useState({
        nombre: '',
        apellido: '',
        tipoPerfil: '',
        provincia: '',
        idProvincia: 0,
        localidad: '',
        idLocalidad: 0,
        email: '',
        contraseña: ''
    })

    //variables para manejo de errores
    const [ mostrarErrorUsuarioExistente, setMostrarErrorUsuarioExistente ] = useState(false);
    const [ mostrarErrorEmailInvalido, setMostrarErrorEmailInvalido ] = useState(false);

    const actualizarUsuario = (nuevosDatos) => {
        setUsuario({ ...usuario, ...nuevosDatos});
    }

    const registrarUsuario = async () =>{
        const nuevoUsuario = {
            user: {
                email: usuario.email,
                contrasenia: usuario.contraseña,
                email_verificado: false
              },
            perfil: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                tipo_perfil: (usuario.tipoPerfil === "ingeniero") ? 1 : 2,
                localidad_id: usuario.idLocalidad
            }
        }

        try {
            await signUp(nuevoUsuario);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 402) {
                    setMostrarErrorEmailInvalido(true);
                }
                else if (error.response.status === 400) {
                    setMostrarErrorUsuarioExistente(true);
                }
            }
        }

    }

    if(etapaForm === 1){
        return(
            <>
                <div className="fondoImagen">
                    <RegistrarUsuarioUno 
                        usuario={usuario} 
                        actualizarUsuario={actualizarUsuario}
                        avanzarEtapa={() => setEtapaForm(etapaForm + 1)}
                    />
                </div>
            </>
        )
    }
    else if(etapaForm === 2){
        return(
            <>
                <div className="fondoImagen">
                    <RegistrarUsuarioDos
                        usuario={usuario} 
                        actualizarUsuario={actualizarUsuario}
                        avanzarEtapa={() => setEtapaForm(etapaForm + 1)}
                        volverEtapa={() => setEtapaForm(etapaForm - 1)}
                    />
                </div>
            </>
        )
    }
    else if(etapaForm === 3){
        return(
            <>
                <div className="fondoImagen">
                    <RegistrarUsuarioTres
                        usuario={usuario} 
                        actualizarUsuario={actualizarUsuario}
                        avanzarEtapa={() => setEtapaForm(etapaForm + 1)}
                        volverEtapa={() => setEtapaForm(etapaForm - 1)}
                    />
                </div>
            </>
        )
    }
    else if (etapaForm === 4){
        return(
            <>
                <div className="fondoImagen">
                    <RegistrarUsuarioCuatro
                        usuario={usuario}
                        actualizarUsuario={actualizarUsuario} 
                        avanzarEtapa={() => setEtapaForm(etapaForm + 1)}
                        volverEtapa={() => setEtapaForm(etapaForm - 1)}
                    />
                </div>

                {
                    mostrarErrorUsuarioExistente &&
                    <Error texto={"Ya existe un usuario con ese email"} 
                    onConfirm={() => setMostrarErrorUsuarioExistente(false)}/>
                }

                {
                    mostrarErrorEmailInvalido &&
                    <Error texto={"Email no válido"} 
                    onConfirm={() => setMostrarErrorEmailInvalido(false)}/>
                }
            </>
        )
    }
    else{
        return(
            <>
                <div className="fondoImagen">
                    <MensajeConfirmacionUsuario 
                        email={usuario.email}
                        registrarUsuario={registrarUsuario}
                    />
                </div>
            </>
        )
    }
}

export default RegistrarUsuario;