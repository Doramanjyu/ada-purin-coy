import React, { useRef, useEffect, useContext } from 'react'

import gameUrl from './adapurincoy1.png'

import { StateContext } from './state'

const Game = () => {
  const ctx = useContext(StateContext)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef) {
      return
    }

    let tick = 0
    const timer = setInterval(() => {
      tick++
      console.log(tick)
    }, 1000)

    const cctx = canvasRef.current.getContext('2d')
    const stageImage = new Image()
    stageImage.src = gameUrl
    stageImage.onload = () => {
      cctx.drawImage(stageImage, 0, 0)
    }

    return () => {
      clearInterval(timer)
    }
  }, [canvasRef])

  const onMouseDown = () => {
    ctx.setGwej(true)
    setTimeout(() => {
      ctx.setGwej(false)
    }, 200)
  }

  return (
    <canvas
      width="1920"
      height="1080"
      ref={canvasRef}
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '16 / 9',
        objectFit: 'contain',
      }}
      onMouseDown={onMouseDown}
    ></canvas>
  )
}

export default Game
