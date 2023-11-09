import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"
import logoApp from "../../assets/logoApp.jpg";
import marcaApp from "../../assets/marcaApp.png"


// Definición de estilos
const styles = StyleSheet.create({
    imagen: {
        height:"50px", 
        width:"50px",
    },

    nombre: {
        fontSize: "40px",
    },

    contenedor: {
        flexDirection: "row",
        justifyContent: "center",
    },

    info: {

    },

    nameLote: {
        fontSize: "30px",
    }
});

const PDFSubmuestras = ({imagen}) => {

    // Declaración de variables
    const nombreLote = "Lote 1";
    const codigoTm = "TM-0001";
    const tipoMuestreo = "Aleatorio";
    const cantidadSubmuestras = "20";

    return (
        <Document>
            <Page size="A4">
                <View style={{margin:"50px"}}>
                    {/* Logo y nombre App*/}
                    <View style={styles.contenedor}>
                        {/* <Image 
                            src={logoApp}
                            style={styles.imagen}
                        />
                        <Text style={styles.nombre}>
                            Agrolitycs
                        </Text> */}
                        <Image 
                            src={marcaApp}
                            style={styles.imagen}
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.nameLote}>{nombreLote}</Text>
                        <Text  >{`${codigoTm} - Muestreo ${tipoMuestreo} - ${cantidadSubmuestras} submuestras`}</Text>
                    </View>

                    {/* ACÁ Falta colocar la imagen del mapa con la biblioteca html2canvas - A esto lo tenemos que hacer juntos Fabri */}

                    <Image 
                            src={imagen}
                    />


                </View>
                

            </Page>
        </Document>
    );
};

export default PDFSubmuestras;