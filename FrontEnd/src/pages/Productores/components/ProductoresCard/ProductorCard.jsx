//Estilos
import './ProductorCard.css'

//Imagenes iconos
import iconoVer from '../../../../assets/iconoVer.png';
import iconoEliminar from '../../../../assets/iconoEliminar.png';

function ProductorCard(){


        return(
            <>
                <article className="productorCard">
                    <header className="cabeceraProductor">                    
                        <strong className="nombreProductor">Juan Pablo Ramírez 20-41756435-5</strong>
                        <aside>
                            <button className="botonesProductorCard" >
                                <img className="iconosProductorCard" src={iconoVer} alt=""/>
                            </button>
                            <button className="botonesProductorCard" >
                                <img className="iconosProductorCard" src={iconoEliminar} alt=""/>
                            </button>
                        </aside>
                    </header>
                </article>
            </>
        )
    }


export default ProductorCard;