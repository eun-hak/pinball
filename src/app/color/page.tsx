'use client'

import { Navigation } from '@/components/Navigation'
import { ColorGame } from '@/components/pages/ColorGame'
import { GameInfoSection } from '@/components/game/GameInfoSection'
import { gameContents } from '@/data/game-content'
import { Footer } from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function ColorPage() {
  const router = useRouter()
  const content = gameContents['color']

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation 
        currentGame="color" 
        onGameChange={(game) => {
          if (game === 'home') {
            router.push('/')
          } else {
            router.push(`/${game}`)
          }
        }} 
      />
      <div className="flex-1">
        <ColorGame />
      </div>
      <GameInfoSection content={content} />
      <Footer />
    </div>
  )
}
