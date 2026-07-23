// Vercel Serverless Function to proxy CSV data and bypass CORS
import axios from 'axios';

export default async function handler(req, res) {
    const { type } = req.query;

    // Paginas de recurso (slug ESTABLE): resolvemos el link de descarga en vivo.
    const resourcePages = {
        donante: 'https://www.postdata.gov.co/resource/operaciones-de-portacion-por-proveedor-donante',
        receptor: 'https://www.postdata.gov.co/resource/operaciones-de-portacion-por-proveedor-receptor',
        neto: 'https://www.postdata.gov.co/resource/pnm-receptor-neto'
    };
    // Respaldo por ID (176 = donante, 175 = receptor, 207 = neto).
    const fallbackUrls = {
        donante: 'https://www.postdata.gov.co/resource/176/download/file',
        receptor: 'https://www.postdata.gov.co/resource/175/download/file',
        neto: 'https://www.postdata.gov.co/resource/207/download/file'
    };

    if (!resourcePages[type] && !fallbackUrls[type]) {
        return res.status(400).json({ error: 'Invalid data type requested' });
    }

    // Resuelve el link de descarga actual desde la pagina del recurso.
    let targetUrl = fallbackUrls[type];
    try {
        const page = await axios({ method: 'GET', url: resourcePages[type], responseType: 'text', timeout: 15000 });
        const match = String(page.data).match(/\/resource\/(\d+)\/download\/file/);
        if (match) targetUrl = `https://www.postdata.gov.co/resource/${match[1]}/download/file`;
    } catch (e) {
        // usar respaldo
    }

    try {
        const response = await axios({
            method: 'GET',
            url: targetUrl,
            responseType: 'arraybuffer', // Get as buffer to handle potential encoding issues
            timeout: 30000
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
