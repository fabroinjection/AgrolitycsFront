//Estilos
import './ProductorCard.css';

//Imagenes iconos
import iconoUsuario from '../../../../assets/iconoUsuario.png';
import iconoBorrar from '../../../../assets/iconoBorrar.png';
import iconoDropdown from "../../../../assets/iconoDropdown.png"

//import hooks
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import components
import ProductorAMC from '../ProductorAMC/ProductorAMC';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Error from '../../../../components/Modals/Error/Error';
import Stack from 'react-bootstrap/Stack';
import { Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';

//import services
import { eliminarProductorService } from '../../services/productor.service';
import { renewToken } from '../../../../services/token.service';
import Confirm from '../../../../components/Modals/Confirm/Confirm';

function ProductorCard({ productor, accionActualizarLista }){

        let navigate = useNavigate();
    
        //variable para manejar que se muestre el form de ProductorAMC
        const [ mostrarForm, setMostrarForm ] = useState(false);
        
        //variable para manejar la alerta de eliminacion
        const [ mostrarAlertaEliminacion, setMostrarAlertaEliminacion ] = useState(false);

        //variable para informar al usuario que fue eliminado correctamente
        const [ mostrarEliminacionExitosa, setMostrarEliminacionExitosa ] = useState(false);

        //variables para manejar el renderizado de alertas de error
        const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
        const [ mostrarErrorEliminacion, setMostrarErrorEliminacion ] = useState(false);
        const [ mostrarErrorCamposAsociados, setMostrarErrorCamposAsociados ] = useState(false);

        const modificarProductor = () => {
            accionActualizarLista();
            setMostrarForm(false);
        }

        const handleAlertaElimininacionCorrecta = (confirm) => {
            if(confirm){
                accionActualizarLista();
                setMostrarEliminacionExitosa(false);
            }
        }

        const eliminarProductor = async (confirm) => {
            if(confirm){
                try {
                    setMostrarAlertaEliminacion(false);
                    await eliminarProductorService(productor.id);
                    setMostrarEliminacionExitosa(true);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                          await renewToken();
                          setMostrarAlertaEliminacion(false);
                          await eliminarProductorService(productor.id);
                          setMostrarEliminacionExitosa(true);
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                          if(error.response.status === 302){
                            setMostrarErrorCamposAsociados(true);
                          }
                          else{
                            setMostrarErrorEliminacion(true);
                          }
                        }
                      }
                      if(error.response.status === 302){
                        setMostrarErrorCamposAsociados(true);
                      }
                      else{
                        setMostrarErrorEliminacion(true);
                      } 
                }
                
            }
            else{
                setMostrarAlertaEliminacion(false);
            }
            
        }

        const handleSesionExpirada = () =>{
            setMostrarErrorVencimientoToken(false);
            navigate("/");
            window.localStorage.removeItem('loggedAgroUser');
        }

        const agregarGuiones = (cuil) => {
            if (cuil.length < 11) {
                return cuil;
            }
        
            return `${cuil.substring(0, 2)}-${cuil.substring(2, 10)}-${cuil.substring(10)}`;
        }

        return(
            <>
                <Stack direction="horizontal" gap={0} className="productorCard">
                    <div className="p-2">
                        <strong className="nombreProductor">{productor.nombre} {productor.apellido} - {agregarGuiones(productor.cuit_cuil)}</strong>
                    </div>

                    {/* Mostrar botones solo en pantallas grandes */}
                    <div className="p-2 ms-auto pantalla-grande-productores">
                        <button className="botonesProductorCard" onClick={() => setMostrarForm(true)}>
                            <img className="iconosProductorCard" src={iconoUsuario} alt=""/>
                        </button>
                        <button className="botonesProductorCard" onClick={() => setMostrarAlertaEliminacion(true)}>
                            <img className="iconosProductorCard" src={iconoBorrar} alt=""/>
                        </button>
                    </div>

                    {/* Mostrar dropdown solo en pantallas chicas */}
                    <div className='p-2 ms-auto pantalla-chica-productores'>
                        <Dropdown className="botonesLoteCard">
                            <Dropdown.Toggle variant="transparent" id="dropdown-menu" className='custom-toggle'>
                                <img className="icono-dropdown" src={iconoDropdown} alt="" title='ver'/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item className="custom-modificar-item" onClick={() => setMostrarForm(true)}>
                                    Ver
                                </Dropdown.Item>
                                <Dropdown.Item className="custom-eliminar-item" onClick={() => setMostrarAlertaEliminacion(true)}>
                                    Eliminar
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>   
                    </div>
                </Stack>

                {
                    mostrarForm && <ProductorAMC accionCancelar={() => setMostrarForm(false)}
                    accionConfirmar={modificarProductor} modo={"Consultar"} productor={productor}/>
                }

                {
                    mostrarAlertaEliminacion && <Alerta texto={"¿Desea eliminar el productor?"} nombreBoton={"Eliminar"} onConfirm={eliminarProductor}/>
                }

                {       
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {
                    mostrarErrorEliminacion &&
                    <Error texto={"Ha ocurrido un error eliminando su productor, intente de nuevo más tarde"} 
                    onConfirm={() => setMostrarErrorEliminacion(false)}/>
                }

                {
                    mostrarErrorCamposAsociados &&
                    <Error texto={"No se puede eliminar un productor que tiene campos asociados"} 
                    onConfirm={() => setMostrarErrorCamposAsociados(false)}/>
                }

                {
                    mostrarEliminacionExitosa && <Confirm texto={"El productor ha sido eliminado correctamente"} onConfirm={handleAlertaElimininacionCorrecta}/>
                }
                
            </>
        )
    }


export default ProductorCard;