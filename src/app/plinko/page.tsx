'use client'

import { Navigation } from '@/components/Navigation'
import { PlinkoGame } from '@/components/pages/PlinkoGame'
import { useRouter } from 'next/navigation'

export default function PlinkoPage() {
  const router = useRouter()

  return (
    <>
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
    </>
  )
}
