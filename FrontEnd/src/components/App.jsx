import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';


//Componentes
import CamposCard from '../pages/Home/components/CamposCard/CamposCard';
import CampoNew from '../pages/NuevoCampo/components/CampoNew/CampoNew';
import CampoDetail from '../pages/DetalleCampo/components/CampoDetail/CampoDetail';
import Login from '../pages/Login/components/Login/Login';
import VisorPDF from '../pages/VerPDF/components/PDFViewer/PDFViewer';
import NotFound from './NotFound/NotFound';
import Analisis from '../pages/Analisis/components/Analisis/Analisis';
import DiagnosticoList from '../pages/Diagnostico/components/DiagnosticoList/DiagnosticoList';
import ProductorList from '../pages/Productores/components/ProductorList/ProductorList';
import LaboratorioList from '../pages/Laboratorio/components/LaboratorioList/LaboratorioList';

//Context
import { ModoPDFProvider } from '../context/ModoPDFContext';
import { HayAnalisisProvider } from '../context/HayAnalisisContext';
import { IdDiagnosticoProvider } from '../context/IdDiagnosticoContext';

function App() {

  return (
    <HashRouter>
      <ModoPDFProvider>
        <HayAnalisisProvider>
            <IdDiagnosticoProvider>
            <Routes> 
              <Route path='/' element = {<Login />} /> 
              <Route path='/home' element = {<CamposCard />} /> 
              <Route path='/nuevocampo' element = {<CampoNew />} />
              <Route path='/detalleCampo/:idCampo'  element = {<CampoDetail/>} />
              <Route path='/verPDF/:idTomaMuestra'  element = {<VisorPDF/>} />
              <Route path='/analisis/:idTomaMuestra'  element = {<Analisis/>} />
              <Route path='/diagnostico/:idTomaMuestra'  element = {<DiagnosticoList/>} />
              <Route path='/productores'  element = {<ProductorList/>} />
              <Route path='/laboratorios'  element = {<LaboratorioList/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </IdDiagnosticoProvider>
        </HayAnalisisProvider>
      </ModoPDFProvider>
    </HashRouter>
  )
}

export default App