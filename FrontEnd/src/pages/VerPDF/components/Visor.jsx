import PDFDiagnosticoAgua from "../../../components/PDF/PDFDiagnosticoAgua";
import { PDFViewer } from "@react-pdf/renderer";

function Visor() {

    return(

        <PDFViewer style={{width:"100%", height:"100vh"}}>
            <PDFDiagnosticoAgua>

            </PDFDiagnosticoAgua>
        </PDFViewer>
    );
}

export default Visor;

