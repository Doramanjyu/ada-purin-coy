import { useEffect, useState } from 'react'

export const useClickGuard = (duration: number): boolean => {
  const [guard, setGuard] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setGuard(true), duration)
    return () => clearTimeout(timer)
  }, [])

  return guard
}
