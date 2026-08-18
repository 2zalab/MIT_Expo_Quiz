'use client'

import { useEffect, useState } from 'react'

const LOGIN = 'MIT'
const PASSWORD = 'MITQUIZ2026'
const STORAGE_KEY = 'mit_quiz_staff_auth'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem(STORAGE_KEY) === 'true')
    setChecked(true)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (login.trim() === LOGIN && password === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setAuthenticated(true)
      setError('')
    } else {
      setError('Identifiants incorrects.')
    }
  }

  // Évite un flash du formulaire de connexion pendant la lecture du sessionStorage
  if (!checked) {
    return null
  }

  if (!authenticated) {
    return (
      <main>
        <div className="card center">
          <div className="badge" style={{ marginBottom: 14 }}>🔒 Accès restreint</div>
          <h1>Connexion requise</h1>
          <p className="muted">Cette page est réservée à l'équipe MIT.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="muted" style={{ color: 'var(--danger)', marginTop: -8 }}>
                {error}
              </p>
            )}

            <button className="primary" type="submit">
              Se connecter
            </button>
          </form>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
