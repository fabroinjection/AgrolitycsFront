import { useState, useEffect } from "react"
import { camposService } from "../../../services/campo.service";
import { Link } from "react-router-dom";

import './CamposDropdown.css'



export default function CamposDropdown() {
  const [campos, setCampos] = useState([]);
  

  useEffect(() => {
    const fetchCampos = async () =>{
      try {
        const { data } = await camposService();
        setCampos(data);
      } catch (error) {
        //
      }
    }

    fetchCampos();
  }, [])
  
  

  return (
    <>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Mis Campos
          </a>
          <ul className="dropdown-menu">
          {
                campos.map( campo =>
                  //<Link className="haciaCampo" key={campo.id} to={`/detalleCampo/${campo.id}`}><li>{campo.nombre}</li></Link>
                  <li key={campo.id}><Link className="haciaCampo"  to={`/detalleCampo/${campo.id}`}>{campo.nombre}</Link></li>
                )
          }
          </ul>
          </li>
    </>
  )
}
