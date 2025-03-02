import React, { createContext, useState, useEffect } from 'react'

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
  src: AudioBufferSourceNode
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
  const [stageIdRaw, setStageIdFn] = usePersistState('selectedStageId', 0)
  const [helpShown, setHelpShownBool] = useState(false)
  const setMaxStageId = (id: number) => setMaxStageIdFn(() => id)
  const setStageId = (id: number) => setStageIdFn(() => id)
  const setHelpShown = () => setHelpShownBool(true)
  const [audioFilterer, setAudioFiltererRaw] = useState<
    (fn: AudioFilterer) => void
  >(() => () => {})
  const setAudioFilterer = (fn: (fn: AudioFilterer) => void) =>
    setAudioFiltererRaw(() => fn)
  const stageId = Math.min(stageIdRaw, stages.length - 1)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const stageName = p.get('stage')
    if (!stageName) {
      return
    }
    const unifyName = (s: string) => s.toLowerCase().replaceAll(/[-_]/g, ' ')
    const stageUnified = unifyName(stageName)
    const id = stages.findIndex((s) => unifyName(s.name) === stageUnified)
    if (id !== -1) {
      setStageId(id)
      setPage(PageState.Game)
    }
  }, [window.location.search])

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
