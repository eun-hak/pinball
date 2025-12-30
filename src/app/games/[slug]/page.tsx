'use client'

import { useParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { PlinkoGame } from '@/components/pages/PlinkoGame'
import { RaceGame } from '@/components/pages/RaceGame'
import { SurvivalGame } from '@/components/pages/SurvivalGame'
import { ColorGame } from '@/components/pages/ColorGame'
import { GameInfoSection } from '@/components/game/GameInfoSection'
import { gameContents } from '@/data/game-content'
import { Footer } from '@/components/layout/Footer'
import { useEffect } from 'react'

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // 슬러그에 해당하는 게임 데이터 가져오기
  const content = gameContents[slug]

  // 유효하지 않은 슬러그 처리
  useEffect(() => {
    if (!content) {
      router.replace('/games')
    }
  }, [content, router])

  if (!content) return null

  // 게임 컴포넌트 매핑
  const renderGame = () => {
    switch (slug) {
      case 'plinko':
        return <PlinkoGame />
      case 'race':
        return <RaceGame />
      case 'survival':
        return <SurvivalGame />
      case 'color':
        return <ColorGame />
      default:
        return <div>Game Not Found</div>
    }
  }

  // Navigation 상태 매핑
  const getNavGame = () => {
    if (['plinko', 'race', 'survival', 'color'].includes(slug)) {
      return slug as 'plinko' | 'race' | 'survival' | 'color'
    }
    return 'home'
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation 
        currentGame={getNavGame()} 
        onGameChange={(game) => {
          if (game === 'home') router.push('/')
          else router.push(`/games/${game}`)
        }} 
      />
      
      {/* 게임 영역 */}
      <div className="flex-1">
        {renderGame()}
      </div>

      {/* 설명 및 SEO 텍스트 영역 (게임 아래에 배치) */}
      <GameInfoSection content={content} />

      <Footer />
    </div>
  )
}
