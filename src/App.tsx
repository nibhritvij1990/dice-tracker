import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './screens/Splash.tsx'
import Home from './screens/Home.tsx'
import Tracker from './screens/Tracker.tsx'
import Profile from './screens/Profile.tsx'
import Start from './screens/Start.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" replace />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/start" element={<Start />} />
    </Routes>
  )
}

export default App
