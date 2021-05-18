const fs = require('fs');

const axios = require('axios').default;
class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();

    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1));

            return palabras.join(' ');
        })
    }

    get params() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'cachebuster': 1621295684599,
            'autocomplete': true,
            'limit':5
        }
    }

    async ciudad(lugar = '') {
        // Peticion http
        // console.log('ciudad', lugar)
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.params
            });
    
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }

        // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/bogota.json?access_token=pk.eyJ1Ijoibmlrb21hcnRpbjE2IiwiYSI6ImNrb3Q5Zmo0aDA3eGoycHJyZHMzd3RubnAifQ.wyZZKxdMr3ROjuvIZcVgyA&cachebuster=1621295684599&autocomplete=true&limit=5');
        
    }

    async climaLugar(lat, lon) {
        try {
            // instancia de axios.create
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    lat,
                    lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    lang: 'es'
                }
            });
            // respuesta
            const resp = await instance.get();
            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = '') {
        // prevenir duplicados

        if(this.historial.includes(lugar.toLowerCase())){
            return
        }

        this.historial.unshift(lugar.toLowerCase());

        // grabar en DB
        this.guardarDB();

    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if(!fs.existsSync(this.dbPath)){
            return null;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}

module.exports = Busquedas