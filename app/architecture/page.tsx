export default function Architecture() {
    return (
      <div className="card">
        <div className="cardHead">
          <div>
            <div style={{ fontWeight: 900 }}>Architecture</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
              System components, services, data flow.
            </div>
          </div>
          <span className="badge">System</span>
        </div>
        <div className="cardBody">
          <p className="p">Paste your architecture section (HLD) here.</p>
        </div>
      </div>
    );
  }