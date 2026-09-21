import React from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './styles.css'

// Installs the service worker so the game opens offline and can be added to
// a phone's home screen. `immediate` means a new deploy takes effect on the
// next load rather than waiting for every tab to close.
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
