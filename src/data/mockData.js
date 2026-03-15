// Annual portability operations (millions) — from PDF chart page 2
export const annualOps = [
    { year: 2011, ops: 0.14, q2: null }, { year: 2012, ops: 0.69, q2: null },
    { year: 2013, ops: 1.06, q2: null }, { year: 2014, ops: 1.61, q2: null },
    { year: 2015, ops: 3.23, q2: 1.01 }, { year: 2016, ops: 3.38, q2: 1.04 },
    { year: 2017, ops: 3.48, q2: 0.64 }, { year: 2018, ops: 4.68, q2: 1.74 },
    { year: 2019, ops: 4.30, q2: 1.98 }, { year: 2020, ops: 3.97, q2: 2.06 },
    { year: 2021, ops: 6.92, q2: 1.74 }, { year: 2022, ops: 8.10, q2: null },
    { year: 2023, ops: 8.38, q2: null }, { year: 2024, ops: 7.08, q2: null },
    { year: 2025, ops: 3.34, q2: 1.64 },
];

// Monthly operations (thousands) — Jan 2022 to Jun 2025 (reconstructed from PDF charts)
export const monthlyOps = [
    { m: "2022-01", v: 620 }, { m: "2022-02", v: 585 }, { m: "2022-03", v: 710 },
    { m: "2022-04", v: 680 }, { m: "2022-05", v: 695 }, { m: "2022-06", v: 720 },
    { m: "2022-07", v: 655 }, { m: "2022-08", v: 690 }, { m: "2022-09", v: 660 },
    { m: "2022-10", v: 710 }, { m: "2022-11", v: 700 }, { m: "2022-12", v: 685 },
    { m: "2023-01", v: 650 }, { m: "2023-02", v: 630 }, { m: "2023-03", v: 745 },
    { m: "2023-04", v: 705 }, { m: "2023-05", v: 730 }, { m: "2023-06", v: 710 },
    { m: "2023-07", v: 690 }, { m: "2023-08", v: 720 }, { m: "2023-09", v: 695 },
    { m: "2023-10", v: 740 }, { m: "2023-11", v: 715 }, { m: "2023-12", v: 610 },
    { m: "2024-01", v: 605 }, { m: "2024-02", v: 580 }, { m: "2024-03", v: 620 },
    { m: "2024-04", v: 590 }, { m: "2024-05", v: 600 }, { m: "2024-06", v: 555 },
    { m: "2024-07", v: 580 }, { m: "2024-08", v: 610 }, { m: "2024-09", v: 590 },
    { m: "2024-10", v: 620 }, { m: "2024-11", v: 600 }, { m: "2024-12", v: 530 },
    { m: "2025-01", v: 575 }, { m: "2025-02", v: 545 }, { m: "2025-03", v: 580 },
    { m: "2025-04", v: 555 }, { m: "2025-05", v: 540 }, { m: "2025-06", v: 545 },
];

// Net results by OMR (thousands) — from PDF page 4 tables
export const netResultsOMR = [
    { m: "2022-01", CLARO: -45, MOVISTAR: 30, TIGO: -10, WOM: 25 },
    { m: "2022-04", CLARO: -30, MOVISTAR: 40, TIGO: -25, WOM: 15 },
    { m: "2022-07", CLARO: -55, MOVISTAR: 55, TIGO: -20, WOM: 20 },
    { m: "2022-10", CLARO: -40, MOVISTAR: 45, TIGO: -15, WOM: 10 },
    { m: "2023-01", CLARO: 16.8, MOVISTAR: 93.0, TIGO: -208.9, WOM: 154.8 },
    { m: "2023-04", CLARO: 25, MOVISTAR: 80, TIGO: -180, WOM: 120 },
    { m: "2023-07", CLARO: 30, MOVISTAR: 70, TIGO: -160, WOM: 100 },
    { m: "2023-10", CLARO: 50, MOVISTAR: 60, TIGO: -140, WOM: 80 },
    { m: "2024-01", CLARO: 239.2, MOVISTAR: 6.6, TIGO: -123.3, WOM: -110.3 },
    { m: "2024-04", CLARO: 12.7, MOVISTAR: 143.1, TIGO: -63.9, WOM: -39.9 },
    { m: "2024-07", CLARO: 80, MOVISTAR: 100, TIGO: -90, WOM: -60 },
    { m: "2024-10", CLARO: 120, MOVISTAR: 90, TIGO: -100, WOM: -80 },
    { m: "2025-01", CLARO: 150, MOVISTAR: 110, TIGO: -95, WOM: -140 },
    { m: "2025-04", CLARO: 182.4, MOVISTAR: 122.9, TIGO: -110.4, WOM: -175.8 },
];

