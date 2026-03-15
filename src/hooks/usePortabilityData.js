import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { processPortabilityData } from '../utils/dataTransforms';

// We fall back to mockData elements for the ones that don't change (e.g OD Matrix)
import { churnData, destShares, odMatrix, towerCoTenants } from '../data/mockData';

export const usePortabilityData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                // Parse the CSVs using PapaParse
                const donanteCsv = Papa.parse(donanteText, { header: true, delimiter: ";", skipEmptyLines: true }).data;
                const receptorCsv = Papa.parse(receptorText, { header: true, delimiter: ";", skipEmptyLines: true }).data;
                const netoCsv = Papa.parse(netoText, { header: true, delimiter: ";", skipEmptyLines: true }).data;

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
            } catch (err) {
                console.error("Error loading CSV data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, loading, error };
};
