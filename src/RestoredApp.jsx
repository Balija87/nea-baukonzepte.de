import { useEffect, useState } from 'react'

const copy = {
  de: {
    tagline: 'Schnelle Verbindung, sichere Installation',
    category: 'Glasfaser · Bau · Netzwerk',
    heading: 'Erdarbeiten und Glasfaserinstallationen aus einer Hand',
    description: 'Wir realisieren optische Netze, sichere Anschlussarbeiten und zuverlässige Lösungen für Wohn- und Geschäftskunden.',
    primaryAction: 'Angebot anfordern', servicesLabel: 'Leistungen', servicesTitle: 'Unsere Kernkompetenzen',
    services: [['⚡', 'Trassenarbeiten', 'Präziser Tiefbau und sichere Vorbereitung der Kabeltrasse.'], ['⌁', 'Glasfaserverlegung', 'Professionelle Verlegung von Glasfaserkabeln für stabile Anschlüsse.'], ['⚙', 'Anschlusstechnik', 'Fachgerechte Montage von Anschlusskästen und Übergabestellen.']],
    aboutLabel: 'Über uns', aboutTitle: 'Erfahrung, Qualität und ein sicherer Anschluss', aboutText: 'Unser Team verbindet Bauexpertise mit modernen Telekommunikationsstandards – für eine zuverlässige Verbindung vom ersten Spatenstich bis zur Übergabe.',
    benefits: ['Präziser Tiefbau und Trassenplanung', 'Glasfaserverlegung nach modernem Standard', 'Abnahme und Endprüfung vor Übergabe'],
    contactLabel: 'Kontakt', contactTitle: 'Kostenlose Beurteilung vereinbaren', contactText: 'Kontaktieren Sie uns für Ihre nächste Glasfaserinstallation.',
    name: 'Ihr Name', message: 'Kurze Beschreibung der Arbeiten', submit: 'Nachricht senden', footer: '© 2026 NEA Baukonzepte GmbH. Alle Rechte vorbehalten.', sent: 'Ihre Nachricht wurde vorbereitet.', locked: 'Neue Nachrichten sind auf diesem Gerät in', lockedEnd: 'wieder möglich.'
  },
  sr: {
    tagline: 'Brza veza, sigurna instalacija',
    category: 'Optika · Izgradnja · Mreža', heading: 'Iskop i instalacija optičkih mreža na jednom mjestu', description: 'Realizujemo optičke mreže, sigurne priključke i pouzdana rješenja za privatne i poslovne objekte.', primaryAction: 'Zatraži ponudu', servicesLabel: 'Usluge', servicesTitle: 'Radovi koje radimo',
    services: [['⚡', 'Iskop i priprema trase', 'Precizno iskopavanje i zaštita terena prije polaganja kablova.'], ['⌁', 'Polaganje optike', 'Profesionalna instalacija optičkog kabla i priključaka.'], ['⚙', 'Montaža priključaka', 'Postavljanje priključnih kutija i završnih konekcija.']],
    aboutLabel: 'O nama', aboutTitle: 'Iskustvo, kvalitet i siguran priključak', aboutText: 'Naš tim spaja građevinsko iskustvo i moderne telekom standarde – za pouzdanu vezu od prvog iskopa do predaje radova.', benefits: ['Iskop i zaštita trase', 'Polaganje kablova i montaža priključaka', 'Testiranje veze prije predaje radova'],
    contactLabel: 'Kontakt', contactTitle: 'Dogovorite besplatnu procjenu', contactText: 'Javite nam se za brzu i profesionalnu realizaciju.', name: 'Vaše ime', message: 'Kratak opis radova', submit: 'Pošalji poruku', footer: '© 2026 NEA Baukonzepte GmbH. Sva prava zadržana.', sent: 'Poruka je spremna za slanje.', locked: 'Novo slanje sa ovog preglednika je dostupno za', lockedEnd: '.'
  }
}

