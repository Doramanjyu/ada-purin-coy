import React, { createContext, useState } from 'react'

export enum PageState {
  Title = 0,
  Game = 1,
}

export type State = {
  page: PageState
  setPage: (state: PageState) => void
}

export const StateContext = createContext<State>({
  page: PageState.Title,
  setPage: () => {},
})

type Props = {
  children: React.ReactNode
}

export const StateContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState(PageState.Title)

  return (
    <StateContext.Provider
      value={{
        page,
        setPage,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
