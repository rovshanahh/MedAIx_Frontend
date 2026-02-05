export default function Team() {
    return (
      <div className="card">
        <div className="cardHead">
          <div>
            <div style={{ fontWeight: 900 }}>Team</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
              Roles and responsibilities.
            </div>
          </div>
          <span className="badge">People</span>
        </div>
        <div className="cardBody">
          <p className="p">Add team members + responsibilities here.</p>
        </div>
      </div>
    );
  }