import React, { useState } from "react";
import { Badge } from "./components/ui/Badge";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { TrendsTab } from "./components/tabs/TrendsTab";
import { OperatorsTab } from "./components/tabs/OperatorsTab";
import { FlowsTab } from "./components/tabs/FlowsTab";
import { TowerCoTab } from "./components/tabs/TowerCoTab";
import { COLORS, TABS } from "./data/constants";
import { usePortabilityData } from "./hooks/usePortabilityData";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, loading, error } = usePortabilityData();

  const renderTab = () => {
    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando datos de Portabilidad...</div>;
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: COLORS.negative }}>Error: {error}</div>;

    switch (activeTab) {
      case "overview": return <OverviewTab data={data} />;
      case "trends": return <TrendsTab data={data} />;
      case "operators": return <OperatorsTab data={data} />;
      case "flows": return <FlowsTab data={data} />;
      case "towerco": return <TowerCoTab data={data} />;
      default: return <OverviewTab data={data} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, ${COLORS.card} 0%, ${COLORS.bg} 100%)`,
        borderBottom: `1px solid ${COLORS.border}`, padding: "20px 24px 14px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt})`, fontWeight: 800, fontSize: 16, color: COLORS.bg,
              }}>▲</div>
              <div>
                <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                  Portabilidad Numérica Móvil
                </h1>
                <p style={{ fontSize: 11, color: COLORS.textDim, margin: 0 }}>
                  Colombia · Data Flash PNM · Análisis TowerCo
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {data?.metadata?.lastSync && (
                <Badge color={COLORS.accentAlt}>
                  Sincronizado: {new Date(data.metadata.lastSync).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Badge>
              )}
              <Badge color={COLORS.accent}>PostData.gov.co</Badge>
              {data?.metadata && <Badge color={COLORS.textDim}>Corte: {data.metadata.lastMonth}/{data.metadata.lastYear}</Badge>}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 16, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                background: activeTab === tab.id ? `${COLORS.accent}15` : "transparent",
                border: "none", borderBottom: activeTab === tab.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
                color: activeTab === tab.id ? COLORS.accent : COLORS.textMuted,
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 12 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 60px" }}>
        {renderTab()}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${COLORS.border}`, padding: "16px 24px",
        textAlign: "center", fontSize: 10, color: COLORS.textDim,
      }}>
        Fuente: <a href="https://www.postdata.gov.co/dataflash/data-flash-2022-025-portabilidad-numerica-movil" target="_blank" rel="noreferrer" style={{ color: COLORS.accent, textDecoration: "none" }}>Data Flash PNM (PostData.gov.co)</a>
        <br />Análisis orientado a TowerCo · Los datos de tenencia de torres son ilustrativos
      </div>
    </div>
  );
}
