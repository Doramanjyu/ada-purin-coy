import React, { useRef, useEffect, useContext, useState } from 'react'

import lifeUrl from './life.png'

import GameOver, { preloads as preloadsGameOver } from './GameOver'
import Cleared, { preloads as preloadsCleared } from './Cleared'
import { StateContext, State, GwejState, PageState } from './state'
import { Polygon } from './math/polygon'
import { StageData, stages, dumpPurins } from './stages'

const nggakDuration = 300
const stageTransitionDuration = 300
const stageStartDelay = 400
const stageTitleDuration = 4000

enum GameState {
  Playing = 0,
  GameOver = 1,
  Cleared = 2,
}

class GameContext {
  readonly canvas: HTMLCanvasElement
  readonly cctx: CanvasRenderingContext2D
  readonly timer: ReturnType<typeof setInterval>
  readonly stageImage: HTMLImageElement
  readonly answerImage: HTMLImageElement
  readonly lifeImage: HTMLImageElement
  readonly wrongSound: HTMLAudioElement
  readonly boomSound: HTMLAudioElement
  readonly foundSound: HTMLAudioElement
  readonly debug: boolean
  readonly stage: StageData
  readonly deadline: number
  page?: State
  found: boolean[]
  finished: boolean
  life: number
  lastMouseDown: number
  selectedId: number

  onGameStateChange: (s: GameState) => void

  constructor(canvas: HTMLCanvasElement, stage: StageData) {
    this.canvas = canvas
    this.cctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.timer = setInterval(this.tick.bind(this), 1000)
    this.stage = stage
    this.found = new Array<boolean>(this.stage.purins.length).fill(false)
    this.deadline = Date.now() + stage.timeLimit
    this.finished = false
    this.life = stage.life
    this.lastMouseDown = 0
    this.onGameStateChange = () => {}
    this.selectedId = -1

    setTimeout(() => {
      if (!this.page) {
        throw new Error('updatePage must be called')
      }
      if (this.finished) {
        return
      }
      if (this.debug) {
        return
      }
      this.finished = true
      this.onGameStateChange(GameState.GameOver)
      this.render()
    }, stage.timeLimit)

    let loadedStage = false
    let loadedAnswer = false
    let loadedLife = false
    const loaded = () => {
      if (!loadedStage || !loadedAnswer || !loadedLife) {
        return
      }
      this.render()
      setTimeout(() => {
        canvas.style.opacity = '1'
        canvas.style.pointerEvents = 'auto'
      }, stageStartDelay)
    }

    this.stageImage = new Image()
    this.stageImage.src = stage.imageUrl
    this.stageImage.onload = () => {
      loadedStage = true
      loaded()
    }
    this.answerImage = new Image()
    this.answerImage.src = stage.answerUrl
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

    this.wrongSound = new Audio()
    this.wrongSound.src = 'sounds/beep.mp3'
    this.boomSound = new Audio()
    this.boomSound.src = 'sounds/boom.mp3'
    this.foundSound = new Audio()
    this.foundSound.src = 'sounds/found.mp3'

    const p = new URLSearchParams(window.location.search)
    this.debug = !!p.get('debug')
  }

  clean() {
    clearInterval(this.timer)
  }

