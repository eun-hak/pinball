'use client'

import { Navigation } from '@/components/Navigation'
import { Home } from '@/components/pages/Home'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleGameSelect = (game: 'plinko' | 'race' | 'survival' | 'color') => {
    router.push(`/${game}`)
  }

  return (
    <>
      {/* <div className="min-h-screen bg-black"> */}
      <Navigation currentGame="home" onGameChange={(game) => {
        if (game === 'home') {
          router.push('/')
        } else {
          router.push(`/${game}`)
        }
      }} />
      <Home onGameSelect={handleGameSelect} />
      {/* </div> */}
    </>
  )
}

