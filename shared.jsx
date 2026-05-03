// === Hampton Headstone Care — shared components (loaded on every page) ===
const { useState, useEffect, useRef, useMemo, useCallback, Fragment } = React;

// ── Form submission ─────────────────────────────────────────────
window.FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbyiQh4ZrVLQDlphBTJfQ2dRHGUX0_4qfJ5hcAL_9uTdKRmat_yGnIgY5-PMacb1qsFVHQ/exec";
window.submitForm = async function (kind, payload) {
  if (!window.FORM_ENDPOINT) { console.info("[HHC] form submit (not wired):", kind, payload); return; }
  try {
    const fd = new FormData();
    fd.append("kind", kind);
    fd.append("submitted_at", new Date().toISOString());
    fd.append("payload", JSON.stringify(payload));
    await fetch(window.FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: fd });
  } catch (e) { console.warn("[HHC] submit failed", e); }
};

// ── Mark / glyph ───────────────────────────────────────────────
function Mark({ size = 40, tone = "gold" }) {
  const stroke = tone === "gold" ? "var(--gold)" : "var(--forest)";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="39" height="39" stroke={stroke} strokeWidth="1" />
      <g transform="translate(20 20)">
        <path d="M -8 -10 L -8 10 M 8 -10 L 8 10 M -8 0 L 8 0" stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="square" />
      </g>
      <circle cx="20" cy="32" r="1.5" fill={stroke} />
    </svg>
  );
}

function OrnateDivider({ onDark }) {
  const color = "var(--gold)";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, margin: "24px 0" }}>
      <span style={{ flex: 1, height: 1, background: color, opacity: 0.4 }}></span>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="2" fill={color}></circle>
      </svg>
      <span style={{ flex: 1, height: 1, background: color, opacity: 0.4 }}></span>
    </div>
  );
}

function Placeholder({ label, dark, aspect = "4/3", style }) {
  return (
    <div className={"ph " + (dark ? "ph--dark" : "")} style={{ aspectRatio: aspect, ...style }} role="img" aria-label={label}>
      <div className="ph__label">{label || "real photo drops here"}</div>
    </div>
  );
}

// ── Nav (uses real page links — analytics-friendly) ────────────
function Nav({ current }) {
  const items = [
    { href: "index.html", label: "Home", id: "home" },
    { href: "services.html", label: "Services", id: "services" },
    { href: "gallery.html", label: "Gallery", id: "gallery" },
    { href: "finder.html", label: "Headstone Finder", id: "finder" },
  ];
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 760) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="nav grain">
      <div className="nav__inner">
        <a href="index.html" className="nav__brand" aria-label="Hampton Headstone Care — home">
          <Mark size={28} />
          <span className="nav__brand-text" style={{ marginLeft: 4 }}>Hampton Headstone Care</span>
          <span className="nav__brand-sub">East End · NY</span>
        </a>
        <div className="nav__links">
          {items.map((it) => (
            <a key={it.id} href={it.href} className={"nav__link" + (current === it.id ? " is-active" : "")}>
              {it.label}
            </a>
          ))}
          <a href="booking.html" className="nav__cta">Book a Cleaning</a>
        </div>
        <button
          className={"nav__burger" + (open ? " is-open" : "")}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {open && (
        <div className="nav__sheet">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.href}
              className={"nav__sheet-link" + (current === it.id ? " is-active" : "")}
              onClick={() => setOpen(false)}
            >
              {it.label}
            </a>
          ))}
          <a href="booking.html" className="nav__sheet-cta" onClick={() => setOpen(false)}>
            Book a Cleaning <span style={{ marginLeft: 8 }}>→</span>
          </a>
          <div className="nav__sheet-foot">
            <a href="tel:6316048002">(631) 604-8002</a>
            <span>·</span>
            <a href="mailto:HamptonHeadstoneCare@gmail.com">Email</a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer grain">
      <div className="page-wrap">
        <div className="footer__grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <Mark size={36} />
              <div>
                <div className="display" style={{ fontSize: 22, color: "var(--cream)" }}>Hampton Headstone Care</div>
                <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginTop: 4 }}>
                  Est. 2026 · East Hampton, NY
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="footer__heading">Contact</div>
            <a href="tel:6316048002" className="footer__link">(631) 604-8002</a>
            <a href="mailto:HamptonHeadstoneCare@gmail.com" className="footer__link">hamptonheadstonecare@gmail.com</a>
            <a href="contact.html" className="footer__link">Send a message</a>
          </div>

          <div>
            <div className="footer__heading">Sitemap</div>
            <a href="index.html" className="footer__link">Home</a>
            <a href="services.html" className="footer__link">Services & Pricing</a>
            <a href="gallery.html" className="footer__link">Before & After Gallery</a>
            <a href="booking.html" className="footer__link">Book a Cleaning</a>
            <a href="finder.html" className="footer__link">Headstone Finder</a>
            <a href="contact.html" className="footer__link">Contact</a>
          </div>

          <div>
            <div className="footer__heading">Service Area</div>
            <div className="footer__link" style={{ cursor: "default" }}>East Hampton</div>
            <div className="footer__link" style={{ cursor: "default" }}>Springs</div>
            <div className="footer__link" style={{ cursor: "default" }}>Amagansett</div>
            <div style={{ marginTop: 20, fontSize: 11, color: "rgba(212,184,122,0.9)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Season · May – October
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div>© 2026 Hampton Headstone Care · Owned & operated by Jason Bono</div>
          <div>Veteran flag placement is always complimentary.</div>
        </div>
      </div>
    </footer>
  );
}

// ── Before/After slider (dragging with pointer events) ─────────
function BASlider({ before, after, height = 520, beforeLabel = "Before", afterLabel = "After", aspect }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(50);
  const draggingRef = useRef(false);

  const updateFromX = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setPos(pct);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromX(x);
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateFromX]);

  const onDown = (e) => {
    draggingRef.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    updateFromX(x);
  };

  const style = aspect ? { aspectRatio: aspect } : (height ? { height } : { position: "absolute", inset: 0 });

  return (
    <div
      ref={wrapRef}
      className="ba-slider"
      style={style}
      onPointerDown={onDown}
      onTouchStart={onDown}
    >
      <img src={before} alt={beforeLabel} draggable="false" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <img src={after} alt={afterLabel} draggable="false" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 0 0 ${pos}%)` }} />
      <span className="ba-slider__label ba-slider__label--before">{beforeLabel}</span>
      <span className="ba-slider__label ba-slider__label--after">{afterLabel}</span>
      <div className="ba-slider__handle" style={{ left: pos + "%" }}>
        <div className="ba-slider__knob">‹›</div>
      </div>
    </div>
  );
}

// expose
Object.assign(window, { Mark, OrnateDivider, Placeholder, Nav, Footer, BASlider });
