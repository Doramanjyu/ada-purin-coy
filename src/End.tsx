import React, { useContext, useEffect } from 'react'

import allClearedUrl from './allcleared.png'
import clapUrl from './purinclap.gif'

import { StateContext, PageState, GwejState } from './state'
import { useClickGuard } from './clickGuard'

const End = () => {
  const ctx = useContext(StateContext)
  const guard = useClickGuard(1000)

  const onClick = () => {
    if (!guard) {
      return
    }
    ctx.setStageId(0)
    ctx.setPage(PageState.Title)
  }

  useEffect(() => ctx.setGwej(GwejState.None), [])
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
        src={clapUrl}
        style={{
          width: '40%',
          position: 'absolute',
          bottom: 0,
          left: '30%',
        }}
      />
      <img
        src={allClearedUrl}
        style={{
          width: '80%',
          position: 'absolute',
          bottom: '-5%',
          left: '10%',
        }}
        className="titleAnime"
      />
    </div>
  )
}

export default End
export const preloads: string[] = [clapUrl, allClearedUrl]
