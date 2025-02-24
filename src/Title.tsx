import React, { useContext, useState, useEffect, useRef, useMemo } from 'react'

import titleUrl from './title.png'
import helpUrl from './help.png'
import fullscreenUrl from './fullscreen.png'

import { StateContext, PageState, AudioNodes } from './state'
import { stages } from './stages'
import { isDebug } from './debug'

const Title = () => {
  const ctx = useContext(StateContext)
  const onClick = () => ctx.setPage(PageState.Game)

  const helpModalRef = useRef<HTMLDivElement>(null)
  const [helpOpen, setHelpOpen] = useState(!ctx.helpShown)
  const openHelp = (e: React.MouseEvent) => {
    setHelpOpen(true)
    e.stopPropagation()
  }
  const closeHelp = (e: React.MouseEvent) => {
    if (!helpModalRef.current) {
      return
    }
    ctx.audioFilterer((actx: AudioContext) => {
      actx.resume()
    })
    helpModalRef.current.style.inset = '50% 10%'
    setTimeout(() => setHelpOpen(false), 400)
    e.stopPropagation()
  }
  const clickStopPropagation = (e: React.MouseEvent) => e.stopPropagation()
  const onChangeStage = (e: React.ChangeEvent<HTMLSelectElement>) =>
    ctx.setStageId(parseInt(e.target.value))

  useEffect(() => {
    ctx.audioFilterer((actx: AudioContext, nodes: AudioNodes) => {
      const t = actx.currentTime + 0.05
      nodes.filter.type = 'allpass'
      nodes.gain.gain.setValueAtTime(1.0, t)
    })
  }, [])

  useEffect(() => {
    if (helpOpen) {
      ctx.setHelpShown()
      setTimeout(() => {
        if (!helpModalRef.current) {
          return
        }
        helpModalRef.current.style.inset = '5% 10%'
      }, 50)
    }
  }, [helpOpen])

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const root = document.getElementById('screenRoot')
    if (!root) {
      return
    }
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      root.requestFullscreen()
      window.screen.orientation.lock('landscape-primary')
    }
  }

  const authorData = useMemo(
    () =>
      stages.reduce<{ [key: string]: string[] }>((acc, stage) => {
        const stages = acc[stage.author] || []
        stages.push(stage.name)
        acc[stage.author] = stages
        return acc
      }, {}),
    [stages],
  )

  const debug = isDebug()

  return (
    <div
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <select
        id="stageSelect"
        defaultValue={ctx.stageId}
        onClick={clickStopPropagation}
        onChange={onChangeStage}
      >
        {stages.map((stage, i) => (
          <option
            key={i}
            value={i}
            disabled={i > ctx.maxStageId && !debug}
            style={{
              fontFamily: 'DynaPuff, serif !important',
            }}
          >
            {`${i} - ${stage.name}`}
          </option>
        ))}
      </select>
      <img
        src={helpUrl}
        style={{
          position: 'absolute',
          top: '2%',
          left: '2%',
          width: '4%',
          cursor: 'pointer',
        }}
        onClick={openHelp}
      />
      <img
        src={fullscreenUrl}
        style={{
          position: 'absolute',
          top: '2%',
          right: '2%',
          width: '4%',
          cursor: 'pointer',
        }}
        onClick={toggleFullscreen}
      />
      <img
        src={titleUrl}
        style={{
          width: '100%',
          position: 'absolute',
          top: '50%',
        }}
        className="titleAnime"
      />
      {helpOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
          onClick={closeHelp}
        >
          <div
            className="helpModal"
            style={{
              inset: '50% 10%',
            }}
            ref={helpModalRef}
          >
            <h1>ADA PURIN COY - Purin Birthday Project 2025</h1>
            <section>
              <p>Happy Birthday Purin!!!</p>
              <p>Can you find out all hidden Purins on screen??</p>
            </section>
            <section>
              <p>[ SAFE FOR STREAM ]</p>
            </section>
            <hr />
            <section>
              <h2>Stage design</h2>
              <div className="nameList">
                {Object.keys(authorData).map((name) => (
                  <div key={name} title={authorData[name].join(', ')}>
                    {name}
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2>Game system</h2>
              <div className="nameList">
                <div>doramanjyu</div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

export default Title
export const preloads: string[] = []