export default function RestoredApp() {
  const [language, setLanguage] = useState('de')
  const [theme, setTheme] = useState('dark')
  const [lockExpiresAt, setLockExpiresAt] = useState(0)
  const [now, setNow] = useState(Date.now())
  const text = copy[language]

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => {
    setLockExpiresAt(Number(localStorage.getItem('nea-contact-lock-expires-at')) || 0)
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const sendMail = (event) => {
    event.preventDefault()
    if (lockExpiresAt > Date.now()) return
    const data = new FormData(event.currentTarget)
    const subject = language === 'de' ? 'Kontaktanfrage über die Website' : 'Upit preko web stranice'
    const body = `Name: ${data.get('name')}\n\n${data.get('message')}`
    const expires = Date.now() + 60 * 60 * 1000
    localStorage.setItem('nea-contact-lock-expires-at', String(expires))
    setLockExpiresAt(expires)
    window.location.href = `mailto:info@neabaukonzepte.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const locked = lockExpiresAt > now
  const remaining = Math.max(0, Math.ceil((lockExpiresAt - now) / 1000))
  const clock = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
  const requestQuote = () => { window.location.href = `mailto:info@neabaukonzepte.de?subject=${encodeURIComponent(language === 'de' ? 'Anfrage für ein Angebot' : 'Upit za ponudu')}` }

  return <div className="site-shell">
    <header className="hero"><nav className="toolbar container" aria-label="Glavna navigacija">
      <div className="brand"><div><strong>NEA <em>Baukonzepte</em></strong><span>{text.tagline}</span></div></div>
      <div className="controls"><div className="language-control" aria-label="Izbor jezika">{['de', 'sr'].map(code => <button type="button" className={language === code ? 'active' : ''} onClick={() => setLanguage(code)} key={code}>{code.toUpperCase()}</button>)}</div><button className="theme-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Promijeni temu">{theme === 'dark' ? '☀' : '☾'}</button></div>
    </nav><div className="hero-content container"><p className="eyebrow">{text.category}</p><h1>{text.heading}</h1><p className="hero-description">{text.description}</p><button className="button button-primary" type="button" onClick={requestQuote}>{text.primaryAction}</button><div className="hero-image" role="img" aria-label="Glasfaserinstallation" /></div></header>
    <main className="container main-content"><section><div className="section-heading"><p className="eyebrow">{text.servicesLabel}</p><h2>{text.servicesTitle}</h2></div><div className="service-grid">{text.services.map(([icon, title, description]) => <article className="card service-card" key={title}><span className="service-icon">{icon}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="about-section"><div className="about-copy"><p className="eyebrow">{text.aboutLabel}</p><h2>{text.aboutTitle}</h2><p>{text.aboutText}</p></div><aside className="card benefits-card"><h3>{language === 'de' ? 'Warum wir?' : 'Zašto nas izabrati?'}</h3><ul>{text.benefits.map(item => <li key={item}>✓ {item}</li>)}</ul></aside></section>
    <section><div className="section-heading"><p className="eyebrow">{text.contactLabel}</p><h2>{text.contactTitle}</h2></div><div className="contact-grid"><article className="card contact-card"><h3>{language === 'de' ? 'Kontaktinformationen' : 'Kontakt informacije'}</h3><p>{text.contactText}</p><a href="mailto:info@neabaukonzepte.de">✉&nbsp; info@neabaukonzepte.de</a><a href="https://www.google.com/maps/search/Waldstr.+168,+63071+Offenbach+Main" target="_blank" rel="noreferrer">⌖&nbsp; Waldstr. 168, 63071 Offenbach Main</a></article><form className={`card contact-form ${locked ? 'form-locked' : ''}`} onSubmit={sendMail}>{locked ? <div className="send-success" role="status"><span className="success-mark">✓</span><strong>{text.sent}</strong><p>{text.locked} <b>{clock}</b> {text.lockedEnd}</p></div> : <><label>{text.name}<input name="name" type="text" placeholder={text.name} required /></label><label>{text.message}<textarea name="message" rows="5" placeholder={text.message} required /></label><button className="button button-primary" type="submit">{text.submit}</button></>}</form></div></section></main>
    <footer><p>{text.footer}</p></footer>
  </div>
}
