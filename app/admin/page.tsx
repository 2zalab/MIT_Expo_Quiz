'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AuthGate from '../components/AuthGate'

export default function Admin() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('score', { ascending: false })
      .limit(100)
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function reset() {
    if (confirm('Effacer tous les scores ?')) {
      const { error } = await supabase
        .from('players')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) {
        console.error('Erreur réinitialisation:', error)
        alert(`Impossible de réinitialiser les scores : ${error.message}`)
        return
      }

      load()
    }
  }

  return (
    <AuthGate>
      <main>
      <div className="card">
        <div className="row-between" style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>⚙️ Admin</h1>
          <span className="badge">{rows.length} joueur{rows.length > 1 ? 's' : ''}</span>
        </div>

        <button className="primary" onClick={reset} style={{ marginBottom: 20 }}>
          🗑️ Réinitialiser les scores
        </button>

        {loading && <p className="muted center">Chargement...</p>}

        {!loading && rows.length === 0 && (
          <p className="empty">Aucun joueur pour le moment.</p>
        )}

        {rows.map((r, i) => (
          <div className="leader" key={r.id}>
            <span className="leader-name">
              <span className={`rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}`}>
                {i + 1}
              </span>
              {r.player_name}
            </span>
            <b className="leader-score">{r.score}</b>
          </div>
        ))}
      </div>
      </main>
    </AuthGate>
  )
}
