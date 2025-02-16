import React, { useContext } from 'react'

import clearedUrl from './cleared.png'

import { StateContext, PageState, GwejState } from './state'
import { stages } from './gameData'

const Cleared = () => {
  const ctx = useContext(StateContext)
  const onClick = () => {
    ctx.setGwej(GwejState.None)
    if (ctx.stageId == stages.length - 1) {
      ctx.setPage(PageState.Title)
      return
    }
    ctx.setStageId(ctx.stageId + 1)
    ctx.setPage(PageState.Game)
  }
  ctx.setGwej(GwejState.Both)
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <img
        src={clearedUrl}
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
        }}
        className="titleAnime"
      />
    </div>
  )
}

export default Cleared
export const preloads: string[] = [clearedUrl]
