'use client'

import { Navigation } from '@/components/Navigation'
import { RaceGame } from '@/components/pages/RaceGame'
import { useRouter } from 'next/navigation'

export default function RacePage() {
  const router = useRouter()

  return (
    <>
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
    </>
  )
}
