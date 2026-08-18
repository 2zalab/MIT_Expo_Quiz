'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AuthGate from '../components/AuthGate'

type P = { id: string; player_name: string; score: number; status: string }

const medals = ['🥇', '🥈', '🥉']

export default function Live() {
  const [rows, setRows] = useState<P[]>([])

  async function load() {
    const { data } = await supabase
      .from('players')
      .select('id,player_name,score,status')
      .order('score', { ascending: false })
      .limit(20)
    setRows(data || [])
  }

  useEffect(() => {
    load()
    const ch = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, load)
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [])

  return (
    <AuthGate>
      <main>
        <div className="card">
          <div className="row-between" style={{ marginBottom: 20 }}>
            <h1 style={{ margin: 0 }}>🏆 Classement en direct</h1>
            <span className="badge">● en direct</span>
          </div>

          {rows.length === 0 && <p className="empty">En attente des premiers joueurs...</p>}

          {rows.map((p, i) => (
            <div className="leader" key={p.id}>
              <span className="leader-name">
                <span className={`rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}`}>
                  {i < 3 ? medals[i] : i + 1}
                </span>
                {p.player_name}
              </span>
              <strong className="leader-score">{p.score} pts</strong>
            </div>
          ))}
        </div>
      </main>
    </AuthGate>
  )
}
