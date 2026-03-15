import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Bar, Cell, ReferenceLine, BarChart, ResponsiveContainer } from "recharts";
import { SectionTitle } from "../ui/SectionTitle";
import { CustomTooltip } from "../ui/CustomTooltip";
import { COLORS } from "../../data/constants";


export const TrendsTab = ({ data }) => {
    const { monthlyOps, annualOps, metadata } = data;
    const { lastYear } = metadata;

    const withVar = monthlyOps.map((d, i) => ({
        ...d,
        var_m: i > 0 && monthlyOps[i - 1].v > 0 ? parseFloat(((d.v - monthlyOps[i - 1].v) / monthlyOps[i - 1].v * 100).toFixed(1)) : 0,
        label: d.m.slice(2),
    }));

    // Find Q2 data for the last 4 years
    const q2Comparison = [];
    for (let i = 3; i >= 0; i--) {
        const year = lastYear - i;
        const yearData = annualOps.find(a => a.year === year);
        if (yearData && yearData.q2) {
            q2Comparison.push({ year: `${year}-Q2`, v: yearData.q2 * 1000 });
        }
    }

    // Dynamic Volatility Reading
    const last6 = withVar.slice(-6);
    const avg6 = last6.reduce((sum, d) => sum + d.v, 0) / 6;
    const stdDev = Math.sqrt(last6.reduce((sum, d) => sum + Math.pow(d.v - avg6, 2), 0) / 6);
    const volatilityPct = ((stdDev / avg6) * 100).toFixed(1);

    const isVolatile = volatilityPct > 5;
    const lastQ2 = q2Comparison[q2Comparison.length - 1]?.v || 0;
    const prevQ2 = q2Comparison[q2Comparison.length - 2]?.v || 0;
    const q2Trend = lastQ2 > prevQ2 ? "creciente" : "estable/en descenso";

    return (
        <div>
            <SectionTitle sub={`Operaciones mensuales en miles (Ene 2022 – Mes ${metadata.lastMonth} ${lastYear})`}>Tendencia Mensual de Portaciones</SectionTitle>
            <div style={{ height: 320 }}>
                <ResponsiveContainer>
                    <ComposedChart data={withVar} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis dataKey="label" tick={{ fill: COLORS.textDim, fontSize: 9 }} interval={2} />
                        <YAxis yAxisId="left" tick={{ fill: COLORS.textDim, fontSize: 11 }} domain={[400, 800]} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area yAxisId="left" dataKey="v" name="Operaciones (K)" fill="rgba(0,229,160,0.1)" stroke={COLORS.accent} strokeWidth={2} />
                        <Bar yAxisId="right" dataKey="var_m" name="Var. Mensual (%)" radius={[2, 2, 0, 0]}>
                            {withVar.map((e, i) => (
                                <Cell key={i} fill={e.var_m >= 0 ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)"} />
                            ))}
                        </Bar>
                        <ReferenceLine yAxisId="left" y={557} stroke={COLORS.warn} strokeDasharray="5 5" label={{ value: "Prom Q2-25", fill: COLORS.warn, fontSize: 10 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div style={{ textAlign: "right", marginTop: -15, marginBottom: 20 }}>
                <a href="https://www.postdata.gov.co/dataset/portabilidad-numerica-movil" target="_blank" rel="noreferrer" style={{ fontSize: 10, color: COLORS.accent, textDecoration: "none", opacity: 0.7 }}>
                    🔗 Fuente: Series Temporales PNM (PostData)
                </a>
            </div>

            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16,
                marginBottom: 32, padding: "0 10px"
            }}>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, color: COLORS.accent, marginBottom: 4 }}>📈 Línea de Tendencia (Área)</div>
                    <div style={{ color: COLORS.textMuted }}>Representa el volumen bruto de portaciones mensuales. Valores sobre 700K indican picos de actividad comercial agresiva en el mercado.</div>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, color: COLORS.positive, marginBottom: 4 }}>📊 Barras de Variación (MOM)</div>
                    <div style={{ color: COLORS.textMuted }}>Muestran el crecimiento o caída (%) vs el mes anterior. Barras <span style={{ color: COLORS.negative }}>rojas</span> extendidas alertan sobre meses de desaceleración súbita.</div>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, color: COLORS.warn, marginBottom: 4 }}>🏁 Promedio Q2-25</div>
                    <div style={{ color: COLORS.textMuted }}>Línea de referencia que marca la "nueva normalidad" del mercado tras la entrada de WOM y la consolidación de tarifas.</div>
                </div>
            </div>

            <SectionTitle sub="Comparación Q2 por año — Operaciones totales (miles)">Estacionalidad Q2</SectionTitle>
            <div style={{ height: 240 }}>
                <ResponsiveContainer>
                    <BarChart data={q2Comparison} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis dataKey="year" tick={{ fill: COLORS.textDim, fontSize: 12 }} />
                        <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="v" name="Total Q2 (K)" radius={[6, 6, 0, 0]}>
                            {q2Comparison.map((e, i) => (
                                <Cell key={i} fill={i === q2Comparison.length - 1 ? COLORS.accent : "rgba(0,229,160,0.35)"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{
                background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12,
                padding: 18, marginTop: 20, borderLeft: `3px solid ${COLORS.accentAlt}`,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 14 }}>🏗️</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Lectura Estratégica</span>
                </div>
                <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0, lineHeight: 1.7 }}>
                    El mercado muestra una volatilidad del <strong style={{ color: COLORS.accent }}>{volatilityPct}%</strong> en el último semestre.
                    {isVolatile
                        ? " Esta variabilidad crítica sugiere que los operadores están ejecutando campañas de captación agresivas, lo que aumenta la incertidumbre sobre la permanencia de largo plazo en torre."
                        : " Una baja volatilidad indica un mercado maduro donde los flujos de red son predecibles, favoreciendo la planificación de CAPEX para la TowerCo."}
                    <br /><br />
                    La estacionalidad de Q2 es <strong style={{ color: COLORS.accent }}>{q2Trend}</strong>. Una tendencia {q2Trend} frente a años anteriores
                    {lastQ2 > prevQ2
                        ? " valida la necesidad de ampliar capacidad instalada en los nodos de alta densidad."
                        : " invita a la cautela en inversiones BTS hasta que el churn del mercado se estabilice."}
                </p>
            </div>
        </div>
    );
};
