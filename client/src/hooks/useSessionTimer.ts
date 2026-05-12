import { useEffect, useState } from "react";

export function useSessionTimer(endTime: Date | string | null) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!endTime) return;

    const tick = () => {
      const diff = new Date(endTime).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft('Ended')
        return
      }

      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${mins}m ${secs}s`)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return timeLeft
}