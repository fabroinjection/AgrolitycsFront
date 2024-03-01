import './SpinnerAgrolitycs.css';
import logoAgrolitycs from '../../assets/logoAgrolitycs.png';


function SpinnerAgrolitycs() {

    return(
        <>
            <div className='spinner'>
                <div className='spinner-centrado'>
                    <img src={logoAgrolitycs} alt="" className='spinner-imagen'/>
                    <h4 className='spinner-text'>Cargando...</h4>
                </div>

            </div>
        </>
    );
}

export default SpinnerAgrolitycs;
