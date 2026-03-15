import { COLORS } from "../../data/constants";
import { fmtPct } from "../../utils/formatters";

export const KPICard = ({ label, value, delta, sub, icon }) => (
    <div style={{
        background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.cardHover} 100%)`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 6, minWidth: 0,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {delta !== undefined && (
                <span style={{
                    fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                    background: delta >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    color: delta >= 0 ? COLORS.positive : COLORS.negative,
                }}>{fmtPct(delta)}</span>
            )}
            {sub && <span style={{ fontSize: 11, color: COLORS.textDim }}>{sub}</span>}
        </div>
    </div>
);
