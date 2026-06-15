import React from 'react'
import { createRoot } from 'react-dom/client'
import Driftline from './Driftline'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Driftline />
  </React.StrictMode>
)
