import React, { createContext, useState } from 'react'

import { usePersistState } from './usePersistState'
import { stages } from './stages'

export enum PageState {
  Title = 0,
  Game = 1,
  End = 2,
}

export enum GwejState {
  None = 0,
  Left = 1,
  Right = 2,
  Both = 3,
  Nggak = 4,
}

export type AudioNodes = {
  gain: GainNode
  filter: BiquadFilterNode
}
export type AudioFilterer = (actx: AudioContext, nodes: AudioNodes) => void

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
  audioFilterer: (fn: AudioFilterer) => void
  setAudioFilterer: (fn: (fn: AudioFilterer) => void) => void
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
  audioFilterer: () => {},
  setAudioFilterer: () => {},
})

type Props = {
  children: React.ReactNode
}

export const StateContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState(PageState.Title)
  const [gwej, setGwej] = useState(GwejState.None)
  const [maxStageId, setMaxStageIdFn] = usePersistState('maxStageId', 0)
  const [stageId, setStageId] = useState(
    Math.min(maxStageId, stages.length - 1),
  )
  const [helpShown, setHelpShownBool] = useState(false)
  const setMaxStageId = (id: number) => setMaxStageIdFn(() => id)
  const setHelpShown = () => setHelpShownBool(true)
  const [audioFilterer, setAudioFiltererRaw] = useState<
    (fn: AudioFilterer) => void
  >(() => {})
  const setAudioFilterer = (fn: (fn: AudioFilterer) => void) =>
    setAudioFiltererRaw(() => fn)

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
        audioFilterer,
        setAudioFilterer,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
