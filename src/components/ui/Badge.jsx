import { COLORS } from "../../data/constants";

export const Badge = ({ children, color = COLORS.accent }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700,
        padding: "3px 8px", borderRadius: 4, background: `${color}20`, color,
        textTransform: "uppercase", letterSpacing: "0.06em",
    }}>{children}</span>
);
