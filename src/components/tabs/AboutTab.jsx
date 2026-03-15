import React from "react";
import { SectionTitle } from "../ui/SectionTitle";
import { COLORS } from "../../data/constants";

export const AboutTab = () => {
    return (
        <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 40 }}>
            <div style={{
                background: `linear-gradient(135deg, ${COLORS.accent}10 0%, ${COLORS.accentAlt}10 100%)`,
                borderRadius: 20, padding: 40, border: `1px solid ${COLORS.border}`,
                textAlign: "center", marginBottom: 40
            }}>
                <div style={{
                    width: 60, height: 60, borderRadius: 15,
                    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 30, color: COLORS.bg, margin: "0 auto 20px"
                }}>▲</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.text, marginBottom: 12 }}>
                    Plataforma de Inteligencia de Portabilidad
                </h2>
                <p style={{ fontSize: 16, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>
                    Una herramienta estratégica diseñada para transformar datos públicos de telecomunicaciones
                    en decisiones críticas de infraestructura.
                </p>
            </div>

            <SectionTitle>Visión del Proyecto</SectionTitle>
            <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.8, marginBottom: 30 }}>
                Este dashboard es una solución analítica avanzada que procesa la "Series Temporales de Portabilidad Numérica Móvil" en Colombia.
                A diferencia de los visores de datos tradicionales, este proyecto aplica una **metodología de consultoría de alto nivel**
                orientada específicamente al sector de las **TowerCos** (Compañías de Infraestructura de Torres).
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
                <div style={{ background: COLORS.card, padding: 24, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 20, marginBottom: 12 }}>🚀</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Objetivo Principal</h3>
                    <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>
                        Identificar anticipadamente los riesgos de desmantelamiento de sitios (decommissioning) y oportunidades de expansión (BTS) mediante el análisis del flujo de suscriptores entre operadores.
                    </p>
                </div>
                <div style={{ background: COLORS.card, padding: 24, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 20, marginBottom: 12 }}>📊</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Diferenciador</h3>
                    <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>
                        Inclusión de un motor de "Inteligencia Reactiva" que interpreta automáticamente las métricas de Churn y Portabilidad Neta desde la perspectiva financiera de una TowerCo.
                    </p>
                </div>
            </div>

            <SectionTitle>Funcionalidades Clave</SectionTitle>
            <ul style={{ paddingLeft: 20, marginBottom: 40 }}>
                {[
                    "Sincronización automatizada con datos abiertos de la CRC (PostData.gov.co).",
                    "Cálculo de 'Ingreso en Riesgo' basado en exposición por Tenant.",
                    "Análisis de volatilidad del mercado semestral.",
                    "Visualización de flujos Origen-Destino (OD) entre operadores OMR.",
                    "Evaluación dinámica de Churn y Tenencia de Sitios."
                ].map((item, i) => (
                    <li key={i} style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 10, lineHeight: 1.5 }}>
                        <span style={{ color: COLORS.accent, marginRight: 8 }}>•</span> {item}
                    </li>
                ))}
            </ul>

            <div style={{
                padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)",
                border: `1px dashed ${COLORS.border}`, textAlign: "center"
            }}>
                <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0 }}>
                    Desarrollado con React, Recharts y una arquitectura orientada a la toma de decisiones estratégicas.
                </p>
            </div>
        </div>
    );
};
