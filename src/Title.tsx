import React, { useContext, useState, useEffect, useRef } from 'react'

import titleUrl from './title.png'
import helpUrl from './help.png'

import { StateContext, PageState } from './state'
import { stages } from './stages'

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
    helpModalRef.current.style.inset = '50% 15%'
    setTimeout(() => setHelpOpen(false), 400)
    e.stopPropagation()
  }
  const clickStopPropagation = (e: React.MouseEvent) => e.stopPropagation()
  const onChangeStage = (e: React.ChangeEvent<HTMLSelectElement>) =>
    ctx.setStageId(parseInt(e.target.value))

  useEffect(() => {
    if (helpOpen) {
      ctx.setHelpShown()
      setTimeout(() => {
        if (!helpModalRef.current) {
          return
        }
        helpModalRef.current.style.inset = '5% 15%'
      }, 50)
    }
  }, [helpOpen])

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
            disabled={i > ctx.maxStageId}
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
          cursor: 'pointer',
        }}
        onClick={openHelp}
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
              inset: '50% 15%',
            }}
            ref={helpModalRef}
          >
            <h1>ADA PURIN COY - Purin Birthday Project 2025</h1>
            <p>Happy Birthday Purin!!!</p>
            <p>Can you find out all hidden Purins on screen??</p>
            <hr />
            <h2>Stage design</h2>
            <div className="nameList">
              {Array.from(new Set(stages.map((stage) => stage.author))).map(
                (name) => (
                  <div>{name}</div>
                ),
              )}
            </div>
            <h2>Game system</h2>
            <div className="nameList">
              <div>doramanjyu</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Title
export const preloads: string[] = []
