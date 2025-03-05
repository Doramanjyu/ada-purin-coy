import React, { useRef, useEffect, useContext, useState } from 'react'

import lifeUrl from './life.png'

import GameOver, { preloads as preloadsGameOver } from './GameOver'
import Cleared, { preloads as preloadsCleared } from './Cleared'
import End, { preloads as preloadsEnd } from './End'
import Gwej, { preloads as preloadsGwej } from './Gwej'
import { StateContext, State, GwejState, PageState, AudioNodes } from './state'
import { Polygon } from './math/polygon'
import { StageData, stages, dumpPurins } from './stages'
import { isDebug } from './debug'

const nggakDuration = 300
const stageTransitionDuration = 300
const stageStartDelay = 400
const stageTitleDuration = 4000

enum GameState {
  Playing = 0,
  GameOver = 1,
  Cleared = 2,
  End = 3,
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
  selectedPoint?: { purinId: number; pointId: number }
  enabled: boolean

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
    this.enabled = false

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
    this.wrongSound.volume = 0.7
    this.boomSound = new Audio()
    this.boomSound.src = 'sounds/boom.mp3'
    this.boomSound.volume = 0.5
    this.foundSound = new Audio()
    this.foundSound.src = 'sounds/found.mp3'
    this.foundSound.volume = 0.7

    this.canvas.focus()
    this.debug = isDebug()
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
      this.cctx.drawImage(this.answerImage, 0, 0)
      this.stage.purins.forEach((purin, id) => {
        this.cctx.lineWidth = 3
        this.cctx.strokeStyle = 'red'
        if (this.selectedId === id) {
          this.cctx.lineWidth = 8
        }
        if (this.selectedPoint?.purinId === id) {
          this.cctx.lineWidth = 4
        }
        this.cctx.beginPath()
        purin.draw(this.cctx)
        this.cctx.closePath()
        this.cctx.stroke()
      })
      this.cctx.restore()
      if (this.selectedPoint) {
        const sp = this.selectedPoint
        const p = this.stage.purins[sp.purinId].points[sp.pointId]
        this.cctx.save()
        this.cctx.fillStyle = 'red'
        this.cctx.fillRect(p[0] - 4, p[1] - 4, 9, 9)
      }
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
    this.canvas.focus()
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
    if (!this.enabled) {
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
      if (this.selectedPoint) {
        this.stage.purins[this.selectedPoint.purinId].points.splice(
          this.selectedPoint.pointId + 1,
          0,
          p,
        )
        this.selectedPoint.pointId++
        this.render()
        return
      }
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

    if (this.debug) {
      this.selectedPoint = undefined
      this.stage.purins.forEach((purin, purinId) =>
        purin.points.forEach((pos, pointId) => {
          const d = [pos[0] - p[0], pos[1] - p[1]]
          if (Math.abs(d[0]) <= 4 && Math.abs(d[1]) <= 4) {
            this.selectedPoint = { purinId, pointId }
            console.log(this.selectedPoint)
          }
        }),
      )
      if (this.selectedPoint) {
        this.selectedId = -1
        this.render()
        return
      }
    }

    const tolerance = Math.min(20, (4 * this.canvas.width) / rect.width)
    const found = this.stage.purins.findIndex((purin) =>
      purin.isInside(p, tolerance),
    )
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

      if (this.found.every((b) => b)) {
        this.finished = true
        this.onGameStateChange(
          this.page.stageId >= stages.length - 1
            ? GameState.End
            : GameState.Cleared,
        )
        this.render()
        return
      }

      this.page.setGwej(p[0] < 960 ? GwejState.Right : GwejState.Left)
      setTimeout(() => {
        if (!this.page || this.finished) {
          return
        }
        this.page.setGwej(GwejState.None)
      }, 400)

      this.render()
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
    const moveSelected = (x: number, y: number) => {
      if (!this.debug) {
        return
      }
      if (e.shiftKey) {
        x *= 5
        y *= 5
      }
      const limitPoint = (p: number[]) => {
        if (p[0] < 0) p[0] = 0
        else if (p[0] >= 1920) p[0] = 1920
        if (p[1] < 0) p[1] = 0
        else if (p[1] > 1080) p[1] = 1080
      }
      if (this.selectedPoint) {
        const sp = this.selectedPoint
        const p = this.stage.purins[sp.purinId].points[sp.pointId]
        p[0] += x
        p[1] += y
        limitPoint(p)
        this.render()
        return
      }
      if (this.selectedId >= 0) {
        this.stage.purins[this.selectedId].points.forEach((p) => {
          p[0] += x
          p[1] += y
          limitPoint(p)
        })
        this.render()
        return
      }
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
      case 'ArrowUp':
        moveSelected(0, -1)
        return
      case 'ArrowDown':
        moveSelected(0, 1)
        return
      case 'ArrowLeft':
        moveSelected(-1, 0)
        return
      case 'ArrowRight':
        moveSelected(1, 0)
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
    if (canvasRef.current) {
      canvasRef.current.focus()
    }
  }
  useEffect(() => {
    const nextStageId = page.stageId
    if (canvasRef.current) {
      canvasRef.current.style.opacity = '0'
    }
    setTimeout(hideStageInfo, stageTitleDuration)
    setTimeout(() => setStageId(nextStageId), stageTransitionDuration)
  }, [page.stageId])

  useEffect(() => {
    if (stageInfoRef.current) {
      stageInfoRef.current.style.bottom = '0'
    }
  }, [stageId])

  useEffect(() => {
    page.audioFilterer((actx: AudioContext, nodes: AudioNodes) => {
      const t = actx.currentTime + 0.05
      nodes.filter.type = 'allpass'
      nodes.gain.gain.setValueAtTime(1.0, t)
    })

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

  const onTransitionEnd = () => {
    if (!gctx.current || !canvasRef.current) {
      return
    }
    if (canvasRef.current.style.opacity === '1') {
      gctx.current.enabled = true
    }
  }
  const onMouseDown = (e: React.MouseEvent) => {
    gctx.current?.onMouseDown(e)
    hideStageInfo()
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
        onTransitionEnd={onTransitionEnd}
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
      {gameState === GameState.End && <End />}
      <Gwej />
    </>
  )
}

export default Game
export const preloads: string[] = [
  lifeUrl,
  ...preloadsGameOver,
  ...preloadsCleared,
  ...preloadsEnd,
  ...preloadsGwej,
]
