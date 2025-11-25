'use client'

import { Navigation } from '@/components/Navigation'
import { RaceGame } from '@/pages/RaceGame'
import { useRouter } from 'next/navigation'

export default function RacePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black">
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
      <RaceGame />
    </div>
  )
}
