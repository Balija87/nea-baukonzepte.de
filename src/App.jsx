import React, { useEffect, useState } from 'react'

const translations = {
  de: {
    brand: 'NEA Baukonzepte GmbH',
    tagline: 'Schnelle Verbindung, sichere Installation',
    heroCategory: 'Glasfaser | Bau & Netzwerk',
    heroHeading: 'Erdarbeiten, Kabelverlegung und Glasfaserinstallationen',
    heroDescription: 'Wir realisieren optische Netze und sichere Anschlussarbeiten für Wohn- und Geschäftskunden.',
    primaryAction: 'Angebot anfordern',
    secondaryAction: 'Jetzt anrufen',
    themeOn: 'An',
    themeOff: 'Aus',
    servicesSection: 'Leistungen',
    servicesTitle: 'Unsere Kernkompetenzen',
    services: [
      {
        icon: '⚡',
        title: 'Trassenarbeiten',
        description: 'Präziser Tiefbau und sichere Vorbereitung der Kabeltrasse.',
      },
      {
        icon: '⛓',
        title: 'Glasfaserverlegung',
        description: 'Professionelle Verlegung von Glasfaserkabeln für stabile Anschlüsse.',
      },
      {
        icon: '⚙',
        title: 'Anschlusstechnik',
        description: 'Fachgerechte Montage von Anschlusskästen und Übergabestellen.',
      },
    ],
    aboutLabel: 'Über uns',
    aboutTitle: 'Experten für Glasfaserinstallationen und Erdarbeiten',
    aboutDescription: 'Unser Team verbindet Bauexpertise mit Telekommunikationsstandards für eine zuverlässige Verbindung.',
    aboutBenefits: ['Präziser Tiefbau und Trassenplanung', 'Glasfaserverlegung nach modernem Standard', 'Abnahme und Endprüfung vor Übergabe'],
    contactLabel: 'Kontakt',
    contactTitle: 'Kostenlose Beurteilung vereinbaren',
    contactHeading: 'Kontaktinformationen',
    contactText: 'Kontaktieren Sie uns für Ihre nächste Glasfaserinstallation.',
    emailLabel: 'E‑Mail',
    locationLabel: 'Standort',
    namePlaceholder: 'Ihr Name',
    messagePlaceholder: 'Kurze Beschreibung der Arbeiten',
    submit: 'Senden',
    footer: '© 2026 NEA Baukonzepte GmbH. Alle Rechte vorbehalten.',
  },
  sr: {
    brand: 'NEA Baukonzepte GmbH',
    tagline: 'Brza veza, sigurna instalacija',
    heroCategory: 'Glas faza | Izgradnja mreže',
    heroHeading: 'Iskop, polaganje i završetak glas faze',
    heroDescription: 'Specijalizovani smo za optičke mreže, pripremu terena i pouzdano povezivanje.',
    primaryAction: 'Zatraži ponudu',
    secondaryAction: 'Pozovi sada',
    themeOn: 'Upaljeno',
    themeOff: 'Ugašeno',
    servicesSection: 'Usluge',
    servicesTitle: 'Radovi koje radimo',
    services: [
      {
        icon: '⚡',
        title: 'Iskop i priprema trase',
        description: 'Precizno iskopavanje i zaštita terena pre polaganja kablova.',
      },
      {
        icon: '⛓',
        title: 'Polaganje glas faze',
        description: 'Profesionalna instalacija optičkog kabla i priključaka.',
      },
      {
        icon: '⚙',
        title: 'Montaža priključaka',
        description: 'Postavljanje priključnih kutija i završnih konekcija.',
      },
    ],
    aboutLabel: 'O nama',
    aboutTitle: 'Stručnjaci za optičke instalacije i iskope',
    aboutDescription: 'Naš tim kombinuje građevinsko iskustvo i telekom standarde za sigurnu vezu.',
    aboutBenefits: ['Iskop i zaštita trase', 'Polaganje kablova i montaža priključaka', 'Testiranje veze pre predaje radova'],
    contactLabel: 'Kontakt',
    contactTitle: 'Dogovorite besplatnu procenu',
    contactHeading: 'Kontakt informacije',
    contactText: 'Javite nam se za brzu i profesionalnu realizaciju.',
    emailLabel: 'Email',
    locationLabel: 'Lokacija',
    namePlaceholder: 'Vaše ime',
    messagePlaceholder: 'Kratak opis radova',
    submit: 'Pošalji',
    footer: '© 2026 NEA Baukonzepte GmbH. Sve pravo zadržano.',
  },
}

