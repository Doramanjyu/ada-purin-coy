import React, { useContext, useState, useEffect } from 'react'

import titleUrl from './title.png'
import helpUrl from './help.png'

import { StateContext, PageState } from './state'
import { stages } from './gameData'

const Title = () => {
  const ctx = useContext(StateContext)
  const onClick = () => ctx.setPage(PageState.Game)
  const [helpOpen, setHelpOpen] = useState(!ctx.helpShown)
  const openHelp = (e: React.MouseEvent) => {
    setHelpOpen(true)
    e.stopPropagation()
  }
  const closeHelp = (e: React.MouseEvent) => {
    setHelpOpen(false)
    e.stopPropagation()
  }
  const clickStopPropagation = (e: React.MouseEvent) => e.stopPropagation()
  const onChangeStage = (e: React.ChangeEvent<HTMLSelectElement>) =>
    ctx.setStageId(parseInt(e.target.value))

  useEffect(() => {
    if (helpOpen) {
      ctx.setHelpShown()
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
            {stage.name}
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
          <div className="helpModal" style={{}}>
            <h1>ADA PURIN COY - Purin Birthday Project 2025</h1>
            <p>Happy Birthday Purin!!!</p>
            <p>Can you find out all hidden Purins on screen??</p>
            <hr />
            <h2>Illusts</h2>
            <div className="nameList">
              <div>doramanjyu</div>
              <div>name</div>
              <div>name</div>
              <div>name</div>
            </div>
            <h2>Game system</h2>
            <div className="nameList">
              <div>doramanjyu</div>
              <div>name</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Title
export const preloads: string[] = []
