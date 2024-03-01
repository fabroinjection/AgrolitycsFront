// import services
import { fertilizantesByNombreService } from "../services/tratamientoAlta.service";

export async function crearObjetoParaSolicitud(idDiagnostico, observaciones, fertilizantesSel, kgHaPerHaValues, fertilizantesDiagnostico) {
    const tratamientoIn = {
      diagnostico_id: parseInt(idDiagnostico),
      observaciones: observaciones
    };

    // se toma el diccionario de fertilizantes recomendados por el diagnóstico, se filtra solo para los que se tiene valor de kgHa y se los agrega a un vector
    // con la forma necesaria para el endpoint
    const fertilizantesDiagnosticoFiltrados = [];

    for (const [fertilizante, kgHa] of Object.entries(fertilizantesDiagnostico)) {
      if (kgHa !== 0) {
        try {
          const { data } = await fertilizantesByNombreService(fertilizante);
          const fertilizanteFiltrado = {
            fertilizante_id: data.id,
            kg_ha: parseFloat(kgHa)
          }
          fertilizantesDiagnosticoFiltrados.push(fertilizanteFiltrado);
        } catch (error) {
          console.error(`Error al obtener el id del fertilizante ${fertilizante}:`, error);
        }
      }
    }

  
    // se toma los pares key/value de los fertilizantes seleccionados y los kgHa y se los agrega a un vector con la forma necesaria para el endpoint 
    const fertilizantes = Object.keys(fertilizantesSel).map((key) => {
      const fertilizante_id = fertilizantesSel[key].value;
      const kg_ha = parseFloat(kgHaPerHaValues[key]);
      return { fertilizante_id, kg_ha };
    });


    // Se arma un nuevo array que inicialmente contiene los valores de los fertilizantes recomendados por el diagnóstico
    let vectorFertilizantesTratamiento = [...fertilizantesDiagnosticoFiltrados];

    // Por cada uno de los fertilizantes agregados, se busca si ese fertilizante está entre los originales y si existe
    // se retorna falso y si no, se agrega el fertilizante al array.
    for (const fertilizante of fertilizantes) {
      const foundIndex = vectorFertilizantesTratamiento.findIndex(f => f.fertilizante_id === fertilizante.fertilizante_id);
        if (foundIndex !== -1) {
            return false;
        } else {
            vectorFertilizantesTratamiento.push({ fertilizante_id: fertilizante.fertilizante_id, kg_ha: fertilizante.kg_ha });
        }
    }


    return {
      tratamiento_in: tratamientoIn,
      fertilizantes: vectorFertilizantesTratamiento
    };
  }
