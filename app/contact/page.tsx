export default function Contact() {
    return (
      <div className="card">
        <div className="cardHead">
          <div>
            <div style={{ fontWeight: 900 }}>Contact</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>
              Partnerships, demos, research collaboration.
            </div>
          </div>
          <span className="badge">Info</span>
        </div>
        <div className="cardBody">
          <p className="p">Add an email, form link, or booking link.</p>
        </div>
      </div>
    );
  }