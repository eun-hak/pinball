'use client'

import { Navigation } from '@/components/Navigation'
import { PlinkoGame } from '@/components/pages/PlinkoGame'
import { GameInfoSection } from '@/components/game/GameInfoSection'
import { gameContents } from '@/data/game-content'
import { Footer } from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function PlinkoPage() {
  const router = useRouter()
  const content = gameContents['plinko']

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation 
        currentGame="plinko" 
        onGameChange={(game) => {
          if (game === 'home') {
            router.push('/')
          } else {
            router.push(`/${game}`)
          }
        }} 
      />
      <div className="flex-1">
        <PlinkoGame />
      </div>
      <GameInfoSection content={content} />
      <Footer />
    </div>
  )
}
