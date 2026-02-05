export default function Overview() {
    return (
      <div className="card">
        <div className="cardHead">
          <div>
            <div style={{ fontWeight: 900 }}>Overview</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
              Product vision, scope, and value.
            </div>
          </div>
          <span className="badge">v1</span>
        </div>
        <div className="cardBody">
          <p className="p">Paste your report’s Overview/Executive Summary here.</p>
        </div>
      </div>
    );
  }