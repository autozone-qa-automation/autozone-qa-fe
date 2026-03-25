/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import './styles/main.css'

import { type ReactNode } from 'react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    color: #111;
    line-height: 1.6;
  }

  .page {
    max-width: 720px;
    margin: 0 auto;
    padding: 4rem 2rem 6rem;
  }

  .header {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 2rem;
    margin-bottom: 3rem;
  }

  .badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #888;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
  }

  .subtitle {
    font-size: 14px;
    color: #888;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-bottom: 1rem;
  }

  .env-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .env-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 1rem 1.25rem;
  }

  .env-name {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #aaa;
    margin-bottom: 4px;
  }

  .env-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }

  .env-url {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #333;
    word-break: break-all;
    text-decoration: none;
  }

  .env-url:hover { color: #000; text-decoration: underline; }

  .flow-list {
    list-style: none;
    counter-reset: step;
  }

  .flow-list li {
    counter-increment: step;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
  }

  .flow-list li:last-child { border-bottom: none; }

  .flow-list li::before {
    content: counter(step);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #bbb;
    min-width: 20px;
    padding-top: 2px;
  }

  .code {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    padding: 1px 6px;
    color: #333;
  }

  .notes-list {
    list-style: none;
  }

  .notes-list li {
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #444;
  }

  .notes-list li:last-child { border-bottom: none; }

  .dot-prefix {
    color: #ccc;
    font-size: 18px;
    line-height: 1.2;
  }

  .guardians-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }

  .guardian-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 12px 14px;
  }

  .guardian-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .guardian-id {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #aaa;
  }

  .stack-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .stack-pill {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 4px 12px;
    color: #444;
  }

  .footer {
    border-top: 1px solid #e8e8e8;
    padding-top: 1.5rem;
    font-size: 12px;
    color: #bbb;
    font-family: 'DM Mono', monospace;
  }
`

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="section">
      <p className="section-label">{label}</p>
      {children}
    </div>
  )
}

function App() {
  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <p className="badge">TC3005B GPO500 — 2026</p>
          <h1>Autozone QA Automation</h1>
          <p className="subtitle">Tecnológico de Monterrey — Campus Chihuahua</p>
        </div>

        <Section label="Ambientes">
          <div className="env-grid">
            <div className="env-card">
              <p className="env-name">
                <span className="env-dot" style={{ background: '#185FA5' }} />
                DEV
              </p>
              <a
                className="env-url"
                href="https://autozone-qa-fe-dev-460642913845.us-central1.run.app"
                target="_blank"
                rel="noreferrer"
              >
                autozone-qa-fe-dev-460642913845.us-central1.run.app
              </a>
            </div>
            <div className="env-card">
              <p className="env-name">
                <span className="env-dot" style={{ background: '#BA7517' }} />
                UAT
              </p>
              <a
                className="env-url"
                href="https://autozone-qa-fe-uat-460642913845.us-central1.run.app"
                target="_blank"
                rel="noreferrer"
              >
                autozone-qa-fe-uat-460642913845.us-central1.run.app
              </a>
            </div>
          </div>
        </Section>

        <Section label="Flujo de contribución">
          <ol className="flow-list">
            <li>
              Párate en <span className="code">main</span> y haz{' '}
              <span className="code">git pull origin main</span>
            </li>
            <li>
              Crea tu rama con la nomenclatura del ticket:{' '}
              <span className="code">git checkout -b AZ-123</span>
            </li>
            <li>
              Haz tus cambios y verifica con <span className="code">npm run lint</span> y{' '}
              <span className="code">npm test</span>
            </li>
            <li>
              Sube tu rama y abre un Pull Request hacia <span className="code">main</span>
            </li>
            <li>Solicita review a uno de los Git Guardians</li>
            <li>El CI corre automáticamente — lint, tests y build deben pasar</li>
            <li>Con aprobación y checks verdes, se puede mergear</li>
            <li>Post-merge: Snapshot en Actions → Deploy DEV → Deploy UAT</li>
          </ol>
        </Section>

        <Section label="Things to keep in mind">
          <ul className="notes-list">
            <li>
              <span className="dot-prefix">—</span>
              Nomenclatura de ramas: <span className="code">AZ-#</span> donde{' '}
              <span className="code">#</span> es el número de ticket en Jira
            </li>
            <li>
              <span className="dot-prefix">—</span>
              Todo archivo <span className="code">.ts</span> y <span className="code">.tsx</span>{' '}
              debe incluir el header del proyecto
            </li>
            <li>
              <span className="dot-prefix">—</span>
              Activa Format on Save — instala Prettier y ESLint en VS Code
            </li>
            <li>
              <span className="dot-prefix">—</span>
              Corre <span className="code">npm run lint:fix</span> antes de hacer push
            </li>
            <li>
              <span className="dot-prefix">—</span>
              No hagas push directo a <span className="code">main</span> — siempre vía PR
            </li>
            <li>
              <span className="dot-prefix">—</span>
              El deploy a UAT requiere aprobación de un Git Guardian
            </li>
            <li>
              <span className="dot-prefix">—</span>
              <span className="code">package-lock.json</span> sí se commitea
            </li>
          </ul>
        </Section>

        <Section label="Git Guardians">
          <div className="guardians-grid">
            {[
              { name: 'Alonso Alarcón', id: 'A01563388' },
              { name: 'Alejandro Carrillo', id: 'A01567228' },
              { name: 'Rocío Rodríguez', id: 'A01563530' },
              { name: 'Saúl Campos', id: 'A01567242' },
              { name: 'Eliel Mejía', id: 'A01563697' },
            ].map(g => (
              <div key={g.id} className="guardian-card">
                <p className="guardian-name">{g.name}</p>
                <p className="guardian-id">{g.id}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Stack">
          <div className="stack-row">
            {[
              'React 19',
              'Vite',
              'TypeScript',
              'Jest',
              'ESLint',
              'Prettier',
              'GitHub Actions',
              'GCP Cloud Run',
              'Docker',
              'Artifact Registry',
            ].map(s => (
              <span key={s} className="stack-pill">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <div className="footer">Página temporal · Pipeline CI/CD — TC3005B GPO500 2026</div>
      </div>
    </>
  )
}

export default App
