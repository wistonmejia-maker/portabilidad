export const fmt = (n, d = 1) => {
    if (n === null || n === undefined) return "—";
    if (Math.abs(n) >= 1000) return (n / 1000).toFixed(d) + "M";
    return n.toFixed(d) + "K";
};

export const fmtPct = (n) => {
    const num = Number(n);
    if (isNaN(num)) return "—";
    return (num > 0 ? "+" : "") + num.toFixed(1) + "%";
};
