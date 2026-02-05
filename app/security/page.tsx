export default function Security() {
    return (
      <div className="card">
        <div className="cardHead">
          <div>
            <div style={{ fontWeight: 900 }}>Security & Compliance</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
              Threat model, privacy, logging, data retention.
            </div>
          </div>
          <span className="badge warn">Important</span>
        </div>
        <div className="cardBody">
          <p className="p">Paste your security/privacy/compliance commitments here.</p>
        </div>
      </div>
    );
  }