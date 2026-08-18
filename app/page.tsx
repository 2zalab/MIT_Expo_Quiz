'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

export default function Home() {
  const [showQr, setShowQr] = useState(false)

  const playUrl =
    (typeof window !== 'undefined' ? window.location.origin : '') + '/play/DEMO'

  if (showQr) {
    return (
      <main>
        <div className="card center">
          <div className="badge" style={{ marginBottom: 14 }}>✨ Expo Quiz</div>
          <h1>📱 Scannez pour jouer</h1>
          <p className="muted">
            Ouvrez l'appareil photo de votre téléphone et scannez ce QR code.
          </p>

          <div
            style={{
              background: '#fff',
              display: 'inline-block',
              padding: 16,
              borderRadius: 16,
              margin: '16px 0',
            }}
          >
            <QRCodeSVG value={playUrl} size={220} />
          </div>

          <p className="muted">{playUrl}</p>

          <button className="primary" onClick={() => setShowQr(false)}>
            ← Retour
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="card center">
        <div className="badge" style={{ marginBottom: 14 }}>✨ Expo Quiz</div>
        <h1>MIT Expo Quiz 🚀</h1>
        <p className="muted">
          Scannez le QR code pour jouer. Le classement se met à jour en temps réel.
        </p>

        <div className="nav-links">
          <button className="nav-link" onClick={() => setShowQr(true)}>
            <span>🎮 Jouer</span>
            <span className="arrow">→</span>
          </button>
          <Link className="nav-link" href="/live">
            <span>🏆 Écran classement</span>
            <span className="arrow">→</span>
          </Link>
          <Link className="nav-link" href="/admin">
            <span>⚙️ Admin</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
