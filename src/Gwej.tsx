import React, { useContext } from 'react'

import gwejUrl from './gwej.png'

import { StateContext } from './state'

const Gwej = () => {
  const ctx = useContext(StateContext)
  return (
    <img
      src={gwejUrl}
      style={{
        display: ctx.gwej ? 'block' : 'none',
        position: 'absolute',
        height: '90%',
        bottom: '-20%',
        right: '-5%',
        pointerEvents: 'none',
      }}
      className="gwejAnime"
    />
  )
}

export default Gwej
