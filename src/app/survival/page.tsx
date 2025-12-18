'use client'

import { Navigation } from '@/components/Navigation'
import { SurvivalGame } from '@/components/pages/SurvivalGame'
import { useRouter } from 'next/navigation'

export default function SurvivalPage() {
  const router = useRouter()

  return (
    <>
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
    </>
  )
}
