'use client'

import { Navigation } from '@/components/Navigation'
import { SurvivalGame } from '@/pages/SurvivalGame'
import { useRouter } from 'next/navigation'

export function SurvivalPageClient() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black">
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
      <SurvivalGame />
    </div>
  )
}

