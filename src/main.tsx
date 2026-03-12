import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { logger } from './lib/logger' // Ativa telemetria

// Inicializa telemetria
if (logger) console.log("Telemetria PythonQuest: Ativa");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
