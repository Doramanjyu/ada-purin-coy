import React, { createContext, useState } from 'react'

export enum PageState {
  Title = 0,
  Game = 1,
}

export type State = {
  page: PageState
  setPage: (state: PageState) => void
  gwej: boolean
  setGwej: (show: boolean) => void
}

export const StateContext = createContext<State>({
  page: PageState.Title,
  setPage: () => {},
  gwej: false,
  setGwej: () => {},
})

type Props = {
  children: React.ReactNode
}

export const StateContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState(PageState.Title)
  const [gwej, setGwej] = useState(false)

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
