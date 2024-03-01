// import componentes
import { Link } from 'react-router-dom'

// import estilos
import './BotonCampo.css'




function BotonCampo({ nombreCampo, idCampo }) {
  return (
    <Link className="linkAlCampo" to={`/detalleCampo/${idCampo}`}>
      <button className="btnCampo">
              <img className="iconoConsultarCampo" src="src\assets\iconoConsultarCampo.png" alt="" />
              <strong className='nombreCampo'>{nombreCampo}</strong>                          
      </button>
    </Link>
  )
}

export default BotonCampo;