import { COLORS } from "../../data/constants";

export const SectionTitle = ({ children, sub }) => (
    <div style={{ marginBottom: 16, marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: 0, letterSpacing: "-0.02em" }}>{children}</h2>
        {sub && <p style={{ fontSize: 12, color: COLORS.textDim, margin: "4px 0 0" }}>{sub}</p>}
    </div>
);
