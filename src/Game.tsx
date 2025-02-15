import React, { useRef, useEffect, useContext } from 'react'

import { StateContext, State } from './state'
import { Polygon } from './polygon'
import { GameData, gameData1 } from './gameData'

class GameContext {
  readonly canvas: HTMLCanvasElement
  readonly cctx: CanvasRenderingContext2D
  readonly timer: ReturnType<typeof setInterval>
  readonly stageImage: HTMLImageElement
  readonly debug: boolean
  readonly gameData: GameData
  page?: State
  found: boolean[]

  constructor(canvas: HTMLCanvasElement, gameData: GameData) {
    this.canvas = canvas
    this.cctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.timer = setInterval(this.tick.bind(this), 500)
    this.gameData = gameData
    this.found = new Array<boolean>(this.gameData.purins.length).fill(false)

    this.stageImage = new Image()
    this.stageImage.src = gameData.imageUrl
    this.stageImage.onload = () => {
      this.render()
      canvas.style.opacity = '1'
      canvas.style.pointerEvents = 'auto'
    }

    const p = new URLSearchParams(window.location.search)
    this.debug = !!p.get('debug')
  }

  clean() {
    clearInterval(this.timer)
  }

  updatePage(p: State) {
    this.page = p
  }

  render() {
    if (!this.cctx || !this.stageImage) {
      return
    }
    this.cctx.globalAlpha = 1
    this.cctx.drawImage(this.stageImage, 0, 0)

    if (this.debug) {
      this.cctx.globalAlpha = 0.5
      this.cctx.lineWidth = 3
      this.cctx.strokeStyle = 'red'
      this.gameData.purins.forEach((poly) => {
        this.cctx.beginPath()
        poly.points.forEach((p) => {
          this.cctx.lineTo(p[0], p[1])
        })
        this.cctx.closePath()
        this.cctx.stroke()
      })
    }
  }

  tick() {
    this.render()
  }

  onMouseDown(e: React.MouseEvent) {
    if (!this.page) {
      return
    }
    const p = [
      Math.round(
        (this.canvas.width * (e.clientX - this.canvas.offsetLeft)) /
          this.canvas.offsetWidth,
      ),
      Math.round(
        (this.canvas.height * (e.clientY - this.canvas.offsetTop)) /
          this.canvas.offsetHeight,
      ),
    ]
    console.debug('mouse down', p)

    if (this.debug && e.ctrlKey) {
      if (e.shiftKey) {
        this.gameData.purins.push(new Polygon([p]))
        return
      }
      const last = this.gameData.purins.at(-1)
      if (last) {
        last.points.push(p)
        console.debug(last.points)
      }
      return
    }

    const found = this.gameData.purins.findIndex((purin) => purin.isInside(p))
    if (found != -1 && !this.found[found]) {
      console.debug(found)
      this.found[found] = true

      this.page.setGwej(true)
      setTimeout(() => {
        if (!this.page) {
          return
        }
        this.page.setGwej(false)
      }, 200)
    }
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

    gctx.current = new GameContext(canvasRef.current, gameData1)

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

  const onMouseDown = (e: React.MouseEvent) => {
    if (!gctx.current) {
      return
    }
    gctx.current.onMouseDown(e)
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
