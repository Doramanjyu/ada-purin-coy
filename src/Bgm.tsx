import React, { useEffect, useContext, useState, useRef } from 'react'

import { StateContext, AudioFilterer } from './state'

const Bgm = () => {
  const ctx = useContext(StateContext)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const audioCtx = useRef<AudioContext>(null)

  useEffect(() => {
    const actx = new AudioContext()
    audioCtx.current = actx

    const src = actx.createBufferSource()
    const filter = actx.createBiquadFilter()
    const gainBase = actx.createGain()
    const gain = actx.createGain()
    src.connect(filter)
    filter.connect(gainBase)
    gainBase.connect(gain)
    gain.connect(actx.destination)

    filter.type = 'allpass'
    gainBase.gain.setValueAtTime(0.6, actx.currentTime)

    const filterer = (fn: AudioFilterer) =>
      fn(actx, {
        src,
        gain,
        filter,
      })
    ctx.setAudioFilterer(filterer)

    let loaded = false
    const load = async () => {
      const resp = await fetch('sounds/purinsearch.mp3')
      const ab = await resp.arrayBuffer()
      const audio = await actx.decodeAudioData(ab)

      src.buffer = audio
      src.loop = true
      src.start()
      loaded = true

      if (actx.state !== 'running') {
        setAudioBlocked(true)
      }
    }
    load()

    return () => {
      if (loaded) {
        src.stop()
      }
      src.disconnect()
      filter.disconnect()
      actx.close()
    }
  }, [setAudioBlocked])

  const unblockAudio = () => {
    if (!audioCtx.current) {
      return
    }
    audioCtx.current.resume()
    setAudioBlocked(false)
  }
  return (
    <>
      {audioBlocked && (
        <div className="audioUnblocker" onClick={unblockAudio}>
          Click to unblock the audio
        </div>
      )}
    </>
  )
}

export default Bgm
