// mock_crm_data.js
// Esta información simula el Master Lease Agreement (MLA) y el inventario real de una TowerCo.
// Para poner el dashboard en producción real, el área de Sistemas o Ventas 
// deberá conectar estos campos a los datos del ERP/CRM de la compañía.

export const towerCoCRM = {
    // Renta promedio cobrada por sitio a los operadores (USD/Mes)
    avgRevenuePerSite: 1200,

    // Inventario de sitios arrendados por operador en la infraestructura de la TowerCo
    tenants: [
        { op: "CLARO", sites: 4100, tenancy: 0.38, trend: "growing" },
        { op: "MOVISTAR", sites: 3050, tenancy: 0.28, trend: "stable" },
        { op: "TIGO", sites: 2400, tenancy: 0.22, trend: "declining" },
        { op: "WOM", sites: 1050, tenancy: 0.10, trend: "declining" },
        { op: "OMVs", sites: 250, tenancy: 0.02, trend: "stable" },
    ]
};
