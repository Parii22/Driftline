import React from 'react'
import { createRoot } from 'react-dom/client'
import Driftline from './Driftline'
import './css/global.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Driftline />
  </React.StrictMode>
)
