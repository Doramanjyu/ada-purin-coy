import React, { useContext, useEffect, useState } from 'react'

import clearedUrl from './cleared.png'

import { StateContext, PageState, GwejState } from './state'
import { stages } from './stages'

const Cleared = () => {
  const ctx = useContext(StateContext)
  const [closing, setClosing] = useState(false)
  const onClick = () => {
    ctx.setGwej(GwejState.None)
    setClosing(true)
    if (ctx.stageId == stages.length - 1) {
      ctx.setPage(PageState.Title)
      return
    }
    ctx.setStageId(ctx.stageId + 1)
    if (ctx.maxStageId < ctx.stageId + 1) {
      ctx.setMaxStageId(ctx.stageId + 1)
    }
    ctx.setPage(PageState.Game)
  }
  useEffect(() => {
    ctx.setGwej(GwejState.Both)
  }, [])
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      {!closing && (
        <img
          src={clearedUrl}
          style={{
            position: 'absolute',
            width: '50%',
            left: '25%',
            top: '0',
          }}
          className="titleAnime"
        />
      )}
    </div>
  )
}

export default Cleared
export const preloads: string[] = [clearedUrl]
