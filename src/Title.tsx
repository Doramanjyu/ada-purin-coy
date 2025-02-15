import React, { useContext } from 'react'

import titleUrl from './title.png'

import { StateContext, PageState } from './state'

const Title = () => {
  const ctx = useContext(StateContext)
  const onClick = () => ctx.setPage(PageState.Game)
  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <img
        src={titleUrl}
        style={{
          width: '100%',
          marginTop: '30%',
        }}
        className="titleAnime"
      />
    </div>
  )
}

export default Title
