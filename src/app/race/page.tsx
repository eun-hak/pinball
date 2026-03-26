'use client'

import { Navigation } from '@/components/Navigation'
import { RaceGame } from '@/components/pages/RaceGame'
import { useRouter } from 'next/navigation'

export default function RacePage() {
  const router = useRouter()

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
    </div>
  )
}
