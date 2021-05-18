require('dotenv').config()

const { leerInput, inquireMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {

    let opt;
    const busquedas = new Busquedas();

    do {
        opt = await inquireMenu();

        switch(opt) {
            case 1:
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                // Buscar los lugar
                const lugares = await busquedas.ciudad(lugar);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if( id === '0' ) continue;

                // Guardar DB
                
                const lugarSeleccionado = lugares.find((lugar) => lugar.id === id);
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                const {lat, lng} = lugarSeleccionado;
              

                // Datos del clima
                const clima = await busquedas.climaLugar(lat, lng);
                console.log(clima);


                

                // Mostar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.blue);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('EL estado del tiempo es : ', clima.desc);
         
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    console.log(`${i + 1} ${lugar}`)
                });
                // busquedas.historial.forEach((lugar, i) => {
                //     console.log(`${i + 1} ${lugar}`)
                // })

                break;
            }


        await pausa();

    } while(opt !== 0)
}

main();