import React, { useContext, useEffect } from 'react'

import Title, { preloads as preloadsTitle } from './Title'
import Game, { preloads as preloadsGame } from './Game'
import Gwej, { preloads as preloadsGwej } from './Gwej'
import { StateContextProvider, StateContext, PageState } from './state'

const Contents = () => {
  const ctx = useContext(StateContext)
  useEffect(() => {
    const preloads = ([] as string[]).concat(
      preloadsTitle,
      preloadsGame,
      preloadsGwej,
    )
    preloads.forEach(async (url) => {
      console.debug('preload', url)
      const img = new Image()
      img.src = url
    })
  }, [])
  switch (ctx?.page) {
    case PageState.Title:
      return <Title />
    case PageState.Game:
      return <Game />
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