export default function App() {
  const [language, setLanguage] = useState('de')
  const [theme, setTheme] = useState('dark')
  const t = translations[language]

  useEffect(() => {
    document.documentElement.classList.remove('dark-theme', 'light-theme')
    document.documentElement.classList.add(`${theme}-theme`)
  }, [theme])

  return (
    <div className={`page-container ${theme}-theme`}>
      <div className="hero-banner">
        <div className="hero-toolbar">
          <div className="hero-brand-wrap">
            <div>
              <p className="hero-brand">{t.brand}</p>
              <p className="hero-tagline">{t.tagline}</p>
            </div>
          </div>
          <div className="toolbar-actions">
            <div className="language-switch" role="group" aria-label="Language selector">
              <button type="button" className={language === 'de' ? 'active' : ''} onClick={() => setLanguage('de')}>DE</button>
              <button type="button" className={language === 'sr' ? 'active' : ''} onClick={() => setLanguage('sr')}>SR</button>
            </div>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? t.themeOff : t.themeOn}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <section className="hero fade-up">
          <div className="hero-copy">
            <p className="eyebrow">{t.heroCategory}</p>
            <h1>{t.heroHeading}</h1>
            <p>{t.heroDescription}</p>
            <div className="hero-actions">
              <a className="button primary" href="mailto:info@neabaukonzepte.de">{t.primaryAction}</a>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-visual" aria-hidden="true" />
            <div className="hero-details">
              <div className="hero-card">
                <span className="hero-card-title">{language === 'de' ? 'Schnelle Ausführung' : 'Brza izvedba'}</span>
                <p>{language === 'de' ? 'Wir führen Arbeiten schnell und ohne Verzögerungen aus, mit minimaler Belastung für das Umfeld.' : 'Realizujemo radove brzo i bez odlaganja, uz minimalan uticaj na okolinu.'}</p>
              </div>
              <div className="hero-card">
                <span className="hero-card-title">{language === 'de' ? 'Sichere Installation' : 'Sigurna instalacija'}</span>
                <p>{language === 'de' ? 'Jedes Kabel und jeder Anschluss wird nach Sicherheitsstandards installiert.' : 'Svaki kabl i priključak postavljamo po standardima bezbednosti.'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main>
        <section id="services" className="section services">
          <div className="section-header">
            <p className="section-label">{t.servicesSection}</p>
            <h2>{t.servicesTitle}</h2>
          </div>
          <div className="service-grid scroll-x">
            {t.services.map((service) => (
              <article key={service.title} className="service-card">
                <span className="service-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section about">
          <div className="about-content">
            <div>
              <p className="section-label">{t.aboutLabel}</p>
              <h2>{t.aboutTitle}</h2>
              <p>{t.aboutDescription}</p>
              <ul>
                {t.aboutBenefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="about-box">
              <p className="about-box-title">{language === 'de' ? 'Warum wir?' : 'Zašto nas izabrati?'}</p>
              <p>{language === 'de' ? 'Wir arbeiten mit modernen Werkzeugen, überprüfter Qualität und hoher Termintreue.' : 'Imamo iskustvo u instalacijama optičkih mreža i radimo sa modernom opremom i kontrolom kvaliteta.'}</p>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="section-header">
            <p className="section-label">{t.contactLabel}</p>
            <h2>{t.contactTitle}</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <h3>{t.contactHeading}</h3>
              <p>{t.contactText}</p>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <strong>{t.emailLabel}</strong>
                  <a href="mailto:info@neabaukonzepte.de">info@neabaukonzepte.de</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>{t.locationLabel}</strong>
                  <a href="https://www.google.com/maps/search/Waldstr.+168,+63071+Offenbach+Main?entry=gmail&source=g" target="_blank" rel="noreferrer">Waldstr. 168, 63071 Offenbach Main</a>
                </div>
              </div>
            </div>
            <div className="contact-card contact-form">
              <h3>{language === 'de' ? 'Nachricht senden' : 'Pošaljite poruku'}</h3>
              <label>
                {t.namePlaceholder}
                <input type="text" placeholder={t.namePlaceholder} />
              </label>
              <label>
                {t.messagePlaceholder}
                <textarea placeholder={t.messagePlaceholder} rows="5" />
              </label>
              <div className="contact-form-footer">
                <button type="button" className="button primary">{t.submit}</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  )
}

