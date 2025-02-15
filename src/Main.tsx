import React, { useContext } from 'react'

import Title from './Title'
import Game from './Game'
import Gwej from './Gwej'
import { StateContextProvider, StateContext, PageState } from './state'

const Contents = () => {
  const ctx = useContext(StateContext)
  switch (ctx?.page) {
    case PageState.Title:
      return <Title />
    case PageState.Game:
    case PageState.GameOver:
    case PageState.GameClear:
      return (
        <>
          <Game />
          {ctx.page === PageState.GameOver && (
            <h1
              style={{
                position: 'absolute',
                inset: 0,
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                paddingTop: '10%',
              }}
            >
              Game Over
            </h1>
          )}
          {ctx.page === PageState.GameClear && (
            <h1
              style={{
                position: 'absolute',
                inset: 0,
                textAlign: 'center',
                color: 'green',
                paddingTop: '10%',
              }}
            >
              Cleared
            </h1>
          )}
        </>
      )
    default:
      return <>ERROR</>
  }
}

const Main = () => (
  <StateContextProvider>
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '16 / 9',
        objectFit: 'contain',
      }}
    >
      <Contents />
      <Gwej />
    </div>
  </StateContextProvider>
)

export default Main