// Donor operations 2025-Q2 (thousands) — from PDF page 8
export const donorQ2_2025 = [
    { op: "TIGO", val: 508.6, prev: 424.8, var_pct: 19.7 },
    { op: "MOVISTAR", val: 464.2, prev: 460.0, var_pct: 0.9 },
    { op: "CLARO", val: 321.2, prev: 423.3, var_pct: -24.1 },
    { op: "WOM", val: 285.4, prev: 377.5, var_pct: -24.4 },
    { op: "ÉXITO", val: 33.6, prev: 26.0, var_pct: 29.7 },
    { op: "ETB", val: 17.2, prev: 16.4, var_pct: 4.5 },
    { op: "VIRGIN", val: 7.7, prev: 7.6, var_pct: 1.2 },
    { op: "FLASH MOBILE", val: 0.2, prev: 4.8, var_pct: -95.3 },
    { op: "SUMA", val: 0.9, prev: 0.6, var_pct: 54.4 },
    { op: "SETROC", val: 0.3, prev: 0.2, var_pct: 27.1 },
];

// Receptor operations 2025-Q2 (thousands) — from PDF page 10
export const receptorQ2_2025 = [
    { op: "CLARO", val: 587.2, prev: 589.9, var_pct: -0.5 },
    { op: "MOVISTAR", val: 467.8, prev: 411.7, var_pct: 13.6 },
    { op: "TIGO", val: 322.7, prev: 385.0, var_pct: -16.2 },
    { op: "WOM", val: 210.8, prev: 304.3, var_pct: -30.7 },
    { op: "ÉXITO", val: 18.6, prev: 20.0, var_pct: -7.1 },
    { op: "ETB", val: 13.7, prev: 18.1, var_pct: -24.0 },
    { op: "VIRGIN", val: 6.3, prev: 5.6, var_pct: 12.5 },
    { op: "FLASH MOBILE", val: 0.0, prev: 5.6, var_pct: -100 },
    { op: "SUMA", val: 1.5, prev: 1.5, var_pct: 3.0 },
    { op: "SETROC", val: 0.3, prev: 0.6, var_pct: 52.9 },
];

// Origin-Destination matrix (2025-Q2, thousands) — from PDF page 6
export const odMatrix = {
    CLARO: { CLARO: 0, MOVISTAR: 63.4, TIGO: -147.7, WOM: -36.4, OTROS: -0.5 },
    MOVISTAR: { CLARO: -63.4, MOVISTAR: 0, TIGO: -40.4, WOM: -67.6, OTROS: -0.8 },
    TIGO: { CLARO: 147.7, MOVISTAR: 40.4, TIGO: 0, WOM: -6.4, OTROS: -0.5 },
    WOM: { CLARO: 36.4, MOVISTAR: 67.6, TIGO: 6.4, WOM: 0, OTROS: -0.2 },
};

// Destination shares — from PDF page 7
export const destShares = {
    fromTIGO: { CLARO: 60.1, MOVISTAR: 23.6, WOM: 14.0 },
    fromMOVISTAR: { CLARO: 51.2, TIGO: 18.5, WOM: 27.9 },
    fromCLARO: { MOVISTAR: 45.1, TIGO: 34.3, WOM: 17.4 },
    fromWOM: { MOVISTAR: 37.5, CLARO: 31.4, TIGO: 29.0 },
    fromETB: { CLARO: 36.3, MOVISTAR: 36.4, TIGO: 29.8 },
};

// Churn rates by portability (Q1 2025) — from PDF page 12
export const churnData = [
    { op: "CLARO", churnRate: 0.4, portShareOfRetired: 16.1 },
    { op: "MOVISTAR", churnRate: 0.5, portShareOfRetired: 21.4 },
    { op: "TIGO", churnRate: 0.9, portShareOfRetired: 11.6 },
    { op: "WOM", churnRate: 1.5, portShareOfRetired: 30.6 },
];

// TowerCo tenant exposure (illustrative based on Colombian market)
export const towerCoTenants = [
    { op: "CLARO", tenancy: 0.38, sites: 7200, trend: "stable" },
    { op: "MOVISTAR", tenancy: 0.28, sites: 5300, trend: "growing" },
    { op: "TIGO", tenancy: 0.22, sites: 4200, trend: "declining" },
    { op: "WOM", tenancy: 0.10, sites: 1900, trend: "declining" },
    { op: "OMVs", tenancy: 0.02, sites: 0, trend: "n/a" },
];
