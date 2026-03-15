/* eslint-env node */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasets = [
    {
        name: 'Operaciones_Portación_Donante_1.csv',
        url: 'https://www.datos.gov.co/api/views/6qf7-9gvu/rows.csv?accessType=DOWNLOAD'
    },
    {
        name: 'Operaciones_Portación_Receptor_1.csv',
        url: 'https://www.datos.gov.co/api/views/2w58-6nhq/rows.csv?accessType=DOWNLOAD'
    },
    {
        name: 'PNM_RECEPTOR_NETO_1.csv',
        url: 'https://www.datos.gov.co/api/views/b3vi-b83r/rows.csv?accessType=DOWNLOAD'
    }
];

const destDir = path.join(__dirname, 'public', 'data');

async function downloadDataset(dataset) {
    const filePath = path.join(destDir, dataset.name);
    console.log(`Downloading ${dataset.name}...`);

    try {
        const response = await axios({
            method: 'GET',
            url: dataset.url,
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            let stream = fs.createWriteStream(filePath);
            response.data.pipe(stream);
            stream.on('finish', () => {
                console.log(`✅ ${dataset.name} downloaded successfully!`);
                resolve();
            });
            stream.on('error', reject);
        });

    } catch (error) {
        console.error(`❌ Error downloading ${dataset.name}:`, error.message);
    }
}

async function updateAllData() {
    console.log('🔄 Empezando actualización de datos de portabilidad...');

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    try {
        await Promise.all(datasets.map(downloadDataset));

        // Guardar la fecha de última actualización
        const lastUpdate = { timestamp: new Date().toISOString() };
        fs.writeFileSync(path.join(destDir, 'last_update.json'), JSON.stringify(lastUpdate));

        console.log('🎉 ¡Todos los datos han sido actualizados exitosamente! Recarga el dashboard para ver la nueva data.');
    } catch (e) {
        console.error('Error general actualizando datos:', e);
    }
}

updateAllData();
