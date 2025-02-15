import React, { useRef, useEffect, useContext } from 'react'

import gameUrl from './adapurincoy1.png'

import { StateContext, State } from './state'

class GameContext {
  readonly cctx: CanvasRenderingContext2D
  readonly timer: ReturnType<typeof setInterval>
  readonly stageImage: HTMLImageElement
  page?: State

  constructor(canvas: HTMLCanvasElement) {
    this.cctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.timer = setInterval(this.tick, 500)

    this.stageImage = new Image()
    this.stageImage.src = gameUrl
    this.stageImage.onload = () => {
      this.cctx.drawImage(this.stageImage, 0, 0)
      canvas.style.opacity = '1'
      canvas.style.pointerEvents = 'auto'
    }
  }

  clean() {
    clearInterval(this.timer)
  }

  updatePage(p: State) {
    this.page = p
  }

  tick() {
    console.log('tick')
  }

  onMouseDown() {
    if (!this.page) {
      return
    }

    this.page.setGwej(true)
    setTimeout(() => {
      if (!this.page) {
        return
      }
      this.page.setGwej(false)
    }, 200)
  }
}

const Game = () => {
  const page = useContext(StateContext)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gctx = useRef<GameContext>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    gctx.current = new GameContext(canvasRef.current)

    return () => {
      if (gctx.current) {
        gctx.current.clean()
      }
    }
  }, [canvasRef])

  useEffect(() => {
    if (!gctx.current) {
      return
    }
    gctx.current.updatePage(page)
  }, [page])

  const onMouseDown = () => {
    if (!gctx.current) {
      return
    }
    gctx.current.onMouseDown()
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
        opacity: 0,
        transitionProperty: 'opacity',
        transitionDuration: '0.5s',
        pointerEvents: 'none',
      }}
      onMouseDown={onMouseDown}
    ></canvas>
  )
}

export default Game
