import React, { useContext } from 'react'

import gwejUrl from './gwej.png'
import nggakUrl from './nggak.png'

import { StateContext, GwejState } from './state'

const Gwej = () => {
  const state = useContext(StateContext)
  return (
    <>
      <img
        src={gwejUrl}
        style={{
          display:
            state.gwej === GwejState.Right || state.gwej === GwejState.Both
              ? 'block'
              : 'none',
          position: 'absolute',
          height: '90%',
          bottom: '-20%',
          right: '-5%',
          pointerEvents: 'none',
        }}
        className="gwejAnimeRight"
      />
      <img
        src={gwejUrl}
        style={{
          display:
            state.gwej === GwejState.Left || state.gwej === GwejState.Both
              ? 'block'
              : 'none',
          position: 'absolute',
          height: '90%',
          bottom: '-20%',
          left: '-5%',
          pointerEvents: 'none',
        }}
        className="gwejAnimeLeft"
      />
      <img
        src={nggakUrl}
        style={{
          display: state.gwej === GwejState.Nggak ? 'block' : 'none',
          position: 'absolute',
          height: '90%',
          bottom: '-3%',
          left: '17%',
          pointerEvents: 'none',
        }}
        className="gwejAnimeRight"
      />
    </>
  )
}

export default Gwej
export const preloads: string[] = [gwejUrl, nggakUrl]
