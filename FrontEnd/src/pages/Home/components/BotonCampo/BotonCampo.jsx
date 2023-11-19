// import componentes
import { Link } from 'react-router-dom'

// import estilos
import './BotonCampo.css'
import iconoCampo from '../../../../assets/iconoConsultarCampo.png';



function BotonCampo({ nombreCampo, idCampo }) {
  return (
    <Link className="linkAlCampo" to={`/detalleCampo/${idCampo}`}>
      <button className="btnCampo">
              <img className="iconoConsultarCampo" src={iconoCampo} alt="" />
              <strong className='nombreCampo letraInter'>{nombreCampo}</strong>                          
      </button>
    </Link>
  )
}

export default BotonCampo