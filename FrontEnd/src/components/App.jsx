import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { HashRouter, Routes, Route } from 'react-router-dom';


//Componentes
import CamposCard from '../pages/Home/components/CamposCard/CamposCard';
import CampoDetail from '../pages/DetalleCampo/components/CampoDetail/CampoDetail';
import Login from '../pages/Login/components/Login/Login';
import VisorPDF from '../pages/VerPDF/components/PDFViewer/PDFViewer';
import NotFound from './NotFound/NotFound';
import Analisis from '../pages/Analisis/components/Analisis/Analisis';
import DiagnosticoList from '../pages/Diagnostico/components/DiagnosticoList/DiagnosticoList';
import ProductorList from '../pages/Productores/components/ProductorList/ProductorList';
import LaboratorioList from '../pages/Laboratorio/components/LaboratorioList/LaboratorioList';
import TerminosyCondiciones from './TerminosyCondiciones/TerminosyCondiciones';
import RegistrarUsuario from '../pages/RegistrarUsuario/components/RegistrarUsuario/RegistrarUsuario';
import SolicitudRestablecerPassword from '../pages/SolicitudRestablecerContraseña/components/SolicitudRestablecerPassword/SolicitudRestablecerPassword.jsx';
import RestablecerPassword from '../pages/RestablecerContraseña/components/RestablecerPassword/ReestablecerPassword.jsx';
import GestionarCuenta from '../pages/GestionarCuenta/components/GestionarCuenta/GestionarCuenta';
import VerificacionEmail from '../pages/VerificacionEmail/components/VerificacionEmail';
import Educacion from './Educacion/Educacion.jsx';
import ActivarUsuario from '../pages/ActivarUsuario/components/ActivarUsuario.jsx';
import TratamientoRealizado from '../pages/TratamientoRealizado/components/TratamientoRealizado/TratamientoRealizado.jsx';
import ListadoEstadisticas from '../pages/Estadisticas/components/listadoEstadisticas.jsx';
import NutrientesPorLote from '../pages/Estadisticas/components/NutrientesPorLote.jsx';
import PorcentajeFertilizantesLote from '../pages/Estadisticas/components/PorcentajeFertilizantesLote.jsx';
import ListadoTratamientos from '../pages/Tratamientos/components/ListadoTratamiento/ListadoTratamientos.jsx';
import Help from '../pages/Help/Help.jsx';
import { ToastContainer } from 'react-toastify';

//Context
import { ModoPDFProvider } from '../context/ModoPDFContext';
import { HayAnalisisProvider } from '../context/HayAnalisisContext';
import { IdDiagnosticoProvider } from '../context/IdDiagnosticoContext';
import { UsuarioProvider } from '../context/UsuarioContext.jsx';

function App() {

  return (
    <HashRouter>
      <ModoPDFProvider>
        <HayAnalisisProvider>
            <IdDiagnosticoProvider>
              <UsuarioProvider>
                <ToastContainer />
                <Routes> 
                  <Route path='/' element = {<Login />} /> 
                  <Route path='/home' element = {<CamposCard />} /> 
                  <Route path='/detalleCampo/:idCampo'  element = {<CampoDetail/>} />
                  <Route path='/verPDF/:idTomaMuestra'  element = {<VisorPDF/>} />
                  <Route path='/analisis/:idTomaMuestra'  element = {<Analisis/>} />
                  <Route path='/diagnostico/:idTomaMuestra'  element = {<DiagnosticoList/>} />
                  <Route path='/productores'  element = {<ProductorList/>} />
                  <Route path='/laboratorios'  element = {<LaboratorioList/>} />
                  <Route path='/terminosycondiciones'  element = {<TerminosyCondiciones/>} />
                  <Route path='/registrarusuario'  element = {<RegistrarUsuario/>} />
                  <Route path='/verificacionEmail'  element = {<VerificacionEmail/>} />
                  <Route path='/solicitudRestablecerContraseña'  element = {<SolicitudRestablecerPassword/>} />
                  <Route path='/restablecerContraseña'  element = {<RestablecerPassword/>} />
                  <Route path='/gestionarcuenta'  element = {<GestionarCuenta/>} />
                  <Route path='/info'  element = {<Educacion/>} />
                  <Route path='/activarUsuario'  element = {<ActivarUsuario/>} />
                  <Route path='/tratamientoRealizado/:idTomaMuestra'  element = {<TratamientoRealizado/>} />
                  <Route path='/nutrientes-por-lote'  element = {<NutrientesPorLote/>} />
                  <Route path='/porcentaje-fertilizantes'  element = {<PorcentajeFertilizantesLote/>} />
                  <Route path='/estadisticas'  element = {<ListadoEstadisticas/>} />
                  <Route path='/tratamientos'  element = {<ListadoTratamientos/>} />
                  <Route path='/help'  element = {<Help/>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </UsuarioProvider>
            </IdDiagnosticoProvider>
        </HayAnalisisProvider>
      </ModoPDFProvider>
    </HashRouter>
  )
}

export default App