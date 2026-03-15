// Vercel Serverless Function to proxy CSV data and bypass CORS
import axios from 'axios';

export default async function handler(req, res) {
    const { type } = req.query;

    const urls = {
        donante: 'https://www.postdata.gov.co/sites/default/files/Operaciones_Portaci%C3%B3n_Donante_1.csv',
        receptor: 'https://www.postdata.gov.co/sites/default/files/Operaciones_Portaci%C3%B3n_Receptor_1.csv',
        neto: 'https://www.postdata.gov.co/sites/default/files/PNM_RECEPTOR_NETO_1.csv'
    };

    const targetUrl = urls[type];

    if (!targetUrl) {
        return res.status(400).json({ error: 'Invalid data type requested' });
    }

    try {
        const response = await axios({
            method: 'GET',
            url: targetUrl,
            responseType: 'arraybuffer', // Get as buffer to handle potential encoding issues
            timeout: 15000 // 15s timeout
        });

        // Set headers to allow CORS (though Vercel handles this, it's safer to be explicit)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');

        // Return the data
        return res.status(200).send(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch data from source', details: error.message });
    }
}
