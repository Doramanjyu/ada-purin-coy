import React, { useContext } from 'react'

import Title from './Title'
import { StateContextProvider, StateContext, PageState } from './state'

const Contents = () => {
  const ctx = useContext(StateContext)
  switch (ctx?.page) {
    case PageState.Title:
      return <Title />
    case PageState.Game:
      return <>Game</>
    default:
      return <>ERROR</>
  }
}

const Main = () => (
  <StateContextProvider>
    <Contents />
  </StateContextProvider>
)

export default Main
