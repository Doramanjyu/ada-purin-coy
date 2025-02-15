import React, { useContext } from 'react'

import clearedUrl from './cleared.png'

import { StateContext, PageState, GwejState } from './state'

const Cleared = () => {
  const ctx = useContext(StateContext)
  const onClick = () => {
    ctx.setPage(PageState.Title)
    ctx.setGwej(GwejState.None)
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
