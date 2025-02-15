import React, { useRef, useEffect, useContext } from 'react'

import lifeUrl from './life.png'

import { StateContext, State, GwejState, PageState } from './state'
import { Polygon } from './polygon'
import { GameData, gameData1 } from './gameData'

class GameContext {
  readonly canvas: HTMLCanvasElement
  readonly cctx: CanvasRenderingContext2D
  readonly timer: ReturnType<typeof setInterval>
  readonly stageImage: HTMLImageElement
  readonly answerImage: HTMLImageElement
  readonly lifeImage: HTMLImageElement
  readonly debug: boolean
  readonly gameData: GameData
  readonly deadline: number
  page?: State
  found: boolean[]
  finished: boolean
  life: number

  constructor(canvas: HTMLCanvasElement, gameData: GameData) {
    this.canvas = canvas
    this.cctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.timer = setInterval(this.tick.bind(this), 1000)
    this.gameData = gameData
    this.found = new Array<boolean>(this.gameData.purins.length).fill(false)
    this.deadline = Date.now() + gameData.timeLimit
    this.finished = false
    this.life = gameData.life

    setTimeout(() => {
      if (!this.page) {
        throw new Error('updatePage must be called')
      }
      if (this.finished) {
        return
      }
      this.finished = true
      this.page.setPage(PageState.GameOver)
    }, gameData.timeLimit)

    let loadedStage = false
    let loadedAnswer = false
    let loadedLife = false
    const loaded = () => {
      if (!loadedStage || !loadedAnswer || !loadedLife) {
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
    this.lifeImage = new Image()
    this.lifeImage.src = lifeUrl
    this.lifeImage.onload = () => {
      loadedLife = true
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
      this.cctx.save()
      this.cctx.globalAlpha = 0.5
      this.cctx.lineWidth = 3
      this.cctx.strokeStyle = 'red'
      this.gameData.purins.forEach((purin) => {
        this.cctx.beginPath()
        purin.draw(this.cctx)
        this.cctx.closePath()
        this.cctx.stroke()
      })
      this.cctx.restore()
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

    if (!this.finished) {
      const tRemainRatio =
        Math.round(
          100 *
            Math.max(
              0,
              Math.min(
                1,
                (this.deadline - Date.now()) / this.gameData.timeLimit,
              ),
            ),
        ) / 100
      this.cctx.save()
      this.cctx.globalAlpha = 0.25
      this.cctx.fillStyle = 'red'
      this.cctx.fillRect(0, 1060, 1920 * tRemainRatio, 10)
      this.cctx.restore()

      for (let i = 0; i < this.life; i++) {
        this.cctx.drawImage(this.lifeImage, i * 56, 1030)
      }
    }
  }

  tick() {
    if (!this.page) {
      return
    }
    this.render()
  }

  onMouseDown(e: React.MouseEvent) {
    if (!this.page) {
      return
    }
    if (this.finished) {
      return
    }
    console.log(
      this.canvas.width,
      e.clientX,
      this.canvas.offsetLeft,
      this.canvas.clientWidth,
    )
    const rect = this.canvas.getBoundingClientRect()
    const p = [
      Math.round((this.canvas.width * (e.clientX - rect.x)) / rect.width),
      Math.round((this.canvas.height * (e.clientY - rect.y)) / rect.height),
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
        console.info(last.points)
      }
      return
    }

    const found = this.gameData.purins.findIndex((purin) => purin.isInside(p))
    if (found == -1) {
      this.life--
      if (this.life <= 0) {
        this.finished = true
        this.page.setPage(PageState.GameOver)
      }
      this.render()
    } else if (!this.found[found]) {
      console.debug('found', found)
      this.found[found] = true

      this.page.setGwej(p[0] < 960 ? GwejState.Right : GwejState.Left)
      setTimeout(() => {
        if (!this.page) {
          return
        }
        this.page.setGwej(GwejState.None)
      }, 400)

      this.render()

      if (this.found.every((b) => b)) {
        this.finished = true
        this.page.setPage(PageState.GameClear)
      }
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
        position: 'absolute',
        inset: 0,
        opacity: 0,
        width: '100%',
        transitionProperty: 'opacity',
        transitionDuration: '0.5s',
        pointerEvents: 'none',
      }}
      onMouseDown={onMouseDown}
    ></canvas>
  )
}

export default Game
export const preloads: string[] = [lifeUrl]
