'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Question = {
  id: string
  category: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  answer_index: number
  points: number
  difficulty: string
}

type Player = {
  id: string
  player_name: string
  score: number
  questions_answered: number
  correct_answers: number
}

const CATEGORIES = [
  'MIT',
  'NDEMRI',
  'Malloum',
  'Intelligence artificielle',
  'Informatique générale',
  'Développement web & mobile',
  'Cybersécurité',
  'Culture numérique',
  'Innovation & entrepreneuriat au Cameroun',
  'Logique & culture générale',
]

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20]

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/*
 * Retire les questions au libellé identique (doublons possibles dans la banque de questions)
 */
function dedupeQuestions(items: Question[]): Question[] {
  const seen = new Set<string>()
  return items.filter((q) => {
    const key = q.question.trim().toLowerCase()
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

export default function Play({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = use(params)
  const router = useRouter()
  const [name, setName] = useState('')
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [category, setCategory] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const [playerId, setPlayerId] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerLocked, setAnswerLocked] = useState(false)
  const [optionOrder, setOptionOrder] = useState<number[]>([0, 1, 2, 3])

  /*
   * Mélange l'ordre d'affichage des 4 options (les données ont souvent la bonne réponse en position A)
   */
  function shuffleOptionOrder() {
    return shuffleArray([0, 1, 2, 3])
  }

  useEffect(() => {
    if (questions[currentIndex]) {
      setOptionOrder(shuffleOptionOrder())
    }
  }, [currentIndex, questions])

  /*
   * Récupération des questions aléatoires selon la catégorie et le nombre choisis
   */
  async function loadQuestions() {
    setLoadingQuestions(true)

    // Puise dans un pool plus large que demandé pour pouvoir écarter les doublons
    const poolSize = Math.min(questionCount * 4, 300)

    let { data, error } = await supabase.rpc(
      'get_random_questions',
      {
        question_limit: poolSize,
        category_filter: category || null,
      }
    )

    /*
     * Repli si la fonction Supabase n'a pas encore été mise à jour
     * avec le paramètre category_filter (ancienne signature) : on
     * interroge directement la table pour garantir le nombre demandé
     */
    if (error && /Could not find the function/i.test(error.message)) {
      console.warn(
        'Fonction get_random_questions sans category_filter, repli sur une requête directe.'
      )

      let query = supabase.from('questions').select('*')

      if (category) {
        query = query.eq('category', category)
      }

      const fallback = await query

      data = fallback.data
      error = fallback.error
    }

    setLoadingQuestions(false)

    if (error) {
      console.error('Erreur questions:', error)
      alert(
        `Impossible de récupérer les questions : ${error.message}`
      )
      return false
    }

    if (!data || data.length === 0) {
      alert('Aucune question disponible.')
      return false
    }

    const uniqueQuestions = shuffleArray(dedupeQuestions(data)).slice(0, questionCount)

    setQuestions(uniqueQuestions)
    return true
  }

  /*
   * Validation du nom, passe à l'étape de configuration
   */
  function confirmName() {
    if (!name.trim()) {
      alert('Veuillez entrer votre nom.')
      return
    }
    setNameSubmitted(true)
  }

  /*
   * Démarrage de la partie (nouveau joueur ou reprise du même joueur)
   */
  async function start() {
    setLoading(true)

    const questionsLoaded = await loadQuestions()

    if (!questionsLoaded) {
      setLoading(false)
      return
    }

    if (playerId) {
      const { error } = await supabase
        .from('players')
        .update({
          score: 0,
          questions_answered: 0,
          correct_answers: 0,
          status: 'playing',
          updated_at: new Date().toISOString(),
        })
        .eq('id', playerId)

      setLoading(false)

      if (error) {
        console.error('Erreur réinitialisation joueur:', error)
        alert(`Impossible de redémarrer la partie : ${error.message}`)
        return
      }

      setStarted(true)
      return
    }

    const { data, error } = await supabase
      .from('players')
      .insert({
        player_name: name.trim(),
        qr_code: code,
        score: 0,
        questions_answered: 0,
        correct_answers: 0,
        status: 'playing',
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      console.error('Erreur création joueur:', error)

      alert(
        `Impossible de créer le joueur : ${error.message}`
      )

      return
    }

    setPlayerId(data.id)
    setStarted(true)
  }

  /*
   * Rejouer avec le même profil : le score existant est remis à zéro
   */
  function replaySameUser() {
    if (
      confirm(
        `${name}, votre score sera réinitialisé à 0 pour cette nouvelle partie. Continuer ?`
      )
    ) {
      setDone(false)
      setStarted(false)
      setQuestions([])
      setCurrentIndex(0)
      setScore(0)
      setCorrectAnswers(0)
      setSelectedAnswer(null)
      setAnswerLocked(false)
    }
  }

  /*
   * Rejouer en tant que nouveau joueur : retour à la saisie du nom
   */
  function replayNewUser() {
    setDone(false)
    setStarted(false)
    setNameSubmitted(false)
    setName('')
    setPlayerId(null)
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setSelectedAnswer(null)
    setAnswerLocked(false)
  }

  /*
   * Abandon de la partie en cours
   */
  function quitGame() {
    if (confirm('Quitter le jeu ? Votre progression sera perdue.')) {
      router.push('/')
    }
  }

  /*
   * Réponse à une question
   */
  async function answer(answerIndex: number) {
    if (
      !playerId ||
      answerLocked ||
      !questions[currentIndex]
    ) {
      return
    }

    setAnswerLocked(true)
    setSelectedAnswer(answerIndex)

    const currentQuestion = questions[currentIndex]

    const isCorrect =
      answerIndex === currentQuestion.answer_index

    const newScore =
      score + (isCorrect ? currentQuestion.points : 0)

    const newCorrectAnswers =
      correctAnswers + (isCorrect ? 1 : 0)

    const newQuestionsAnswered =
      currentIndex + 1

    const isLastQuestion =
      newQuestionsAnswered >= questions.length

    /*
     * Mise à jour du joueur
     */
    const { error } = await supabase
      .from('players')
      .update({
        score: newScore,
        questions_answered: newQuestionsAnswered,
        correct_answers: newCorrectAnswers,
        status: isLastQuestion
          ? 'finished'
          : 'playing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', playerId)

    if (error) {
      console.error(
        'Erreur mise à jour score:',
        error
      )
    }

    setScore(newScore)
    setCorrectAnswers(newCorrectAnswers)

    /*
     * Petite pause avant la question suivante
     */
    setTimeout(() => {
      if (isLastQuestion) {
        setDone(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setAnswerLocked(false)
      }
    }, 700)
  }

  /*
   * Écran de démarrage : saisie du nom
   */
  if (!nameSubmitted) {
    return (
      <main>
        <div className="card center">
          <div className="badge" style={{ marginBottom: 14 }}>
            Stand {code}
          </div>

          <h1>🚀 MIT Expo Quiz</h1>

          <p className="muted">
            Bienvenue au jeu de Maroua Innovation
            Technology.
          </p>

          <input
            type="text"
            placeholder="Entrez votre nom"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmName()
              }
            }}
          />

          <button className="primary" onClick={confirmName}>
            Suivant →
          </button>
        </div>
      </main>
    )
  }

  /*
   * Écran de configuration : catégorie et nombre de questions
   */
  if (!started) {
    return (
      <main>
        <div className="card">
          <h1>Salut {name} 👋</h1>

          <p className="muted">
            Choisissez une catégorie et le nombre de questions.
          </p>

          <p className="muted" style={{ marginBottom: 8 }}>
            Catégorie
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            <button
              className={`option ${category === '' ? 'selected' : ''}`}
              style={{ width: 'auto', margin: 0 }}
              onClick={() => setCategory('')}
            >
              Toutes les catégories
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`option ${category === cat ? 'selected' : ''}`}
                style={{ width: 'auto', margin: 0 }}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="muted" style={{ marginBottom: 8 }}>
            Nombre de questions
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                className={`option ${questionCount === count ? 'selected' : ''}`}
                style={{ width: 'auto', margin: 0 }}
                onClick={() => setQuestionCount(count)}
              >
                {count}
              </button>
            ))}
          </div>

          <p className="muted" style={{ marginBottom: 8 }}>
            Ou choisissez vous-même le nombre de questions
          </p>

          <input
            type="number"
            min={1}
            max={50}
            value={questionCount}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              setQuestionCount(
                Number.isNaN(value) ? 1 : Math.min(50, Math.max(1, value))
              )
            }}
            style={{ marginBottom: 20 }}
          />

          <button
            className="primary"
            onClick={start}
            disabled={loading || loadingQuestions}
          >
            {loading || loadingQuestions
              ? 'Chargement...'
              : '🎮 Commencer le jeu'}
          </button>
        </div>
      </main>
    )
  }

  /*
   * Écran final
   */
  if (done) {
    return (
      <main>
        <div className="card center">
          <h1>
            🎉 Bravo {name} !
          </h1>

          <p className="muted">
            Vous avez terminé le quiz.
          </p>

          <div className="score">
            {score}
          </div>

          <p>
            <b>points</b>
          </p>

          <p>
            <span className="badge">
              ✅ {correctAnswers}/{questions.length} bonnes réponses
            </span>
          </p>

          <p className="muted">
            Votre score est maintenant affiché
            dans le classement.
          </p>

          <p className="muted" style={{ marginBottom: 8 }}>
            🔁 Rejouer en tant que :
          </p>

          <button className="primary" onClick={replaySameUser} style={{ marginBottom: 10 }}>
            {name} (score remis à 0)
          </button>

          <button className="primary" onClick={replayNewUser}>
            🆕 Nouveau joueur
          </button>
        </div>
      </main>
    )
  }

  /*
   * Sécurité
   */
  if (!questions[currentIndex]) {
    return (
      <main>
        <div className="card">
          <h2>Chargement de la question...</h2>
        </div>
      </main>
    )
  }

  const question =
    questions[currentIndex]

  const options = [
    question.option_a,
    question.option_b,
    question.option_c,
    question.option_d,
  ]

  /*
   * Interface du quiz
   */
  const progressPercent =
    ((currentIndex + (answerLocked ? 1 : 0)) / questions.length) * 100

  return (
    <main>
      <div className="card">

        <div className="row-between" style={{ marginBottom: '12px' }}>
          <button
            onClick={quitGame}
            style={{
              background: 'transparent',
              color: 'var(--muted)',
              padding: '6px 10px',
              margin: 0,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            ✕ Quitter
          </button>

          <span className="badge">{score} pts</span>
        </div>

        <div className="row-between" style={{ marginBottom: '12px' }}>
          <span className="muted">
            Question{' '}
            {currentIndex + 1}
            {' / '}
            {questions.length}
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="badge" style={{ marginBottom: '10px' }}>
          {question.category}
        </span>

        <h2>
          {question.question}
        </h2>

        <div>
          {optionOrder.map(
            (originalIndex, position) => {

              const option = options[originalIndex]

              const isCorrect =
                originalIndex ===
                question.answer_index

              const isSelected =
                selectedAnswer === originalIndex

              let stateClass = ''

              if (answerLocked) {
                if (isCorrect) {
                  stateClass = 'correct'
                } else if (isSelected) {
                  stateClass = 'incorrect'
                }
              }

              return (
                <button
                  key={originalIndex}
                  className={`option ${stateClass}`}
                  disabled={answerLocked}
                  onClick={() =>
                    answer(originalIndex)
                  }
                >
                  <span className="option-letter">
                    {String.fromCharCode(
                      65 + position
                    )}
                  </span>
                  {option}
                </button>
              )
            }
          )}
        </div>

      </div>
    </main>
  )
}