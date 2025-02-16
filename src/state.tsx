import React, { createContext, useState } from 'react'

import { usePersistState } from './usePersistState'

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
  Both = 3,
  Nggak = 4,
}

export type State = {
  page: PageState
  setPage: (state: PageState) => void
  gwej: GwejState
  setGwej: (state: GwejState) => void
  helpShown: boolean
  setHelpShown: () => void
  stageId: number
  setStageId: (id: number) => void
  maxStageId: number
  setMaxStageId: (id: number) => void
}

export const StateContext = createContext<State>({
  page: PageState.Title,
  setPage: () => {},
  gwej: GwejState.None,
  setGwej: () => {},
  helpShown: false,
  setHelpShown: () => {},
  stageId: 0,
  setStageId: () => {},
  maxStageId: 0,
  setMaxStageId: () => {},
})

type Props = {
  children: React.ReactNode
}

export const StateContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState(PageState.Title)
  const [gwej, setGwej] = useState(GwejState.None)
  const [stageId, setStageId] = useState(0)
  const [maxStageId, setMaxStageIdFn] = usePersistState('maxStageId', 0)
  const [helpShown, setHelpShownBool] = useState(false)
  const setMaxStageId = (id: number) => setMaxStageIdFn(() => id)
  const setHelpShown = () => setHelpShownBool(true)

  return (
    <StateContext.Provider
      value={{
        page,
        setPage,
        gwej,
        setGwej,
        helpShown,
        setHelpShown,
        stageId,
        setStageId,
        maxStageId,
        setMaxStageId,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
