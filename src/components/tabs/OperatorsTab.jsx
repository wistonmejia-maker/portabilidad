import { useState } from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, LineChart, ReferenceLine, Line } from "recharts";
import { SectionTitle } from "../ui/SectionTitle";
import { CustomTooltip } from "../ui/CustomTooltip";
import { Badge } from "../ui/Badge";
import { COLORS, OPERATORS } from "../../data/constants";
import { fmtPct } from "../../utils/formatters";

export const OperatorsTab = ({ data: dynamicData }) => {
    const [view, setView] = useState("donor");
    const { donorQ2_2025, receptorQ2_2025, netResultsOMR, churnData, metadata } = dynamicData;

    const data = view === "donor" ? donorQ2_2025 : receptorQ2_2025;
    const omrData = data.filter(d => OPERATORS[d.op]?.type === "OMR");

    // Dynamic Insight Logic
    const dLatest = donorQ2_2025 || [];
    const rLatest = receptorQ2_2025 || [];
    const topD = dLatest.length > 0 ? dLatest.reduce((m, d) => (d.val > m.val ? d : m), dLatest[0]) : { op: "N/A" };
    const topR = rLatest.length > 0 ? rLatest.reduce((m, d) => (d.val > m.val ? d : m), rLatest[0]) : { op: "N/A" };

    // Sort churn to find the most unstable operator
    const sortedChurn = [...(churnData || [])].sort((a, b) => b.churnRate - a.churnRate);
    const mostUnstable = sortedChurn[0] || { op: "N/A", churnRate: 0 };

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["donor", "receptor"].map(v => (
                    <button key={v} onClick={() => setView(v)} style={{
                        background: view === v ? COLORS.accent : COLORS.card,
                        color: view === v ? COLORS.bg : COLORS.textMuted,
                        border: `1px solid ${view === v ? COLORS.accent : COLORS.border}`,
                        borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700,
                        cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em",
                        transition: "all 0.2s",
                    }}>
                        {v === "donor" ? "◁ Donante" : "▷ Receptor"}
                    </button>
                ))}
            </div>

            <SectionTitle sub={`Operaciones ${view === "donor" ? "donadas" : "recibidas"} Q${metadata.lastQuarter} ${metadata.lastYear} vs anterior (miles)`}>
                {view === "donor" ? "Operadores Donantes" : "Operadores Receptores"} — OMR
            </SectionTitle>

            <div style={{ height: 280 }}>
                <ResponsiveContainer>
                    <BarChart data={omrData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis type="number" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                        <YAxis type="category" dataKey="op" tick={{ fill: COLORS.text, fontSize: 12, fontWeight: 600 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="prev" name="Trimestre Anterior" fill="rgba(148,163,184,0.3)" radius={[0, 4, 4, 0]} barSize={16} />
                        <Bar dataKey="val" name={`Trimestre Actual`} radius={[0, 4, 4, 0]} barSize={16}>
                            {omrData.map((e, i) => (
                                <Cell key={i} fill={OPERATORS[e.op]?.color || COLORS.accent} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ textAlign: "right", marginTop: -15, marginBottom: 20 }}>
                <a href="https://www.postdata.gov.co/dataset/portabilidad-numerica-movil" target="_blank" rel="noreferrer" style={{ fontSize: 10, color: COLORS.accent, textDecoration: "none", opacity: 0.7 }}>
                    🔗 Fuente: Detalle por Operador (PostData)
                </a>
            </div>

            <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
                marginBottom: 24, padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px dashed ${COLORS.border}`
            }}>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>🌑 Barra Gris (Fondo)</div>
                    <div style={{ color: COLORS.textMuted }}>Representa el volumen del <b>Trimestre Anterior</b>. Sirve como "sombra" para comparar visualmente si el operador ha mejorado o empeorado su desempeño.</div>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, color: COLORS.accent, marginBottom: 4 }}>🎨 Barra de Color (Frente)</div>
                    <div style={{ color: COLORS.textMuted }}>Representa el <b>Trimestre Actual</b>. Si la barra de color es más corta que la gris, significa que el volumen de operaciones ha disminuido este trimestre.</div>
                </div>
            </div>

            {/* Variation badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12, marginBottom: 24 }}>
                {omrData.map((d, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8, background: COLORS.card,
                        border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 14px",
                    }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: OPERATORS[d.op]?.color }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{d.op}</span>
                        <span style={{
                            fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                            background: d.var_pct >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                            color: d.var_pct >= 0 ? COLORS.positive : COLORS.negative,
                        }}>
                            {fmtPct(d.var_pct)}
                        </span>
                    </div>
                ))}
            </div>

            <SectionTitle sub={`Resultados netos OMR (miles) — Ene 2022 a Mes ${metadata.lastMonth} ${metadata.lastYear}`}>Portabilidad Neta por Operador</SectionTitle>
            <div style={{ height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={netResultsOMR} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis dataKey="m" tick={{ fill: COLORS.textDim, fontSize: 10 }} />
                        <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke={COLORS.textDim} strokeWidth={1} />
                        {["CLARO", "MOVISTAR", "TIGO", "WOM"].map(op => (
                            <Line key={op} type="monotone" dataKey={op} stroke={OPERATORS[op].color}
                                strokeWidth={2.5} dot={{ r: 3, fill: OPERATORS[op].color }} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <SectionTitle sub={`Tasa de churn por portaciones y participación en retiros (Trimestre Actual)`}>Churn por Portabilidad</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {churnData.map((d, i) => (
                    <div key={i} style={{
                        background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12,
                        padding: 16, borderTop: `3px solid ${OPERATORS[d.op]?.color}`,
                    }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>{d.op}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: COLORS.textMuted }}>Churn Rate</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: d.churnRate >= 1 ? COLORS.negative : COLORS.warn }}>{d.churnRate}%</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: COLORS.border, borderRadius: 3, marginBottom: 12 }}>
                            <div style={{
                                width: `${Math.min(d.churnRate / 2 * 100, 100)}%`, height: "100%", borderRadius: 3,
                                background: d.churnRate >= 1 ? COLORS.negative : COLORS.warn,
                            }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: COLORS.textMuted }}>% en Retiros</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{d.portShareOfRetired}%</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: COLORS.border, borderRadius: 3, marginTop: 4 }}>
                            <div style={{
                                width: `${d.portShareOfRetired}%`, height: "100%", borderRadius: 3,
                                background: OPERATORS[d.op]?.color,
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Operator Specific Insights */}
            <SectionTitle sub="Análisis de comportamiento por infraestructura">Insights de Red y Mercado</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 32 }}>
                {[
                    {
                        title: "Resiliencia Operativa OMR",
                        icon: "🛡️",
                        text: `La dinámica de portación liderada por ${topD.op} sugiere una fase de reequilibrio de mercado. Las TowerCos deben esperar menor rotación de equipos en sitio durante periodos de consolidación de red.`,
                        color: COLORS.positive
                    },
                    {
                        title: `Riesgo en ${mostUnstable.op}`,
                        icon: "⚠️",
                        text: `${mostUnstable.op} mantiene el churn relativo más alto (${mostUnstable.churnRate}%). El riesgo de 'Site Decommissioning' es mayor en este operador si la tendencia se vuelve estructural.`,
                        color: COLORS.negative
                    },
                    {
                        title: `Liderazgo de ${topR.op}`,
                        icon: "🏗️",
                        text: `${topR.op} sigue capturando el mayor share de usuarios. Esto valida la necesidad de expansión y densificación para soportar el tráfico incremental en su red host.`,
                        color: COLORS.accent
                    },
                    {
                        title: "Estrategia de CAPEX",
                        icon: "🤝",
                        text: "La fluctuación en el volumen de donantes abre la puerta a optimización de infraestructura. La TowerCo puede proponer consolidación de activos y migración a nodos de mayor capacidad.",
                        color: COLORS.accentAlt
                    },
                ].map((c, i) => (
                    <div key={i} style={{
                        background: COLORS.card, border: `1px solid ${COLORS.border}`,
                        borderRadius: 12, padding: 18, borderLeft: `33px solid ${c.color}`,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 16 }}>{c.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{c.title}</span>
                        </div>
                        <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0, lineHeight: 1.6 }}>{c.text}</p>
                    </div>
                ))}
            </div>

            {/* TowerCo Reading Section */}
            <SectionTitle>Lectura TowerCo</SectionTitle>
            <div style={{
                background: `linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(59,130,246,0.05) 100%)`,
                border: `1px solid rgba(16,185,129,0.2)`, borderRadius: 14, padding: "20px 24px", marginTop: 10,
                display: "flex", flexDirection: "column", gap: 12
            }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ color: COLORS.positive, fontSize: 16 }}>●</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Migración hacia Operadores Dominantes</div>
                        <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>
                            CLARO y MOVISTAR continúan consolidando el mercado con flujos netos positivos constantes. Para una TowerCo, esto representa oportunidades inmediatas de <b>Amendment (Búsqueda de más espacio en torre)</b> y densificación <b>(Build-to-Suit)</b> en zonas de alta congestión.
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ color: COLORS.warn, fontSize: 16 }}>●</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Riesgo Estructural en TIGO</div>
                        <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>
                            A pesar de tener una cuota alta del mercado, TIGO es el principal donante histórico. La TowerCo debe monitorear el riesgo de desmantelamiento parcial (decommissioning) y proponer esquemas de compartición de infraestructura (Network Sharing) antes de que opten por retirarse de sitios aislados.
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ color: COLORS.negative, fontSize: 16 }}>●</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Frenazo Comercial en WOM</div>
                        <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>
                            Con la tasa de churn más alta y el port-share en caída libre, WOM muestra debilidad extrema. Es crítico auditar el portafolio actual arrendado a WOM, verificar garantías y penalidades, y empezar a prospectar esos mismos espacios en torre para otros operadores ganadores.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
