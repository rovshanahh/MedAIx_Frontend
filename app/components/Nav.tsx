"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Demo" },
  { href: "/overview", label: "Overview" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/architecture", label: "Architecture" },
  { href: "/security", label: "Security" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const p = usePathname();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(10px)" }}>
      <div
        className="container"
        style={{
          paddingTop: 14,
          paddingBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(5,10,20,0.58)",
            borderRadius: 12,
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(180deg, rgba(42,91,215,0.95), rgba(31,63,154,0.95))",
              }}
            />
            <div>
              <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>MedAIx</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Clinical pipeline platform</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {links.map((l) => {
              const active = p === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: active ? "1px solid rgba(42,91,215,0.55)" : "1px solid rgba(255,255,255,0.08)",
                    background: active ? "rgba(42,91,215,0.10)" : "transparent",
                    color: active ? "rgba(235,245,255,0.96)" : "rgba(255,255,255,0.78)",
                    fontWeight: 750,
                    fontSize: 13,
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}