import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { processPortabilityData } from '../utils/dataTransforms';

// We fall back to mockData elements for the ones that don't change (e.g OD Matrix)
import { churnData, destShares, odMatrix, towerCoTenants } from '../data/mockData';

export const usePortabilityData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);

    const updateState = (donanteCsv, receptorCsv, netoCsv, updateJson) => {
        // Process them into the dashboard format
        const processed = processPortabilityData(receptorCsv, donanteCsv, netoCsv);

        setData({
            annualOps: processed.annualOps,
            monthlyOps: processed.monthlyOps,
            netResultsOMR: processed.netResultsOMR,
            donorQ2_2025: processed.donorLatest,
            receptorQ2_2025: processed.receptorLatest,
            metadata: {
                ...processed.metadata,
                lastSync: updateJson?.timestamp || null
            },
            // Static mock data that we aren't transforming from these CSVs
            churnData,
            destShares,
            odMatrix,
            towerCoTenants
        });
    };

    const syncData = async () => {
        setSyncing(true);
        setError(null);
        try {
            const externalUrls = [
                'https://www.datos.gov.co/api/views/6qf7-9gvu/rows.csv?accessType=DOWNLOAD', // Donante
                'https://www.datos.gov.co/api/views/2w58-6nhq/rows.csv?accessType=DOWNLOAD', // Receptor
                'https://www.datos.gov.co/api/views/b3vi-b83r/rows.csv?accessType=DOWNLOAD'  // Neto
            ];

            const [dRes, rRes, nRes] = await Promise.all(externalUrls.map(url => fetch(url)));

            if (!dRes.ok || !rRes.ok || !nRes.ok) {
                throw new Error("Error conectando con los servidores de la CRC (PostData)");
            }

            const [dText, rText, nText] = await Promise.all([dRes.text(), rRes.text(), nRes.text()]);

            const dCsv = Papa.parse(dText, { header: true, delimiter: ",", skipEmptyLines: true }).data;
            const rCsv = Papa.parse(rText, { header: true, delimiter: ",", skipEmptyLines: true }).data;
            const nCsv = Papa.parse(nText, { header: true, delimiter: ",", skipEmptyLines: true }).data;

            updateState(dCsv, rCsv, nCsv, { timestamp: new Date().toISOString() });
            return true;
        } catch (err) {
            console.error("Sync error:", err);
            setError("Error sincronizando: " + err.message);
            return false;
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch the CSV files from the public folder
                const [donanteRes, receptorRes, netoRes, updateRes] = await Promise.all([
                    fetch('/data/Operaciones_Portación_Donante_1.csv'),
                    fetch('/data/Operaciones_Portación_Receptor_1.csv'),
                    fetch('/data/PNM_RECEPTOR_NETO_1.csv'),
                    fetch('/data/last_update.json').catch(() => null)
                ]);

                if (!donanteRes.ok || !receptorRes.ok || !netoRes.ok) {
                    throw new Error("Failed to load one or more CSV files");
                }

                const [donanteText, receptorText, netoText, updateJson] = await Promise.all([
                    donanteRes.text(),
                    receptorRes.text(),
                    netoRes.text(),
                    updateRes && updateRes.ok ? updateRes.json() : null
                ]);

                const dCsv = Papa.parse(donanteText, { header: true, delimiter: ";", skipEmptyLines: true }).data;
                const rCsv = Papa.parse(receptorText, { header: true, delimiter: ";", skipEmptyLines: true }).data;
                const nCsv = Papa.parse(netoText, { header: true, delimiter: ";", skipEmptyLines: true }).data;

                updateState(dCsv, rCsv, nCsv, updateJson);
            } catch (err) {
                console.error("Error loading CSV data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, loading, syncing, error, syncData };
};
