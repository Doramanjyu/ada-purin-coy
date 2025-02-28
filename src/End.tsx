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
        src={allClearedUrl}
        style={{
          width: '100%',
          position: 'absolute',
          top: '10%',
        }}
        className="titleAnime"
      />
      <img
        src={clapUrl}
        style={{
          width: '40%',
          position: 'absolute',
          bottom: 0,
          left: '30%',
        }}
      />
    </div>
  )
}

export default End
export const preloads: string[] = [clapUrl, allClearedUrl]
