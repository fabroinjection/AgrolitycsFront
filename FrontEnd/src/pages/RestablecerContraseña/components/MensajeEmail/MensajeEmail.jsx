// import estilos
import '../../../../components/Estilos/estilosFormulario.css';
import './MensajeEmail.css';

function MensajeEmail({ email }) {

    return (
        <>
            <div className="fondoImagen">
                <div className='formularioOscuro formCentrado'>
                    <div className='mensajeCentro'>
                        <span className='tituloMensaje'>Se ha enviado un correo a su casilla {email} con los pasos para reestablecer su contraseña.</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MensajeEmail