import { useState, useRef } from 'react'
import { AREAS } from './data/areas.js'
import { fetchAffirmations } from './utils/affirmations.js'
import { fetchStockPhoto } from './utils/pexels.js'
import Landing from './components/screens/Landing.jsx'
import IntentionSetting from './components/screens/IntentionSetting.jsx'
import AreaPrompt from './components/screens/AreaPrompt.jsx'
import BoardReveal from './components/screens/BoardReveal.jsx'
import AffirmationReview from './components/screens/AffirmationReview.jsx'
import MoodSelection from './components/screens/MoodSelection.jsx'
import BreathScreen from './components/screens/BreathScreen.jsx'
import Playback from './components/screens/Playback.jsx'
import Download from './components/screens/Download.jsx'
import DevShortcut from './components/DevShortcut.jsx'

const Grain = ({ opacity = 0.07 }) => (
  <div aria-hidden="true" style={{
    position: 'fixed', inset: 0,
    backgroundImage: "url('/textures/grain.png')",
    mixBlendMode: 'multiply', opacity,
    pointerEvents: 'none', zIndex: 9999,
  }} />
)

const initialState = {
  currentScreen: 'landing',
  userName: '',
  intention: '',
  areas: AREAS.map(a => ({
    ...a,
    photos: [],
    skipped: false,
    affirmation: '',
    stockPhoto: null,
  })),
  selectedMood: null,
  selectedTrack: null,
  videoMode: 'immersive',
}

export default function App() {
  const [state, setState] = useState(initialState)
  // Holds the in-flight affirmation/stock-photo fetch so it runs during mood + breath
  const buildPromiseRef = useRef(null)

  const navigate = (screen) =>
    setState(s => ({ ...s, currentScreen: screen }))

  const updateArea = (index, patch) =>
    setState(s => ({
      ...s,
      areas: s.areas.map((a, i) => i === index ? { ...a, ...patch } : a),
    }))

  // Kick off the AI fetch immediately, navigate to mood-selection — no loading screen.
  // By the time the user finishes mood selection + breath (~30s), the fetch is done.
  const handleBuild = (currentAreas) => {
    buildPromiseRef.current = Promise.all([
      fetchAffirmations(currentAreas, state.userName, state.intention),
      Promise.all(
        currentAreas.map(a =>
          a.skipped ? fetchStockPhoto(a.label) : Promise.resolve(null)
        )
      ),
    ])
    navigate('mood-selection')
  }

  // Called when breath screen ends. Awaits the build promise (should already be
  // resolved by now), applies results, then advances to affirmation-review.
  const handleBreathDone = async () => {
    if (!buildPromiseRef.current) {
      navigate('affirmation-review')
      return
    }
    try {
      const [affirmations, stockPhotos] = await buildPromiseRef.current
      buildPromiseRef.current = null
      setState(s => ({
        ...s,
        currentScreen: 'affirmation-review',
        areas: s.areas.map((a, i) => ({
          ...a,
          affirmation: affirmations[i] ?? '',
          stockPhoto: stockPhotos[i] ?? null,
        })),
      }))
    } catch (err) {
      console.error('Build failed:', err)
      buildPromiseRef.current = null
      navigate('board')
    }
  }

  const { currentScreen, userName, intention, areas } = state

  const areaMatch = currentScreen.match(/^area-(\d+)$/)
  const areaIndex = areaMatch ? parseInt(areaMatch[1]) : null

  const renderScreen = () => {
    if (currentScreen === 'landing') {
      return <Landing onBegin={() => navigate('intention')} />
    }

    if (currentScreen === 'intention') {
      return (
        <IntentionSetting
          userName={userName}
          intention={intention}
          onNext={(name, intent) => {
            setState(s => ({ ...s, userName: name, intention: intent }))
            navigate('area-0')
          }}
        />
      )
    }

    if (areaIndex !== null) {
      return (
        <AreaPrompt
          key={currentScreen}
          area={areas[areaIndex]}
          areaIndex={areaIndex}
          onNext={(photos) => {
            updateArea(areaIndex, { photos, skipped: false })
            navigate(areaIndex < 7 ? `area-${areaIndex + 1}` : 'board')
          }}
          onSkip={() => {
            updateArea(areaIndex, { photos: [], skipped: true })
            navigate(areaIndex < 7 ? `area-${areaIndex + 1}` : 'board')
          }}
        />
      )
    }

    if (currentScreen === 'board') {
      return (
        <BoardReveal
          areas={areas}
          intention={intention}
          onEdit={() => navigate('area-0')}
          onBuild={() => handleBuild(areas)}
        />
      )
    }

    if (currentScreen === 'mood-selection') {
      return (
        <MoodSelection
          onNext={(mood, track, videoMode) => {
            setState(s => ({
              ...s,
              currentScreen: 'breath',
              selectedMood: mood,
              selectedTrack: track,
              videoMode,
            }))
          }}
        />
      )
    }

    if (currentScreen === 'breath') {
      return <BreathScreen onDone={handleBreathDone} />
    }

    if (currentScreen === 'affirmation-review') {
      return (
        <AffirmationReview
          areas={areas}
          onNext={(updatedAffirmations) => {
            setState(s => ({
              ...s,
              currentScreen: 'playback',
              areas: s.areas.map((a, i) => ({ ...a, affirmation: updatedAffirmations[i] })),
            }))
          }}
        />
      )
    }

    if (currentScreen === 'playback') {
      return (
        <Playback
          areas={areas}
          videoMode={state.videoMode}
          onSwap={() => navigate('affirmation-review')}
          onChangeTrack={() => navigate('mood-selection')}
          onSave={() => navigate('download')}
          onUpdateAreas={(updatedAreas) => setState(s => ({ ...s, areas: updatedAreas }))}
        />
      )
    }

    if (currentScreen === 'download') {
      return (
        <Download
          areas={areas}
          selectedTrack={state.selectedTrack}
          videoMode={state.videoMode}
          userName={userName}
        />
      )
    }

    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'var(--font-ui)',
        color: 'var(--blush)', fontSize: '14px',
      }}>
        {currentScreen} — coming soon
      </div>
    )
  }

  return (
    <>
      <Grain opacity={currentScreen === 'breath' ? 0.04 : 0.07} />
      <div className="screen-fade" key={currentScreen}>
        {renderScreen()}
      </div>
      <DevShortcut onJump={(devState) => setState(devState)} />
    </>
  )
}
