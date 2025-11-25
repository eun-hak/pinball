'use client'

import { Navigation } from '@/components/Navigation'
import { PlinkoGame } from '@/pages/PlinkoGame'
import { useRouter } from 'next/navigation'

export function PlinkoPageClient() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black">
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
      <PlinkoGame />
    </div>
  )
}

