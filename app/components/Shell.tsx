"use client";

import Nav from "./Nav";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="container">{children}</div>
      <footer className="container" style={{ paddingTop: 0, paddingBottom: 24 }}>
        <div className="hr" />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
          <div>© {new Date().getFullYear()} MedAIx</div>
          <div style={{ fontFamily: "var(--mono)" }}>Next.js · FastAPI</div>
        </div>
      </footer>
    </>
  );
}