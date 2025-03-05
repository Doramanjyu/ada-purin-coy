import { useState } from 'react'

export const useOnce = (): [boolean, () => void] => {
  const [done, setDone] = useState(false)

  return [done, () => setDone(true)]
}
