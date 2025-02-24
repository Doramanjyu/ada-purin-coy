import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'

import Title, { preloads as preloadsTitle } from './Title'
import Game, { preloads as preloadsGame } from './Game'
import Bgm from './Bgm'
import { StateContextProvider, StateContext, PageState } from './state'

const Contents = () => {
  const ctx = useContext(StateContext)
  const fadeRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(PageState.Title)

  useEffect(() => {
    const preloads = ([] as string[]).concat(preloadsTitle, preloadsGame)
    preloads.forEach(async (url) => {
      console.debug('preload', url)
      const img = new Image()
      img.src = url
    })
  }, [])

  useEffect(() => {
    if (ctx.page === currentPage) {
      return
    }
    const nextPage = ctx.page
    if (fadeRef.current) {
      fadeRef.current.style.opacity = '1'
    }
    setTimeout(() => {
      if (fadeRef.current) {
        fadeRef.current.style.opacity = '0'
      }
      setCurrentPage(nextPage)
    }, 200)
  }, [ctx.page, currentPage])

  const currentContents = useMemo((): React.ReactNode => {
    switch (currentPage) {
      case PageState.Title:
        return <Title />
      case PageState.Game:
        return <Game />
      default:
        return <h1>ERROR: please report this to the authors...</h1>
    }
  }, [currentPage])
  return (
    <>
      {currentContents}
      <div
        ref={fadeRef}
        style={{
          zIndex: 10000,
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(images/title-background.png)',
          backgroundSize: 'cover',
          opacity: 0,
          transitionProperty: 'opacity',
          transitionDuration: '0.2s',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

const Main = () => (
  <StateContextProvider>
    <Bgm />
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
    </div>
  </StateContextProvider>
)

export default Main
