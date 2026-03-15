export const processPortabilityData = (opReceptorRaw, opDonanteRaw, netReceiverRaw) => {
    // Helper to transform cumulative files from Datos Abiertos to incremental monthly snapshots
    const decumulate = (data, valueKey) => {
        const grouped = {};
        data.forEach(row => {
            const emp = row.EMPRESA;
            if (!grouped[emp]) grouped[emp] = [];
            grouped[emp].push({ ...row, y: parseInt(row.ANNO) || 0, m: parseInt(row.MES) || 0, val: parseFloat(row[valueKey]) || 0 });
        });

        const result = [];
        Object.values(grouped).forEach(rows => {
            rows.sort((a, b) => a.y === b.y ? a.m - b.m : a.y - b.y);
            let prevVal = 0;
            rows.forEach((row) => {
                const incremental = row.val - prevVal;
                prevVal = row.val;
                result.push({ ...row, [valueKey]: incremental });
            });
        });
        return result;
    };

    const opReceptor = decumulate(opReceptorRaw, "OPERACIONES_PORTACION");
    const opDonante = decumulate(opDonanteRaw, "OPERACIONES_PORTACION");
    const netReceiver = decumulate(netReceiverRaw, "PNM_RECEPTOR_NETO");

    // Determine the latest period available in the dataset
    let maxYear = 0;
    let maxMonth = 0;

    opReceptor.forEach(row => {
        const year = parseInt(row.ANNO);
        const month = parseInt(row.MES);
        if (year > maxYear) {
            maxYear = year;
            maxMonth = month;
        } else if (year === maxYear && month > maxMonth) {
            maxMonth = month;
        }
    });

    // 1. Annual portability operations (millions)
    const annualOpsMap = {};
    opReceptor.forEach(row => {
        const year = parseInt(row.ANNO);
        const ops = parseInt(row.OPERACIONES_PORTACION) || 0;

        if (!annualOpsMap[year]) annualOpsMap[year] = { year, total: 0, q2Total: 0 };
        annualOpsMap[year].total += ops;

        if (parseInt(row.TRIMESTRE) === 2) {
            annualOpsMap[year].q2Total += ops;
        }
    });

    const annualOps = Object.values(annualOpsMap)
        .sort((a, b) => a.year - b.year)
        .map(d => ({
            year: d.year,
            ops: parseFloat((d.total / 1000000).toFixed(2)),
            q2: d.year >= 2015 ? parseFloat((d.q2Total / 1000000).toFixed(2)) : null
        }));

    // 2. Monthly operations (thousands)
    const monthlyOpsMap = {};
    opReceptor.forEach(row => {
        const year = parseInt(row.ANNO);
        if (year >= 2022) {
            const m = `${year}-${String(row.MES).padStart(2, '0')}`;
            if (!monthlyOpsMap[m]) monthlyOpsMap[m] = 0;
            monthlyOpsMap[m] += parseInt(row.OPERACIONES_PORTACION) || 0;
        }
    });
    const monthlyOps = Object.keys(monthlyOpsMap)
        .sort()
        .map(m => ({ m, v: Math.round(monthlyOpsMap[m] / 1000) }));

    // 3. Net results by OMR (thousands)
    const operatorsOfInterest = ["CLARO", "MOVISTAR", "TIGO", "WOM"];
    const normalizeOperator = (emp) => {
        if (!emp) return "OTROS";
        emp = emp.toUpperCase();
        if (emp.includes("COMCEL") || emp.includes("CLARO")) return "CLARO";
        if (emp.includes("COLOMBIA TELECOMUNICACIONES") || emp.includes("MOVISTAR")) return "MOVISTAR";
        if (emp.includes("COLOMBIA MÓVIL") || emp.includes("TIGO")) return "TIGO";
        if (emp.includes("WOM") || emp.includes("PARTNERS TELECOM")) return "WOM";
        if (emp.includes("AVANTEL")) return "WOM"; // Legacy WOM
        if (emp.includes("EXITO")) return "ÉXITO";
        if (emp.includes("BOGOTA") || emp.includes("ETB")) return "ETB";
        if (emp.includes("VIRGIN")) return "VIRGIN";
        if (emp.includes("FLASH")) return "FLASH MOBILE";
        if (emp.includes("SUMA")) return "SUMA";
        if (emp.includes("SETROC")) return "SETROC";
        return "OTROS";
    };

    const netResultsMap = {};
    netReceiver.forEach(row => {
        const year = parseInt(row.ANNO);
        const month = parseInt(row.MES);
        if (year >= 2022 && [1, 4, 7, 10].includes(month)) { // Quarterly snapshots
            const m = `${year}-${String(month).padStart(2, '0')}`;
            const op = normalizeOperator(row.EMPRESA);
            const net = parseInt(row.PNM_RECEPTOR_NETO) || 0;

            if (operatorsOfInterest.includes(op)) {
                if (!netResultsMap[m]) netResultsMap[m] = { m, CLARO: 0, MOVISTAR: 0, TIGO: 0, WOM: 0 };
                netResultsMap[m][op] += net;
            }
        }
    });

    const netResultsOMR = Object.values(netResultsMap).sort((a, b) => a.m.localeCompare(b.m)).map(d => {
        return {
            m: d.m,
            CLARO: parseFloat((d.CLARO / 1000).toFixed(1)),
            MOVISTAR: parseFloat((d.MOVISTAR / 1000).toFixed(1)),
            TIGO: parseFloat((d.TIGO / 1000).toFixed(1)),
            WOM: parseFloat((d.WOM / 1000).toFixed(1))
        }
    });

    // 4. Latest operations (thousands) by donor/receptor
    const summarizeLatestQuarter = (data) => {
        const currentQData = {};
        const prevQData = {};

        let targetQ = Math.ceil(maxMonth / 3);
        let targetYear = maxYear;

        let prevQ = targetQ - 1;
        let prevYear = targetYear;
        if (prevQ === 0) {
            prevQ = 4;
            prevYear--;
        }

        data.forEach(row => {
            const y = parseInt(row.ANNO);
            const q = parseInt(row.TRIMESTRE);
            const op = normalizeOperator(row.EMPRESA);
            const ops = parseInt(row.OPERACIONES_PORTACION) || 0;

            if (y === targetYear && q === targetQ) {
                currentQData[op] = (currentQData[op] || 0) + ops;
            } else if (y === prevYear && q === prevQ) {
                prevQData[op] = (prevQData[op] || 0) + ops;
            }
        });

        return Object.keys(currentQData).map(op => {
            const val = currentQData[op] / 1000;
            const prev = (prevQData[op] || 0) / 1000;
            const var_pct = prev > 0 ? ((val - prev) / prev) * 100 : 0;
            return {
                op,
                val: parseFloat(val.toFixed(1)),
                prev: parseFloat(prev.toFixed(1)),
                var_pct: parseFloat(var_pct.toFixed(1))
            }
        }).sort((a, b) => b.val - a.val);
    };

    const donorLatest = summarizeLatestQuarter(opDonante).slice(0, 10);
    const receptorLatest = summarizeLatestQuarter(opReceptor).slice(0, 10);

    return {
        annualOps,
        monthlyOps,
        netResultsOMR,
        donorLatest,
        receptorLatest,
        metadata: {
            lastYear: maxYear,
            lastMonth: maxMonth,
            lastQuarter: Math.ceil(maxMonth / 3)
        }
    };
};
