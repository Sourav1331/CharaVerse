import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Onboarding from './components/Onboarding'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import CreateCharacterPage from './pages/CreateCharacterPage'
import DiscoverPage from './pages/DiscoverPage'
import SettingsPage from './pages/SettingsPage'
import MyCharsPage from './pages/MyCharsPage'
import useStore from './lib/store'

export default function App() {
  const onboardingComplete = useStore(s => s.onboardingComplete)

  return (
    <>
      {!onboardingComplete && <Onboarding />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="chat/:characterId" element={<ChatPage />} />
          <Route path="create" element={<CreateCharacterPage />} />
          <Route path="my-characters" element={<MyCharsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  )
}
