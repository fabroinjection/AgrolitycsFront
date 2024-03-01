export const obtenerPronostico5Dias = (weatherData) => {
    const weatherForecast = weatherData.list;

    const dailyForecast = {};

    weatherForecast.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' });

        // Si es un nuevo día, almacenar ese pronóstico
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }

        dailyForecast[date].push(forecast);
    });

    // Convertir el objeto en un array de pronósticos por día
    const pronostico5Dias = Object.values(dailyForecast);

    // Devolver el pronóstico de 5 días para Argentina
    return pronostico5Dias;
}