// Headstone Finder — Cedar Lawn Cemetery
// useState, useMemo, useEffect already declared at top of shared.jsx (shared scope)

const CEDAR_LAWN = { id: "cedar", name: "Cedar Lawn Cemetery", area: "East Hampton", town: "Cooper Lane", est: 1831 };
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const SECTIONS = [1, 2, 3];

function loadLocalEntries() {
  try {
    const CLEANUP_KEY = "hhc:finder:cleanup-v1";
    if (!localStorage.getItem(CLEANUP_KEY)) {
      localStorage.removeItem("hhc:finder:entries");
      localStorage.setItem(CLEANUP_KEY, "done");
      return [];
    }
    const raw = localStorage.getItem("hhc:finder:entries");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveLocalEntries(entries) {
  try { localStorage.setItem("hhc:finder:entries", JSON.stringify(entries)); } catch {}
}

async function fetchSheetEntries() {
  if (!window.FORM_ENDPOINT) return [];
  try {
    const res = await fetch(window.FORM_ENDPOINT, { method: "GET" });
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json.entries) ? json.entries : [];
    return list.map((e) => ({
      id: e.id || ("sheet-" + Math.random().toString(36).slice(2)),
      name: e.name || "", birth: e.birth || "", death: e.death || "",
      religion: e.religion || "", veteran: !!e.veteran, sector: e.sector || "",
      note: e.note || "", cemetery: "cedar-lawn", _source: "sheet",
    }));
  } catch (err) { console.warn("[HHC] Could not load Sheet entries:", err); return []; }
}

function CedarLawnMap({ active, onSelect, counts }) {
  const mainCells = [];
  ROWS.forEach((row, i) => {
    const x = 405 + i * 70;
    SECTIONS.forEach((section, j) => {
      const y = 120 + j * 220;
      mainCells.push({ id: row + section, x, y, w: 58, h: 220 });
    });
  });
  return (
    <div className="cl-map">
      <svg viewBox="0 0 1200 880" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cedar Lawn Cemetery interactive sector map">
        <path className="cl-property-line" d="M 60 60 L 1140 60 L 1140 820 L 60 820 Z" />
        <rect className="cl-road" x="120" y="108" width="973" height="12" />
        <rect className={"cl-zone" + (active === "X1" ? " is-active" : counts["X1"] ? " has-entries" : "")} x="120" y="120" width="260" height="210" rx="2" onClick={() => onSelect("X1")} />
        <text className="cl-zone-label" x="250" y="221" style={{ fontSize: 22 }}>X1</text>
        {counts["X1"] > 0 && <text className="cl-zone-count" x="250" y="245">{counts["X1"]} ON RECORD</text>}
        <rect className="cl-road" x="120" y="330" width="285" height="10" />
        <rect className="cl-road" x="370" y="120" width="10" height="220" />
        {mainCells.map((c) => {
          const isActive = active === c.id;
          const has = counts[c.id] > 0;
          return (
            <g key={c.id} onClick={() => onSelect(c.id)} style={{ cursor: "pointer" }}>
              <rect className={"cl-zone" + (isActive ? " is-active" : has ? " has-entries" : "")} x={c.x} y={c.y} width={c.w} height={c.h} />
              <text className="cl-zone-label" x={c.x + c.w / 2} y={c.y + c.h / 2}>{c.id}</text>
              {has && <text className="cl-zone-count" x={c.x + c.w / 2} y={c.y + c.h / 2 + 18}>{counts[c.id]}</text>}
            </g>
          );
        })}
        {[463, 533, 603, 673, 743, 813, 883, 953, 1023].map((x) => <rect key={x} className="cl-road" x={x} y="120" width="12" height="660" />)}
        <line className="cl-section-divider" x1="405" y1="340" x2="1093" y2="340" />
        <line className="cl-section-divider" x1="405" y1="560" x2="1093" y2="560" />
        <path className="cl-road" d="M 408 840 C 408 808, 432 786, 469 786 L 715 786 C 752 786, 732 808, 732 840 L 720 840 C 720 814, 738 798, 715 798 L 469 798 C 446 798, 420 814, 420 840 Z" />
        <path className="cl-road" d="M 763 840 C 763 808, 788 786, 819 786 L 1075 786 C 1106 786, 1087 808, 1087 840 L 1075 840 C 1075 814, 1098 798, 1075 798 L 819 798 C 796 798, 775 814, 775 840 Z" />
        <circle className="cl-entrance" cx="414" cy="845" r="9" />
        <circle className="cl-entrance" cx="726" cy="845" r="9" />
        <circle className="cl-entrance" cx="769" cy="845" r="9" />
        <circle className="cl-entrance" cx="1081" cy="845" r="9" />
        <circle className="cl-entrance" cx="120" cy="330" r="9" />
        <text className="cl-cooper-label" x="745" y="870">COOPER LANE</text>
        <g transform="translate(140, 700)">
          <circle className="cl-compass-circle" cx="0" cy="0" r="38" />
          <polygon className="cl-compass-arrow" points="0,0 30,-6 30,6" />
          <text className="cl-compass-label" x="34" y="-12">N</text>
          <text className="cl-compass-label" x="-34" y="-12">S</text>
          <text className="cl-compass-label" x="0" y="-30">W</text>
          <text className="cl-compass-label" x="0" y="34">E</text>
        </g>
      </svg>
      <div className="cl-map__legend">
        <div className="cl-map__legend-item"><span className="cl-map__sw" /> Sector (click to filter)</div>
        <div className="cl-map__legend-item"><span className="cl-map__sw cl-map__sw--road" /> Road</div>
        <div className="cl-map__legend-item"><span className="cl-map__sw cl-map__sw--entrance" /> Entrance</div>
        <div className="cl-map__legend-item"><span className="cl-map__sw cl-map__sw--property" /> Property line</div>
      </div>
    </div>
  );
}

function CemeteryView({ cemetery, onPickPerson, onAdd, entries }) {
  const [sector, setSector] = useState(null);
  const [q, setQ] = useState("");
  const [vetOnly, setVetOnly] = useState(false);

  const counts = useMemo(() => {
    const c = {};
    entries.forEach((p) => { if (p.sector) c[p.sector] = (c[p.sector] || 0) + 1; });
    return c;
  }, [entries]);

  const filtered = entries.filter((p) => {
    if (sector && p.sector !== sector) return false;
    if (vetOnly && !p.veteran) return false;
    if (q) {
      const hay = (p.name + " " + (p.birth || "") + " " + (p.death || "") + " " + (p.religion || "")).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="finder-header-grid">
        <div>
          <div className="eyebrow">{cemetery.area}</div>
          <div style={{ height: 12 }} />
          <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)", color: "var(--forest)", margin: 0, lineHeight: 1.05 }}>{cemetery.name}</h1>
          <div style={{ height: 12 }} />
          <div style={{ color: "var(--stone)", fontSize: 14 }}>{cemetery.town} · Est. {cemetery.est} · {entries.length.toLocaleString()} on record</div>
        </div>
        <button className="btn btn--primary" onClick={onAdd}>+ Add a person <span className="arrow">→</span></button>
      </div>

      <div className="finder-detail-grid">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Sector map</div>
          <CedarLawnMap active={sector} onSelect={(id) => setSector(sector === id ? null : id)} counts={counts} />
          <div style={{ marginTop: 16, fontSize: 12, color: "var(--stone)", lineHeight: 1.7 }}>
            The cemetery is divided into general sectors — not exact coordinates.
            {sector ? <> Filtering by <strong style={{ color: "var(--forest)" }}>{sector}</strong>. <button onClick={() => setSector(null)} style={{ background: "none", border: 0, color: "var(--gold)", cursor: "pointer", fontFamily: "inherit", fontSize: 12, textDecoration: "underline" }}>clear</button></> : <> Tap a sector to filter, or scroll to see everyone on record.</>}
          </div>
        </div>

        <div>
          <div className="finder-search-row">
            <div>
              <div className="field-label">Search by name, year, religion</div>
              <input className="field-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Margaret, 1918, Episcopal…" />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 0", whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={vetOnly} onChange={(e) => setVetOnly(e.target.checked)} style={{ accentColor: "var(--forest)", width: 16, height: 16 }} />
              <span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--moss-light)" }}>Veterans only</span>
            </label>
          </div>

          <div style={{ borderTop: "1px solid var(--forest)" }}>
            {entries.length === 0 ?
              <div style={{ padding: "56px 16px", textAlign: "center", color: "var(--stone)", lineHeight: 1.7 }}>
                <div className="display-italic" style={{ fontSize: 22, color: "var(--forest)", marginBottom: 12 }}>The book is open.</div>
                <div style={{ maxWidth: 360, margin: "0 auto", fontSize: 14 }}>
                  No one has been added to the Cedar Lawn record yet. Be the first — <button onClick={onAdd} style={{ background: "none", border: 0, color: "var(--gold)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>add someone you know</button> who rests here.
                </div>
              </div> :
              filtered.length === 0 ?
              <div style={{ padding: "48px 0", textAlign: "center", color: "var(--stone)" }}>
                No one matches. Try widening the search, or <button onClick={onAdd} style={{ background: "none", border: 0, color: "var(--gold)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>add them to the record</button>.
              </div> :
              filtered.map((p) =>
                <button key={p.id} onClick={() => onPickPerson(p)} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, padding: "22px 4px", borderBottom: "1px solid var(--rule)", alignItems: "center", width: "100%", background: "none", border: 0, textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                  <div>
                    <div className="display" style={{ fontSize: 22, color: "var(--forest)" }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: "var(--stone)", marginTop: 4, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                      {(p.birth || p.death) && <span>{p.birth || "?"} – {p.death || "?"}</span>}
                      {p.religion && <><span className="gold-dot" /><span>{p.religion}</span></>}
                      {p.veteran && <><span className="gold-dot" /><span style={{ color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: 10 }}>Veteran</span></>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className="display" style={{ fontSize: 22, color: "var(--gold)" }}>{p.sector || "—"}</div>
                    <span style={{ color: "var(--stone)" }}>→</span>
                  </div>
                </button>
              )
            }
          </div>
          {entries.length > 0 &&
            <div style={{ marginTop: 16, fontSize: 11, color: "var(--stone)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {filtered.length} of {entries.length} on record
            </div>
          }
        </div>
      </div>

      <div style={{ marginTop: 96, padding: "32px 36px", border: "1px dashed var(--rule)", background: "var(--cream)", textAlign: "center" }}>
        <div className="eyebrow">More cemeteries</div>
        <div style={{ marginTop: 10, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--forest)" }}>
          Green River, St. Luke's, Amagansett & Oakland — coming soon.
        </div>
      </div>
    </div>
  );
}

function PersonDetail({ person, cemetery, onBack, onSuggestEdit }) {
  return (
    <div>
      <button className="btn btn--ghost" onClick={onBack} style={{ marginBottom: 32 }}>← Back to {cemetery.name}</button>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64 }}>
        <div>
          <div className="eyebrow">In memory of</div>
          <div style={{ height: 16 }} />
          <h1 className="display" style={{ fontSize: "clamp(44px, 6vw, 72px)", color: "var(--forest)", margin: 0, lineHeight: 1.05 }}>{person.name}</h1>
          <div style={{ height: 20 }} />
          <div className="display-italic" style={{ fontSize: 28, color: "var(--gold)" }}>{person.birth} – {person.death}</div>
          <OrnateDivider />
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 32 }}>
            <div><div className="eyebrow">Religion</div><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--forest)", marginTop: 4 }}>{person.religion}</div></div>
            <div><div className="eyebrow">Veteran</div><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: person.veteran ? "var(--gold)" : "var(--forest)", marginTop: 4 }}>{person.veteran ? "Yes — flag placement free" : "No"}</div></div>
            <div><div className="eyebrow">Sector</div><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--forest)", marginTop: 4 }}>{person.sector}</div></div>
          </div>
          <p className="body-text" style={{ fontSize: 16, lineHeight: 1.9 }}>{person.note}</p>
          <div style={{ marginTop: 24 }}>
            <button className="btn btn--ghost" onClick={onSuggestEdit} style={{ fontSize: 12, letterSpacing: "0.18em" }}>✎ Suggest an edit</button>
          </div>
          <div style={{ marginTop: 48, padding: "24px 28px", border: "1px solid var(--rule)", background: "var(--cream)", display: "flex", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="eyebrow">Caring from far away?</div>
              <div style={{ marginTop: 6, color: "var(--forest)", fontFamily: "'Cormorant Garamond', serif", fontSize: 22 }}>Book a cleaning for {person.name.split(" ")[0]}'s stone.</div>
            </div>
            <a href="booking.html" className="btn btn--primary">Book a cleaning <span className="arrow">→</span></a>
          </div>
        </div>
        <div>
          <Placeholder label={`${cemetery.name} · Sector ${person.sector}`} aspect="4/5" />
          <div style={{ marginTop: 16, fontSize: 12, color: "var(--stone)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
            {cemetery.name} · {cemetery.area}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddPerson({ cemetery, onBack, onSubmit }) {
  const [form, setForm] = useState({ name: "", birth: "", death: "", religion: "", veteran: false, sector: "", note: "" });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Mark size={48} />
        <div style={{ height: 24 }} />
        <div className="eyebrow">Thank you</div>
        <div style={{ height: 12 }} />
        <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 52px)", color: "var(--forest)", margin: 0 }}>Added to the record.</h2>
        <p className="body-text" style={{ margin: "16px auto 0", maxWidth: 500 }}>
          {form.name} is now part of the {cemetery.name} record. Thank you for helping preserve the history of our community.
        </p>
        <div style={{ height: 32 }} />
        <button className="btn" onClick={onBack}>Back to {cemetery.name}</button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn--ghost" onClick={onBack} style={{ marginBottom: 32 }}>← Back to {cemetery.name}</button>
      <div style={{ maxWidth: 760 }}>
        <div className="eyebrow">Add to the record</div>
        <div style={{ height: 16 }} />
        <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 60px)", color: "var(--forest)", margin: 0 }}>
          Help us remember<br /><span className="display-italic" style={{ color: "var(--gold)" }}>someone here.</span>
        </h1>
        <div style={{ height: 20 }} />
        <p className="body-text">Anyone can add a name. We don't verify every entry, but we do review flags for inaccuracy. Share only what you know.</p>
        <div style={{ height: 48 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ gridColumn: "1 / -1" }}><div className="field-label">Full name</div><input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><div className="field-label">Birth year</div><input className="field-input" value={form.birth} onChange={(e) => setForm({ ...form, birth: e.target.value })} /></div>
          <div><div className="field-label">Death year</div><input className="field-input" value={form.death} onChange={(e) => setForm({ ...form, death: e.target.value })} /></div>
          <div><div className="field-label">Religious affiliation</div><input className="field-input" placeholder="e.g. Catholic, Episcopal, —" value={form.religion} onChange={(e) => setForm({ ...form, religion: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="field-label">Sector — tap on the map, or pick from the list</div>
            <div className="finder-add-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start", marginTop: 8 }}>
              <CedarLawnMap active={form.sector} onSelect={(id) => setForm({ ...form, sector: form.sector === id ? "" : id })} counts={{}} />
              <div>
                <select className="field-select" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
                  <option value="">Choose a sector</option>
                  <optgroup label="Annex"><option value="X1">X1 — Annex</option></optgroup>
                  {ROWS.map((r) => <optgroup key={r} label={`Row ${r}`}>{SECTIONS.map((s) => <option key={r + s} value={r + s}>{r + s}</option>)}</optgroup>)}
                  <option value="unknown">I'm not sure</option>
                </select>
                <div style={{ marginTop: 16, padding: "16px 18px", background: "var(--cream)", border: "1px solid var(--rule)", fontSize: 13, color: "var(--dark-stone)", lineHeight: 1.6 }}>
                  {form.sector ?
                    <>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "var(--gold)", marginBottom: 4 }}>
                        {form.sector === "unknown" ? "Not sure" : form.sector}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--stone)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {form.sector === "X1" ? "Annex" : form.sector === "unknown" ? "We'll help locate them" : `Row ${form.sector[0]}, Section ${form.sector[1]}`}
                      </div>
                    </> :
                    <span style={{ color: "var(--stone)", fontStyle: "italic" }}>No sector chosen yet. Tap a square on the map.</span>
                  }
                </div>
              </div>
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 12, gridColumn: "1 / -1", cursor: "pointer" }}>
            <input type="checkbox" checked={form.veteran} onChange={(e) => setForm({ ...form, veteran: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--forest)" }} />
            <span style={{ fontSize: 14 }}>They served in the military</span>
          </label>
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="field-label">A few sentences about them</div>
            <textarea className="field-textarea" style={{ minHeight: 120 }} placeholder="A short biography, a memory, what they meant to the community…" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
        </div>
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end", gap: 16 }}>
          <button className="btn btn--ghost" onClick={onBack}>Cancel</button>
          <button className="btn btn--primary"
            onClick={() => { if (form.name) { window.submitForm("finder_add_person", { ...form, cemetery: cemetery.id, cemeteryName: cemetery.name }); setSubmitted(true); onSubmit && onSubmit({ ...form, cemetery: cemetery.id }); } }}
            style={{ opacity: form.name ? 1 : 0.4, pointerEvents: form.name ? "auto" : "none" }}>
            Add to record <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SuggestEdit({ person, cemetery, onBack }) {
  const [form, setForm] = useState({
    name: person.name || "", birth: person.birth || "", death: person.death || "",
    religion: person.religion || "", veteran: !!person.veteran, sector: person.sector || "",
    note: person.note || "", reason: "", suggesterName: "", suggesterEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Mark size={48} />
        <div style={{ height: 24 }} />
        <div className="eyebrow">Thank you</div>
        <div style={{ height: 12 }} />
        <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 52px)", color: "var(--forest)", margin: 0 }}>Your suggestion is on its way.</h2>
        <p className="body-text" style={{ margin: "16px auto 0", maxWidth: 520 }}>Jason will review your edit and update the record.</p>
        <div style={{ height: 32 }} />
        <button className="btn" onClick={onBack}>Back to {person.name}</button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn--ghost" onClick={onBack} style={{ marginBottom: 32 }}>← Back to {person.name}</button>
      <div style={{ maxWidth: 760 }}>
        <div className="eyebrow">Suggest an edit</div>
        <div style={{ height: 16 }} />
        <h1 className="display" style={{ fontSize: "clamp(40px, 5vw, 60px)", color: "var(--forest)", margin: 0 }}>
          See something to fix<br /><span className="display-italic" style={{ color: "var(--gold)" }}>about {person.name}?</span>
        </h1>
        <div style={{ height: 20 }} />
        <p className="body-text">Edit any field below. Your suggestion is sent to Jason for review.</p>
        <div style={{ height: 48 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ gridColumn: "1 / -1" }}><div className="field-label">Full name</div><input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><div className="field-label">Birth year</div><input className="field-input" value={form.birth} onChange={(e) => setForm({ ...form, birth: e.target.value })} /></div>
          <div><div className="field-label">Death year</div><input className="field-input" value={form.death} onChange={(e) => setForm({ ...form, death: e.target.value })} /></div>
          <div><div className="field-label">Religious affiliation</div><input className="field-input" value={form.religion} onChange={(e) => setForm({ ...form, religion: e.target.value })} /></div>
          <div>
            <div className="field-label">Sector</div>
            <select className="field-select" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
              <option value="">Choose a sector</option>
              <optgroup label="Annex"><option value="X1">X1 — Annex</option></optgroup>
              {ROWS.map((r) => <optgroup key={r} label={`Row ${r}`}>{SECTIONS.map((s) => <option key={r + s} value={r + s}>{r + s}</option>)}</optgroup>)}
              <option value="unknown">Not sure</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", paddingTop: 28 }}>
            <input type="checkbox" checked={form.veteran} onChange={(e) => setForm({ ...form, veteran: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--forest)" }} />
            <span style={{ fontSize: 14 }}>They served in the military</span>
          </label>
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="field-label">Biography / memory</div>
            <textarea className="field-textarea" style={{ minHeight: 120 }} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="field-label">What needs fixing? (optional)</div>
            <textarea className="field-textarea" style={{ minHeight: 80 }} placeholder="A short note about what you changed and why…" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          <div><div className="field-label">Your name</div><input className="field-input" value={form.suggesterName} onChange={(e) => setForm({ ...form, suggesterName: e.target.value })} /></div>
          <div><div className="field-label">Your email (so we can follow up)</div><input className="field-input" type="email" value={form.suggesterEmail} onChange={(e) => setForm({ ...form, suggesterEmail: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end", gap: 16 }}>
          <button className="btn btn--ghost" onClick={onBack}>Cancel</button>
          <button className="btn btn--primary"
            onClick={() => { if (form.suggesterEmail) { window.submitForm("finder_edit_suggestion", { ...form, cemetery: cemetery.id, cemeteryName: cemetery.name, originalPersonId: person.id, originalName: person.name }); setSubmitted(true); } }}
            style={{ opacity: form.suggesterEmail ? 1 : 0.4, pointerEvents: form.suggesterEmail ? "auto" : "none" }}>
            Send suggestion <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Finder() {
  const cemetery = CEDAR_LAWN;
  const [view, setView] = useState("cemetery");
  const [person, setPerson] = useState(null);
  const [localEntries, setLocalEntries] = useState(loadLocalEntries);
  const [sheetEntries, setSheetEntries] = useState([]);

  useEffect(() => {
    let alive = true;
    fetchSheetEntries().then((list) => { if (alive) setSheetEntries(list); });
    return () => { alive = false; };
  }, []);

  const entries = useMemo(() => {
    const key = (e) => (e.name || "").toLowerCase().trim() + "|" + (e.birth || "") + "|" + (e.death || "");
    const seen = new Set(sheetEntries.map(key));
    const localOnly = localEntries.filter((e) => !seen.has(key(e)));
    return [...localOnly, ...sheetEntries];
  }, [sheetEntries, localEntries]);

  const handleAdded = (entry) => {
    const next = [{ ...entry, id: Date.now() }, ...localEntries];
    setLocalEntries(next);
    saveLocalEntries(next);
  };

  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="page-wrap">
          {view === "cemetery" && <CemeteryView cemetery={cemetery} entries={entries} onPickPerson={(p) => { setPerson(p); setView("person"); }} onAdd={() => setView("add")} />}
          {view === "person" && person && <PersonDetail person={person} cemetery={cemetery} onBack={() => setView("cemetery")} onSuggestEdit={() => setView("suggest")} />}
          {view === "suggest" && person && <SuggestEdit person={person} cemetery={cemetery} onBack={() => setView("person")} />}
          {view === "add" && <AddPerson cemetery={cemetery} onBack={() => setView("cemetery")} onSubmit={handleAdded} />}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Finder });
