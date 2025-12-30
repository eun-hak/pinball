'use client'

import { Navigation } from '@/components/Navigation'
import { RaceGame } from '@/components/pages/RaceGame'
import { GameInfoSection } from '@/components/game/GameInfoSection'
import { gameContents } from '@/data/game-content'
import { Footer } from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function RacePage() {
  const router = useRouter()
  const content = gameContents['race']

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation 
        currentGame="race" 
        onGameChange={(game) => {
          if (game === 'home') {
            router.push('/')
          } else {
            router.push(`/${game}`)
          }
        }} 
      />
      <div className="flex-1">
        <RaceGame />
      </div>
      <GameInfoSection content={content} />
      <Footer />
    </div>
  )
}
