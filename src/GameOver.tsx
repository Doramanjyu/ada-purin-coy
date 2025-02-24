import React, { useContext } from 'react'

import gameoverUrl from './gameover.png'

import { StateContext, PageState, AudioNodes } from './state'

const GameOver = () => {
  const ctx = useContext(StateContext)
  const onClick = () => {
    ctx.setPage(PageState.Title)
    ctx.audioFilterer((actx: AudioContext, nodes: AudioNodes) => {
      const t = actx.currentTime + 0.05
      nodes.gain.gain.setValueAtTime(0.5, t)
      nodes.filter.type = 'allpass'
    })
  }
  const onLoad = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setTimeout(() => (target.style.opacity = '1'), 100)
    ctx.audioFilterer((actx: AudioContext, nodes: AudioNodes) => {
      const t = actx.currentTime + 0.05
      nodes.filter.frequency.setValueAtTime(400, t)
      nodes.gain.gain.setValueAtTime(1.0, t)
      nodes.filter.type = 'highpass'
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
