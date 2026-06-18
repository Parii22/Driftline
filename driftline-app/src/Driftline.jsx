import React, { useState, createContext } from 'react'
import Landing from './components/Landing'
import Mapper from './components/Mapper'

// ModeContext provides the current UI mode and a setter so child components can switch views
export const ModeContext = createContext({ mode: 'landing', setMode: () => {} });

export default function Driftline({ initialMode = 'landing' }){
  const [mode, setMode] = useState(initialMode)
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {mode === 'landing' ? <Landing onLaunch={() => setMode('app')} /> : <Mapper onBack={() => setMode('landing')} />}
    </ModeContext.Provider>
  )
}
