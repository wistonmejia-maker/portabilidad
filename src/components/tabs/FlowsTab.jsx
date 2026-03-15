import { SectionTitle } from "../ui/SectionTitle";
import { COLORS, OPERATORS } from "../../data/constants";
export const FlowsTab = ({ data }) => {
    const { odMatrix, destShares, metadata } = data;
    const ops = ["CLARO", "MOVISTAR", "TIGO", "WOM"];

    // Build flow data for visualization
    const flows = [];
    ops.forEach(donor => {
        ops.forEach(receptor => {
            if (donor !== receptor) {
                const val = odMatrix[donor]?.[receptor];
                if (val && val > 0) {
                    flows.push({ from: donor, to: receptor, value: val });
                }
            }
        });
    });

    return (
        <div>
            <SectionTitle sub={`Resultados netos origen-destino Q${metadata.lastQuarter} ${metadata.lastYear} (miles de operaciones)`}>Matriz de Flujos entre OMR</SectionTitle>

            {/* Matrix table */}
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 2, fontSize: 12 }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "10px 14px", background: COLORS.card, color: COLORS.textMuted, borderRadius: "8px 0 0 0", textAlign: "left", fontSize: 10, letterSpacing: "0.05em" }}>
                                DONANTE ↓ / RECEPTOR →
                            </th>
                            {ops.map(op => (
                                <th key={op} style={{
                                    padding: "10px 14px", background: COLORS.card, color: OPERATORS[op].color,
                                    fontWeight: 700, textAlign: "center",
                                }}>{op}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ops.map(donor => (
                            <tr key={donor}>
                                <td style={{
                                    padding: "10px 14px", background: COLORS.card,
                                    color: OPERATORS[donor].color, fontWeight: 700,
                                }}>{donor}</td>
                                {ops.map(receptor => {
                                    const val = donor === receptor ? null : odMatrix[donor]?.[receptor];
                                    const isPositive = val > 0;
                                    return (
                                        <td key={receptor} style={{
                                            padding: "10px 14px", textAlign: "center", fontWeight: 700,
                                            background: val === null ? "#0D1117" : isPositive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                                            color: val === null ? COLORS.textDim : isPositive ? COLORS.positive : COLORS.negative,
                                            borderRadius: 4,
                                        }}>
                                            {val === null ? "—" : (val > 0 ? "+" : "") + val.toFixed(1)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Flow arrows visualization */}
            <SectionTitle sub="Los principales flujos netos positivos entre OMR">Flujos Dominantes</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {flows.sort((a, b) => b.value - a.value).map((f, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 12, background: COLORS.card,
                        border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 18px",
                    }}>
                        <div style={{
                            minWidth: 90, textAlign: "center", padding: "6px 12px", borderRadius: 6,
                            background: `${OPERATORS[f.from].color}20`, color: OPERATORS[f.from].color,
                            fontWeight: 700, fontSize: 13,
                        }}>{f.from}</div>
                        <div style={{ flex: 1, position: "relative", height: 24 }}>
                            <div style={{
                                position: "absolute", top: "50%", left: 0, right: 0, height: 4,
                                background: `linear-gradient(90deg, ${OPERATORS[f.from].color}, ${OPERATORS[f.to].color})`,
                                borderRadius: 2, transform: "translateY(-50%)", opacity: 0.5,
                            }} />
                            <div style={{
                                position: "absolute", top: "50%", left: `${Math.min(f.value / 150 * 100, 95)}%`,
                                transform: "translate(-50%, -50%)", fontSize: 16, color: COLORS.accent,
                            }}>▶</div>
                            <div style={{
                                position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)",
                                background: COLORS.bg, padding: "2px 8px", borderRadius: 4,
                                fontSize: 11, fontWeight: 700, color: COLORS.accent,
                            }}>{f.value.toFixed(1)}K</div>
                        </div>
                        <div style={{
                            minWidth: 90, textAlign: "center", padding: "6px 12px", borderRadius: 6,
                            background: `${OPERATORS[f.to].color}20`, color: OPERATORS[f.to].color,
                            fontWeight: 700, fontSize: 13,
                        }}>{f.to}</div>
                    </div>
                ))}
            </div>

            {/* Destination shares */}
            <SectionTitle sub="Hacia dónde migran los usuarios de cada operador">Distribución de Destino</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                {Object.entries(destShares).map(([key, shares]) => {
                    const fromOp = key.replace("from", "");
                    return (
                        <div key={key} style={{
                            background: COLORS.card, border: `1px solid ${COLORS.border}`,
                            borderRadius: 12, padding: 16,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12 }}>
                                Desde <span style={{ color: OPERATORS[fromOp]?.color || COLORS.text }}>{fromOp}</span>
                            </div>
                            {Object.entries(shares).sort((a, b) => b[1] - a[1]).map(([dest, pct]) => (
                                <div key={dest} style={{ marginBottom: 8 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                        <span style={{ fontSize: 11, color: OPERATORS[dest]?.color || COLORS.text, fontWeight: 600 }}>{dest}</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.text }}>{pct}%</span>
                                    </div>
                                    <div style={{ width: "100%", height: 5, background: COLORS.border, borderRadius: 3 }}>
                                        <div style={{
                                            width: `${pct}%`, height: "100%", borderRadius: 3,
                                            background: OPERATORS[dest]?.color || COLORS.accent,
                                            transition: "width 0.5s ease",
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
