import React, { useContext } from 'react'

import gameoverUrl from './gameover.png'

import { StateContext, PageState } from './state'

const GameOver = () => {
  const ctx = useContext(StateContext)
  const onClick = () => ctx.setPage(PageState.Title)
  const onLoad = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setTimeout(() => (target.style.opacity = '1'), 100)
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#85b09d',
        opacity: 0,
        transitionProperty: 'opacity',
        transitionDuration: '1s',
      }}
      onClick={onClick}
      onLoad={onLoad}
    >
      <img
        src={gameoverUrl}
        style={{
          width: '100%',
          position: 'absolute',
          top: '20%',
        }}
        className="titleAnime"
      />
    </div>
  )
}

export default GameOver
export const preloads: string[] = [gameoverUrl]