  render() {
    if (!this.cctx || !this.stageImage) {
      return
    }
    this.cctx.globalAlpha = 1
    this.cctx.lineCap = 'round'
    this.cctx.lineJoin = 'round'
    this.cctx.drawImage(this.stageImage, 0, 0)

    if (this.debug) {
      this.cctx.save()
      this.cctx.globalAlpha = 0.5
      this.cctx.strokeStyle = 'red'
      this.stage.purins.forEach((purin, id) => {
        this.cctx.lineWidth = this.selectedId === id ? 8 : 3
        this.cctx.beginPath()
        purin.draw(this.cctx)
        this.cctx.closePath()
        this.cctx.stroke()
      })
      this.cctx.restore()
    }
    this.stage.purins.forEach((purin, i) => {
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
              Math.min(1, (this.deadline - Date.now()) / this.stage.timeLimit),
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
    if (e.button !== 0) {
      return
    }
    if (!this.page) {
      return
    }
    if (this.finished) {
      return
    }
    const now = Date.now()
    if (this.lastMouseDown + nggakDuration > now) {
      return
    }
    this.lastMouseDown = now

    const rect = this.canvas.getBoundingClientRect()
    const p = [
      Math.round((this.canvas.width * (e.clientX - rect.x)) / rect.width),
      Math.round((this.canvas.height * (e.clientY - rect.y)) / rect.height),
    ]

    if (this.debug && e.ctrlKey) {
      if (this.selectedId < 0) {
        this.stage.purins.push(new Polygon([p]))
        this.selectedId = this.stage.purins.length - 1
        this.render()
        return
      }
      this.stage.purins[this.selectedId].points.push(p)
      this.render()
      return
    }

    const found = this.stage.purins.findIndex((purin) => purin.isInside(p))
    if (this.debug) {
      this.selectedId = found
      this.render()
      return
    }
    if (found == -1) {
      this.life--
      this.wrongSound.currentTime = 0
      this.wrongSound.play()
      if (this.life <= 0) {
        this.boomSound.currentTime = 0
        this.boomSound.play()
        this.finished = true
        this.onGameStateChange(GameState.GameOver)
        this.render()
        return
      }

      this.page.setGwej(GwejState.Nggak)
      setTimeout(() => {
        if (!this.page || this.finished) {
          return
        }
        this.page.setGwej(GwejState.None)
      }, nggakDuration)

      this.render()
    } else if (!this.found[found]) {
      this.found[found] = true

      this.foundSound.currentTime = 0
      this.foundSound.play()

      this.page.setGwej(p[0] < 960 ? GwejState.Right : GwejState.Left)
      setTimeout(() => {
        if (!this.page || this.finished) {
          return
        }
        this.page.setGwej(GwejState.None)
      }, 400)

      this.render()

      if (this.found.every((b) => b)) {
        this.finished = true
        this.onGameStateChange(GameState.Cleared)
        this.render()
      }
    }
  }

  onKeyDown(e: React.KeyboardEvent) {
    const filterAndDump = () => {
      this.selectedId = -1
      this.stage.purins = this.stage.purins.filter(
        (purin) => purin.points.length > 2,
      )
      console.log(dumpPurins(this.stage.purins))
    }
    switch (e.code) {
      case 'Escape':
        this.page?.setPage(PageState.Title)
        this.page?.setGwej(GwejState.None)
        if (this.debug) {
          filterAndDump()
        }
        return
      case 'Enter':
        if (this.debug) {
          filterAndDump()
        }
        return
      case 'Delete':
        if (this.selectedId >= 0) {
          this.stage.purins.splice(this.selectedId, 1)
          this.selectedId = -1
          this.render()
        }
        return
    }
  }
}

const Game = () => {
  const page = useContext(StateContext)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageInfoRef = useRef<HTMLDivElement>(null)
  const gctx = useRef<GameContext>(null)
  const [gameState, setGameState] = useState(GameState.Playing)
  const [stageId, setStageId] = useState(page.stageId)

  const hideStageInfo = () => {
    if (stageInfoRef.current) {
      stageInfoRef.current.style.bottom = '-12%'
    }
  }
  useEffect(() => {
    const nextStageId = page.stageId
    if (canvasRef.current) {
      canvasRef.current.style.opacity = '0'
    }
    setTimeout(() => {
      if (stageInfoRef.current) {
        stageInfoRef.current.style.bottom = '0'
      }
    }, 50)
    setTimeout(hideStageInfo, stageTitleDuration)
    setTimeout(() => setStageId(nextStageId), stageTransitionDuration)
  }, [page.stageId])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    setGameState(GameState.Playing)
    if (page) {
      page.setGwej(GwejState.None)
    }
    canvasRef.current.tabIndex = 1000
    gctx.current = new GameContext(canvasRef.current, stages[stageId])
    gctx.current.page = page
    gctx.current.onGameStateChange = setGameState
    canvasRef.current.style.opacity = '0'

    return () => {
      if (gctx.current) {
        gctx.current.clean()
      }
    }
  }, [canvasRef, stageId])

  useEffect(() => {
    if (!gctx.current) {
      return
    }
    gctx.current.page = page
  }, [page])

  useEffect(() => {
    if (!gctx.current) {
      return
    }
    gctx.current.onGameStateChange = setGameState
  }, [setGameState])

  const onMouseDown = (e: React.MouseEvent) => {
    gctx.current?.onMouseDown(e)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    gctx.current?.onKeyDown(e)
  }

  return (
    <>
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
          transitionDuration: `${stageTransitionDuration / 1000}s`,
          pointerEvents: 'none',
          outline: 'none',
        }}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
      ></canvas>
      <div ref={stageInfoRef} className="stageInfo" onClick={hideStageInfo}>
        <div className="stageInfoText">
          {`stage ${stageId} - `}
          <span className="stageTitle">{`${stages[stageId].name}`}</span>
          {` (${stages[stageId].timeLimit / 1000}s)`}
        </div>
      </div>
      {gameState === GameState.GameOver && <GameOver />}
      {gameState === GameState.Cleared && <Cleared />}
    </>
  )
}

export default Game
export const preloads: string[] = [
  lifeUrl,
  ...preloadsGameOver,
  ...preloadsCleared,
]
