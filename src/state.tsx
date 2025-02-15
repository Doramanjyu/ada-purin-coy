import React, { createContext, useState } from 'react'

export enum PageState {
  Title = 0,
  Game = 1,
  GameOver = 2,
  GameClear = 3,
}

export enum GwejState {
  None = 0,
  Left = 1,
  Right = 2,
}

export type State = {
  page: PageState
  setPage: (state: PageState) => void
  gwej: GwejState
  setGwej: (state: GwejState) => void
}

export const StateContext = createContext<State>({
  page: PageState.Title,
  setPage: () => {},
  gwej: GwejState.None,
  setGwej: () => {},
})

type Props = {
  children: React.ReactNode
}

export const StateContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState(PageState.Title)
  const [gwej, setGwej] = useState(GwejState.None)

  return (
    <StateContext.Provider
      value={{
        page,
        setPage,
        gwej,
        setGwej,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
