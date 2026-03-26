'use client'

import { Navigation } from '@/components/Navigation'
import { ColorGame } from '@/components/pages/ColorGame'
import { useRouter } from 'next/navigation'

export default function ColorPage() {
  const router = useRouter()

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
    </div>
  )
}
