export default function Pipeline() {
    return (
      <div className="card">
        <div className="cardHead">
          <div>
            <div style={{ fontWeight: 900 }}>Pipeline</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
              Preprocessing → detection → routing → inference → explainability.
            </div>
          </div>
          <span className="badge">Docs</span>
        </div>
        <div className="cardBody">
          <p className="p">Paste your pipeline description + diagrams (links/images) here.</p>
        </div>
      </div>
    );
  }