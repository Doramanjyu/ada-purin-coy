import React, { useRef, useEffect, useContext } from 'react'

import { StateContext, State } from './state'
import { Polygon } from './polygon'
import { GameData, gameData1 } from './gameData'

class GameContext {
  readonly canvas: HTMLCanvasElement
  readonly cctx: CanvasRenderingContext2D
  readonly timer: ReturnType<typeof setInterval>
  readonly stageImage: HTMLImageElement
  readonly answerImage: HTMLImageElement
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

    let loadedStage = false
    let loadedAnswer = false
    const loaded = () => {
      if (!loadedStage || !loadedAnswer) {
        return
      }
      this.render()
      canvas.style.opacity = '1'
      canvas.style.pointerEvents = 'auto'
    }

    this.stageImage = new Image()
    this.stageImage.src = gameData.imageUrl
    this.stageImage.onload = () => {
      loadedStage = true
      loaded()
    }
    this.answerImage = new Image()
    this.answerImage.src = gameData.answerUrl
    this.answerImage.onload = () => {
      loadedAnswer = true
      loaded()
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
      this.gameData.purins.forEach((purin) => {
        this.cctx.beginPath()
        purin.draw(this.cctx)
        this.cctx.closePath()
        this.cctx.stroke()
      })
    }
    this.gameData.purins.forEach((purin, i) => {
      if (!this.found[i]) {
        return
      }
      this.cctx.beginPath()
      purin.draw(this.cctx)
      this.cctx.closePath()
      this.cctx.save()
      this.cctx.clip()
      this.cctx.drawImage(this.answerImage, 0, 0)
      this.cctx.restore()
    })
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
