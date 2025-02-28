import React, { useContext } from 'react'

import gameoverUrl from './gameover.png'

import { StateContext, PageState, AudioNodes } from './state'
import { useClickGuard } from './clickGuard'

const GameOver = () => {
  const ctx = useContext(StateContext)
  const guard = useClickGuard(1000)

  const onClick = () => {
    if (!guard) {
      return
    }
    ctx.setPage(PageState.Title)
  }

  const onLoad = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setTimeout(() => (target.style.opacity = '1'), 100)
    ctx.audioFilterer((actx: AudioContext, nodes: AudioNodes) => {
      const t = actx.currentTime + 0.05
      nodes.filter.Q.setValueAtTime(2.0, t)
      nodes.filter.frequency.setValueAtTime(700, t)
      nodes.filter.type = 'highpass'
      nodes.gain.gain.setValueAtTime(1.8, t)
    })
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
