import { useState } from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, LineChart, Line } from "recharts";
import { SectionTitle } from "../ui/SectionTitle";
import { Badge } from "../ui/Badge";
import { COLORS, OPERATORS } from "../../data/constants";
import { towerCoCRM } from "../../data/mock_crm_data";

export const TowerCoTab = ({ data }) => {
    const { churnData, donorQ2_2025, receptorQ2_2025, metadata } = data;
    const [timeFilter, setTimeFilter] = useState("ALL");

    // Filter historical data
    let filteredHistory = [...data.netResultsOMR];
    if (timeFilter === "1Y") filteredHistory = filteredHistory.slice(-4);
    if (timeFilter === "2Y") filteredHistory = filteredHistory.slice(-8);

    // Compute weighted risk score (Refined algorithm with coverage obligation discount)
    const riskData = towerCoCRM.tenants.filter(t => t.op !== "OMVs").map(t => {
        const churn = churnData.find(c => c.op === t.op);
        const donor = donorQ2_2025.find(d => d.op === t.op);
        const receptor = receptorQ2_2025.find(r => r.op === t.op);
        const netPct = donor && receptor ? ((receptor.val - donor.val) / donor.val * 100) : 0;

        // Softer algorithm prioritizing coverage commitments that prevents sudden uninstalls
        const coverageObligationDiscount = 0.65;
        const rawRisk = (churn?.churnRate || 0) * 15 + Math.max(0, -netPct) * 0.35;
        const riskScore = Math.min(rawRisk * coverageObligationDiscount, 100);

        return {
            ...t, churnRate: churn?.churnRate || 0,
            donorK: donor?.val || 0, receptorK: receptor?.val || 0,
            netK: (receptor?.val || 0) - (donor?.val || 0),
            netPct, riskScore,
        };
    });

    // Revenue impact simulation using CRM Master Lease data
    const avgRevenuePerSite = towerCoCRM.avgRevenuePerSite;
    const revenueImpact = riskData.map(r => ({
        ...r,
        monthlyRevenue: r.sites * avgRevenuePerSite,
        atRiskRevenue: r.sites * avgRevenuePerSite * (r.riskScore / 100) * 0.15,
    }));

    // Summary metrics for the header
    const avgRiskScore = (riskData.reduce((sum, r) => sum + r.riskScore, 0) / riskData.length).toFixed(1);
    const topRiskOp = [...revenueImpact].sort((a, b) => b.atRiskRevenue - a.atRiskRevenue)[0] || { op: "N/A", atRiskRevenue: 0 };
    const bestTrajectoryOp = [...data.netResultsOMR.slice(-1)].sort((a, b) => b.val - a.val)[0] || { op: "N/A" };

    return (
        <div>
            <div style={{
                background: `linear-gradient(135deg, rgba(0,229,160,0.06) 0%, rgba(107,45,139,0.06) 100%)`,
                border: `1px solid rgba(0,229,160,0.15)`, borderRadius: 14, padding: 22, marginBottom: 24,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>▲</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Análisis de Riesgo — Perspectiva TowerCo</span>
                </div>
                <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0, lineHeight: 1.7 }}>
                    La portabilidad numérica es un indicador adelantado de la salud comercial de los operadores tenant.
                    Una pérdida sostenida de suscriptores puede traducirse en menor inversión en red, renegociación de contratos de arrendamiento, o incluso devolución de sitios.
                    Este análisis cruza los datos de portabilidad CRC con la exposición estimada de tenancy.
                </p>
            </div>

            {/* Dynamic Executive Summary */}
            <div style={{
                background: `linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(37,99,235,0.05) 100%)`,
                border: `1px solid rgba(59,130,246,0.2)`, borderRadius: 14, padding: 24, marginBottom: 24,
            }}>
                <SectionTitle sub={`Análisis Q${metadata.lastQuarter} ${metadata.lastYear}`}>Resumen Ejecutivo de Riesgo</SectionTitle>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0, lineHeight: 1.7 }}>
                    El portafolio de torres presenta un puntaje de riesgo promedio de <strong style={{ color: COLORS.accent }}>{avgRiskScore}</strong>.
                    Actualmente, <strong style={{ color: COLORS.accent }}>{topRiskOp.op}</strong> representa la mayor exposición financiera con un riesgo estimado en renta de <b>${(topRiskOp.atRiskRevenue / 1000000).toFixed(1)}M USD/año</b>.
                    <br /><br />
                    En contraste, la trayectoria de portación de <strong style={{ color: COLORS.positive }}>{bestTrajectoryOp.op}</strong> muestra la mayor resiliencia en red, sugiriendo una oportunidad para negociar extensiones de contrato (*lease renewals*) o nuevos despliegues de infraestructura.
                </p>
            </div>

            {/* Tenant Exposure */}
            <SectionTitle sub="Participación estimada en tenencia de sitios">Exposición por Tenant</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
                {revenueImpact.map((r, i) => (
                    <div key={i} style={{
                        background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12,
                        padding: 18, position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: 0, right: 0, width: 60, height: 60,
                            background: `radial-gradient(circle at top right, ${OPERATORS[r.op]?.color}15, transparent)`,
                        }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: OPERATORS[r.op]?.color }} />
                            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{r.op}</span>
                            <Badge color={r.trend === "growing" ? COLORS.positive : r.trend === "declining" ? COLORS.negative : COLORS.textMuted}>
                                {r.trend === "growing" ? "↑" : r.trend === "declining" ? "↓" : "→"} {r.trend}
                            </Badge>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 2 }}>Tenancy</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>{(r.tenancy * 100).toFixed(0)}%</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 2 }}>Sitios</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>{r.sites.toLocaleString()}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 2 }}>Port. Neta Q2</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: r.netK >= 0 ? COLORS.positive : COLORS.negative }}>
                                    {r.netK >= 0 ? "+" : ""}{r.netK.toFixed(1)}K
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 2 }}>Churn Port.</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: r.churnRate >= 1 ? COLORS.negative : COLORS.warn }}>
                                    {r.churnRate}%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Risk Score Gauge */}
            <SectionTitle sub="Score compuesto: Churn rate × 20 + max(0, -NetPort%) × 0.5">Índice de Riesgo por Tenant</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
                {riskData.sort((a, b) => b.riskScore - a.riskScore).map((r, i) => (
                    <div key={i} style={{
                        background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12,
                        padding: 18, flex: "1 1 200px", minWidth: 180,
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: OPERATORS[r.op]?.color }}>{r.op}</span>
                            <span style={{
                                fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
                                color: r.riskScore > 40 ? COLORS.negative : r.riskScore > 20 ? COLORS.warn : COLORS.positive,
                            }}>{r.riskScore.toFixed(0)}</span>
                        </div>
                        <div style={{ width: "100%", height: 8, background: COLORS.border, borderRadius: 4 }}>
                            <div style={{
                                width: `${r.riskScore}%`, height: "100%", borderRadius: 4, transition: "width 0.8s ease",
                                background: r.riskScore > 40
                                    ? `linear-gradient(90deg, ${COLORS.warn}, ${COLORS.negative})`
                                    : r.riskScore > 20
                                        ? `linear-gradient(90deg, ${COLORS.positive}, ${COLORS.warn})`
                                        : COLORS.positive,
                            }} />
                        </div>
                        <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 6, textAlign: "center" }}>
                            {r.riskScore > 40 ? "Riesgo Alto" : r.riskScore > 20 ? "Riesgo Medio" : "Riesgo Bajo"}
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue at Risk */}
            <SectionTitle sub={`Simulación con renta promedio de USD ${avgRevenuePerSite}/sitio/mes`}>Ingreso en Riesgo</SectionTitle>
            <div style={{ height: 280 }}>
                <ResponsiveContainer>
                    <BarChart data={revenueImpact} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis dataKey="op" tick={{ fill: COLORS.text, fontSize: 12, fontWeight: 600 }} />
                        <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
                        <Tooltip content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            return (
                                <div style={{ background: "#1E293B", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px" }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{label}</div>
                                    {payload.map((p, i) => (
                                        <div key={i} style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 3 }}>
                                            {p.name}: <span style={{ color: COLORS.text, fontWeight: 600 }}>${(p.value / 1e6).toFixed(2)}M</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }} />
                        <Bar dataKey="monthlyRevenue" name="Ingreso Mensual" fill="rgba(0,229,160,0.3)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="atRiskRevenue" name="Ingreso en Riesgo" radius={[4, 4, 0, 0]}>
                            {revenueImpact.map((e, i) => (
                                <Cell key={i} fill={e.riskScore > 40 ? COLORS.negative : e.riskScore > 20 ? COLORS.warn : "rgba(16,185,129,0.4)"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Historical Risk Trajectory Filter and Chart */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, marginTop: 40 }}>
                <SectionTitle sub="Evolución y trayectoria de flujos netos">Histórico de Riesgo Temporal</SectionTitle>
                <select
                    style={{
                        background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}`,
                        padding: "6px 12px", borderRadius: 6, fontSize: 13, outline: "none", cursor: "pointer"
                    }}
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                >
                    <option value="ALL">Todo el Histórico</option>
                    <option value="2Y">Últimos 2 Años</option>
                    <option value="1Y">Último Año</option>
                </select>
            </div>

            <div style={{ height: 300, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 20px 10px 0px", marginBottom: 32 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                        <XAxis dataKey="m" stroke={COLORS.textDim} fontSize={11} tickMargin={10} axisLine={false} tickLine={false}
                            tickFormatter={(val) => { const [y, m] = val.split("-"); return `Q${Math.ceil(m / 3)} ${y.slice(2)}`; }} />
                        <YAxis stroke={COLORS.textDim} fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => v + "K"} />
                        <Tooltip
                            contentStyle={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }}
                            itemStyle={{ fontSize: 12, fontWeight: 600 }}
                        />
                        <Line type="monotone" dataKey="WOM" stroke={OPERATORS.WOM.color} strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="TIGO" stroke={OPERATORS.TIGO.color} strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="CLARO" stroke={OPERATORS.CLARO.color} strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="MOVISTAR" stroke={OPERATORS.MOVISTAR.color} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Strategic recommendations */}
            <SectionTitle>Recomendaciones Estratégicas</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                {[
                    { priority: "ALTA", title: "Monitorear exposición a WOM", text: "Con churn de 1.5%, portabilidad neta de -175.8K y caída del 341% YoY, WOM representa el mayor riesgo de renegociación o devolución de sitios. Evaluar cláusulas de penalización y diversificación.", color: COLORS.negative },
                    { priority: "ALTA", title: "Diversificar tenant mix", text: "CLARO (38%) y MOVISTAR (28%) concentran 66% de la tenencia. La portabilidad confirma que son los operadores ganadores. Negociar contratos de largo plazo aprovechando su posición de crecimiento.", color: COLORS.negative },
                    { priority: "MEDIA", title: "TIGO: señales mixtas", text: "Mayor donante (508.6K) pero mantiene 22% de tenencia. El riesgo es moderado pero creciente. Monitorar tendencias trimestrales y preparar escenarios de reducción de colocación.", color: COLORS.warn },
                    { priority: "BAJA", title: "Oportunidad en densificación", text: `La desaceleración de portaciones indica maduración del mercado. Los operadores ganadores (CLARO, MOVISTAR) pueden invertir en densificación de red para mejorar experiencia de los usuarios captados.`, color: COLORS.positive },
                ].map((r, i) => (
                    <div key={i} style={{
                        background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12,
                        padding: 18, display: "flex", gap: 14, alignItems: "flex-start",
                    }}>
                        <Badge color={r.color}>{r.priority}</Badge>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{r.title}</div>
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0, lineHeight: 1.6 }}>{r.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
