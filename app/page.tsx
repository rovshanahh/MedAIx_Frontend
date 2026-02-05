"use client";

import React, { useEffect, useMemo, useState } from "react";

type PredictionItem = {
  label: string;
  score: number;
  active: boolean;
};

type AnyObj = Record<string, any>;

// ✅ Default to LOCAL for development. Override via .env.local if needed.
// .env.local example:
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function safe(v: any) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(3);
  if (typeof v === "string" && v.trim() === "") return "—";
  return String(v);
}

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<AnyObj | null>(null);
  const [rawOpen, setRawOpen] = useState(false);
  const [apiHealth, setApiHealth] = useState<"checking" | "ok" | "down">("checking");

  const fileLabel = useMemo(() => {
    if (!file) return "Select a DICOM (.dcm) or image (.png/.jpg/.jpeg/.tiff)";
    const kb = Math.round(file.size / 1024);
    return `${file.name} · ${kb.toLocaleString()} KB`;
  }, [file]);

  // ✅ Ping backend health
  useEffect(() => {
    let cancelled = false;

    async function ping() {
      try {
        const r = await fetch(`${API_BASE}/`, { cache: "no-store" });
        if (!cancelled) setApiHealth(r.ok ? "ok" : "down");
      } catch {
        if (!cancelled) setApiHealth("down");
      }
    }

    ping();
    const t = setInterval(ping, 15000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  async function upload() {
    if (!file) return;

    setLoading(true);
    setErr(null);
    setData(null);
    setRawOpen(false);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: fd,
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        const msg =
          typeof payload === "string"
            ? payload
            : payload?.detail || JSON.stringify(payload);
        throw new Error(msg);
      }

      setData(payload);
    } catch (e: any) {
      setErr(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  const pipe = data?.pipeline;
  const dicom = data?.dicom;
  const pre = data?.preprocess;

  const predictions: PredictionItem[] = pipe?.inference?.predictions || [];
  const topPreds = [...predictions].sort((a, b) => b.score - a.score).slice(0, 6);
  const activePreds = [...predictions].filter((p) => p.active).sort((a, b) => b.score - a.score);

  const isProbablyWrongBackend =
    API_BASE.includes("onrender.com") || API_BASE.includes("render.com");

  return (
    <>
      <div className="kicker">Production Demo</div>
      <div className="h1">MedAIx Pipeline</div>
      <p className="p">
        Upload a medical image and receive a structured pipeline output (preprocess → detection → routing → inference).
      </p>

      {/* ✅ Always show which backend you're calling */}
      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <span className={`badge ${isProbablyWrongBackend ? "err" : "ok"}`} style={{ fontFamily: "var(--mono)" }}>
          API_BASE: {API_BASE}
        </span>
        {isProbablyWrongBackend && (
          <div style={{ marginTop: 8 }} className="badge err">
            You are calling Render, not your local backend. Create `.env.local` with
            NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000 and restart `npm run dev`.
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }} className="grid2">
        {/* Upload */}
        <div className="card">
          <div className="cardHead">
            <div>
              <div style={{ fontWeight: 900 }}>Upload</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
                Supported: .dcm .png .jpg .jpeg .tiff
              </div>
            </div>

            <span className={`badge ${apiHealth === "ok" ? "ok" : apiHealth === "down" ? "err" : ""}`}>
              API: {apiHealth === "checking" ? "checking…" : apiHealth}
            </span>
          </div>

          <div className="cardBody">
            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", fontWeight: 700 }}>File</div>
                <input
                  className="input"
                  type="file"
                  accept=".dcm,.png,.jpg,.jpeg,.tiff"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{fileLabel}</div>
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="button" onClick={upload} disabled={!file || loading}>
                  {loading ? "Analyzing…" : "Upload & Analyze"}
                </button>
                <button
                  className="button secondary"
                  onClick={() => {
                    setData(null);
                    setErr(null);
                    setRawOpen(false);
                  }}
                >
                  Clear
                </button>
              </div>

              {err && (
                <div style={{ marginTop: 8 }} className="badge err">
                  {err}
                </div>
              )}

              <div style={{ marginTop: 10, color: "rgba(255,255,255,0.50)", fontSize: 12, lineHeight: 1.6 }}>
                Demo safety: do not upload real patient data. Files may be stored temporarily for processing.
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <div className="cardHead">
            <div>
              <div style={{ fontWeight: 900 }}>Result Summary</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
                Human-readable view (raw JSON optional).
              </div>
            </div>
            {data?.will_delete_in_seconds ? (
              <span className="badge warn">Auto-delete ~{safe(data.will_delete_in_seconds)}s</span>
            ) : (
              <span className="badge">Ready</span>
            )}
          </div>

          <div className="cardBody">
            {!data && !err && (
              <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 14 }}>
                Upload a file to view detection, routing, and inference.
              </div>
            )}

            {data && (
              <div style={{ display: "grid", gap: 10 }}>
                <div className="grid3">
                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardHead">
                      <div style={{ fontWeight: 900 }}>Detection</div>
                    </div>
                    <div className="cardBody">
                      <div className="p">Region: <b>{safe(pipe?.detection?.region)}</b></div>
                      <div className="p">Modality: <b>{safe(pipe?.detection?.modality)}</b></div>
                      <div className="p">Confidence: <b>{safe(pipe?.detection?.confidence)}</b></div>
                    </div>
                  </div>

                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardHead">
                      <div style={{ fontWeight: 900 }}>Routing</div>
                    </div>
                    <div className="cardBody">
                      <div className="p">Model: <b>{safe(pipe?.routing?.model_id)}</b></div>
                      <div className="p">Reason: <b>{safe(pipe?.routing?.reason)}</b></div>
                    </div>
                  </div>

                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardHead">
                      <div style={{ fontWeight: 900 }}>Inference</div>
                    </div>
                    <div className="cardBody">
                      <div className="p">Uncertainty: <b>{safe(pipe?.inference?.uncertainty)}</b></div>
                      <div className="p">Active findings: <b>{safe(activePreds.length)}</b></div>
                      <div className="p">Predictions: <b>{safe(predictions.length)}</b></div>
                    </div>
                  </div>
                </div>

                <div className="hr" />

                {/* Predictions */}
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>Top predictions</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {topPreds.map((p) => (
                      <div key={p.label} className={`badge ${p.active ? "warn" : ""}`}>
                        {p.label} — {p.score.toFixed(3)} {p.active ? " (active)" : ""}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 6, fontWeight: 900 }}>Active findings (score ≥ 0.5)</div>
                  {activePreds.length === 0 ? (
                    <div style={{ color: "rgba(255,255,255,0.60)", fontSize: 13 }}>
                      None detected above threshold.
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 6 }}>
                      {activePreds.map((p) => (
                        <div key={p.label} className="badge ok">
                          {p.label} — {p.score.toFixed(3)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hr" />

                {/* Metadata */}
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div className="badge">
                      Stored: <span style={{ fontFamily: "var(--mono)" }}>{safe(data.stored_as)}</span>
                    </div>
                    <div className="badge">
                      Normalized: <span style={{ fontFamily: "var(--mono)" }}>{safe(pre?.normalized_saved_as)}</span>
                    </div>
                  </div>

                  {dicom && (
                    <div className="badge">
                      DICOM: {safe(dicom.modality)} · {safe(dicom.rows)}×{safe(dicom.cols)} · Instance {safe(dicom.instance_number)}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="button secondary" onClick={() => setRawOpen((s) => !s)}>
                      {rawOpen ? "Hide raw JSON" : "Show raw JSON"}
                    </button>
                  </div>

                  {rawOpen && <pre className="code">{JSON.stringify(data, null, 2)}</pre>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}