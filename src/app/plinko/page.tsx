'use client'

import { Navigation } from '@/components/Navigation'
import { PlinkoGame } from '@/components/pages/PlinkoGame'
import { useRouter } from 'next/navigation'

export default function PlinkoPage() {
  const router = useRouter()

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
    </div>
  )
}
