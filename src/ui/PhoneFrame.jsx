import { useEffect, useState } from 'react'
import { SignalIcon, WifiIcon, BatteryIcon } from './icons.jsx'

// Draws the phone-shaped column and the fake status bar at the top of it.
export default function PhoneFrame({ children }) {
  const [clock, setClock] = useState(currentTime)

  useEffect(() => {
    const t = setInterval(() => setClock(currentTime()), 20000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="stage">
      <div className="phone">
        <div className="status-bar">
          <span>{clock}</span>
          <span className="status-icons">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

function currentTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
