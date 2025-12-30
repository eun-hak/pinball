'use client'

import { Navigation } from '@/components/Navigation'
import { SurvivalGame } from '@/components/pages/SurvivalGame'
import { GameInfoSection } from '@/components/game/GameInfoSection'
import { gameContents } from '@/data/game-content'
import { Footer } from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function SurvivalPage() {
  const router = useRouter()
  const content = gameContents['survival']

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation 
        currentGame="survival" 
        onGameChange={(game) => {
          if (game === 'home') {
            router.push('/')
          } else {
            router.push(`/${game}`)
          }
        }} 
      />
      <div className="flex-1">
        <SurvivalGame />
      </div>
      <GameInfoSection content={content} />
      <Footer />
    </div>
  )
}
