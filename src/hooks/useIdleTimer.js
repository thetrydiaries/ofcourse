import { useState, useEffect, useRef, useCallback } from 'react'

export function useIdleTimer(delay = 2000) {
  const [idle, setIdle] = useState(false)
  const timerRef = useRef(null)

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    setIdle(false)
    timerRef.current = setTimeout(() => setIdle(true), delay)
  }, [delay])

  useEffect(() => {
    reset()
    return () => clearTimeout(timerRef.current)
  }, [reset])

  return { idle, reset }
}
