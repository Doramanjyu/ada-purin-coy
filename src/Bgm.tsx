import React, { useEffect, useContext } from 'react'

import { StateContext, AudioFilterer } from './state'

const Bgm = () => {
  const ctx = useContext(StateContext)
  useEffect(() => {
    const actx = new AudioContext()
    const src = actx.createBufferSource()
    const filter = actx.createBiquadFilter()
    const gain = actx.createGain()
    filter.connect(gain)
    gain.connect(actx.destination)
    gain.gain.setValueAtTime(0.5, actx.currentTime)

    const filterer = (fn: AudioFilterer) =>
      fn(actx, {
        gain,
        filter,
      })
    ctx.setAudioFilterer(filterer)

    let loaded = false
    const load = async () => {
      const resp = await fetch('sounds/bgm.mp3')
      const ab = await resp.arrayBuffer()
      const audio = await actx.decodeAudioData(ab)

      src.buffer = audio
      src.loop = true
      src.connect(filter)
      src.start()
      loaded = true
    }
    load()

    return () => {
      if (loaded) {
        src.stop()
      }
      src.disconnect()
      filter.disconnect()
    }
  }, [])
  return <></>
}

export default Bgm
