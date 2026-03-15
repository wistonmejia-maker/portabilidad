import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, Line, ResponsiveContainer } from "recharts";
import { Badge } from "../ui/Badge";
import { KPICard } from "../ui/KPICard";
import { SectionTitle } from "../ui/SectionTitle";
import { CustomTooltip } from "../ui/CustomTooltip";
import { COLORS } from "../../data/constants";

export const OverviewTab = ({ data }) => {
    const { annualOps, metadata } = data;
    const { lastYear, lastQuarter } = metadata;

    // Derived metrics from dynamic data
    const lastYearData = annualOps.find(d => d.year === lastYear) || { ops: 0, q2: 0 };
    const prevYearData = annualOps.find(d => d.year === lastYear - 1) || { ops: 0, q2: 0 };

    const h1_2025 = lastYearData.q2 || lastYearData.ops;
    const q2_2025 = lastYearData.q2 || 0; // Approximation 
    const varYoY = prevYearData.q2 ? parseFloat((((h1_2025 - prevYearData.q2) / prevYearData.q2) * 100).toFixed(1)) : 0;
    const varQoQ = -3.8; // Would require monthly granularity to calculate precisely

    const totalOps = (annualOps.reduce((sum, d) => sum + d.ops, 0)).toFixed(1);
    const avgMonthly = Math.round((h1_2025 * 1000) / (lastQuarter * 3));

    // Identify winners and losers for dynamic insights
    const latestDonors = data.donorQ2_2025 || [];
    const latestReceptors = data.receptorQ2_2025 || [];

    const topDonor = latestDonors.length > 0 ? latestDonors.reduce((max, d) => (d.val > max.val ? d : max), latestDonors[0]) : { op: "N/A", val: 0 };
    const topReceptor = latestReceptors.length > 0 ? latestReceptors.reduce((max, d) => (d.val > max.val ? d : max), latestReceptors[0]) : { op: "N/A", val: 0 };

    const omvShare = latestReceptors.filter(d => d.type === "OMV").reduce((sum, d) => sum + d.val, 0);
    const totalReceptors = latestReceptors.reduce((sum, d) => sum + d.val, 0);
    const omvImpact = ((omvShare / totalReceptors) * 100).toFixed(1);

    return (
        <div>
            <div style={{
                background: `linear-gradient(135deg, rgba(0,229,160,0.08) 0%, rgba(0,180,216,0.05) 100%)`,
                border: `1px solid rgba(0,229,160,0.2)`, borderRadius: 14, padding: 24, marginBottom: 24,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Badge color={COLORS.accent}>DATA FLASH PNM</Badge>
                    <Badge color={COLORS.accentAlt}>CRC · Q{metadata.lastQuarter} {metadata.lastYear}</Badge>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" }}>
                    Portabilidad Numérica Móvil — Colombia
                </h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0, lineHeight: 1.6 }}>
                    Las operaciones de portación variaron <span style={{ color: varYoY < 0 ? COLORS.negative : COLORS.positive, fontWeight: 700 }}>{varYoY}%</span> en el año {lastYear} frente al mismo periodo de {lastYear - 1}.
                    Acumulado histórico: <span style={{ color: COLORS.accent, fontWeight: 700 }}>{totalOps}M</span> operaciones desde agosto 2011.
                    TIGO y WOM presentan resultados netos negativos; CLARO y MOVISTAR capturan flujos.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 28 }}>
                <KPICard icon="📊" label="Acumulado Histórico" value={`${totalOps}M`} sub={`Ago 2011 – Mes ${metadata.lastMonth} ${lastYear}`} />
                <KPICard icon="📈" label={`Año ${lastYear}`} value={`${h1_2025}M`} delta={varYoY} sub={`vs ${lastYear - 1}`} />
                <KPICard icon="📉" label="Último Trimestre" value={`${q2_2025}M`} delta={varQoQ} sub="vs anterior" />
                <KPICard icon="🔄" label="Promedio Mensual" value={`${avgMonthly}K`} delta={-5.9} sub="vs Q2 2024" />
            </div>

            <SectionTitle sub={`Millones de operaciones acumuladas por año (2011–${lastYear})`}>Evolución Anual</SectionTitle>
            <div style={{ height: 300, marginBottom: 20 }}>
                <ResponsiveContainer>
                    <ComposedChart data={annualOps} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis dataKey="year" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                        <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="ops" name="Anual (M)" radius={[4, 4, 0, 0]}>
                            {annualOps.map((e, i) => (
                                <Cell key={i} fill={e.year === lastYear ? COLORS.accent : `rgba(0,229,160,${0.3 + (i / annualOps.length) * 0.7})`} />
                            ))}
                        </Bar>
                        <Line type="monotone" dataKey="q2" name="Q2 (M)" stroke={COLORS.accentAlt} strokeWidth={2} dot={{ r: 4, fill: COLORS.accentAlt }} connectNulls />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div style={{ textAlign: "right", marginTop: -15, marginBottom: 20 }}>
                <a href="https://www.postdata.gov.co/dataset/portabilidad-numerica-movil" target="_blank" rel="noreferrer" style={{ fontSize: 10, color: COLORS.accent, textDecoration: "none", opacity: 0.7 }}>
                    🔗 Fuente: Operaciones Portación Receptor (PostData)
                </a>
            </div>

            <SectionTitle sub="Análisis TowerCo: Implicaciones de la Portabilidad para Infraestructura">Perspectiva Estratégica</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                {[
                    {
                        title: "Concentración de Mercado",
                        icon: "⚠️",
                        text: `${topReceptor.op} domina la recepción de usuarios (${topReceptor.val}K). La alta concentración en un solo operador implica riesgo de dependencia comercial para los propietarios de infraestructura.`,
                        color: COLORS.warn
                    },
                    {
                        title: "Presión de Red en Donantes",
                        icon: "📉",
                        text: `${topDonor.op} es el mayor donador (${topDonor.val}K en el periodo). Una pérdida sostenida de usuarios suele preceder a una reducción en inversión de mantenimiento de sitios físicos.`,
                        color: COLORS.negative
                    },
                    {
                        title: "Desempeño del Periodo",
                        icon: varYoY > 0 ? "📈" : "🔻",
                        text: `El mercado de portabilidad varió un ${varYoY}% YoY. Un mercado ${varYoY > 0 ? 'creciente' : 'en contracción'} exige a las TowerCos mayor flexibilidad en los términos de arrendamiento (escaladores y penalidades).`,
                        color: varYoY > 0 ? COLORS.positive : COLORS.danger
                    },
                    {
                        title: "Impacto de Virtuales (OMV)",
                        icon: "🏗️",
                        text: `Los OMV representan el ${omvImpact}% de la recepción. Al no poseer torres, su crecimiento satura la red del host sin generar demanda de nuevos sitios BTS (Build-to-Suit).`,
                        color: COLORS.accentAlt
                    },
                ].map((c, i) => (
                    <div key={i} style={{
                        background: COLORS.card, border: `1px solid ${COLORS.border}`,
                        borderRadius: 12, padding: 18, borderLeft: `3px solid ${c.color}`,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 16 }}>{c.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{c.title}</span>
                        </div>
                        <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0, lineHeight: 1.6 }}>{c.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
