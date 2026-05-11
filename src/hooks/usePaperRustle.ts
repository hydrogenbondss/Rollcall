import { useCallback, useRef } from 'react'

export function usePaperRustle() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const playRustle = useCallback(() => {
    // Only play on desktop (no mobile audio surprises)
    if (typeof window === 'undefined' || window.innerWidth < 1024) return

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }

      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Create a short noise burst to simulate paper
      const bufferSize = ctx.sampleRate * 0.08 // 80ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      // Fill with filtered noise (sounds like paper, not static)
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize
        // Envelope: fast attack, slow decay
        const envelope = Math.exp(-t * 15)
        // Low-pass filtered noise
        const noise = (Math.random() * 2 - 1) * 0.3
        // Add some tonal content for "paper" feel
        const tone = Math.sin(t * 200) * 0.1 * envelope
        data[i] = (noise + tone) * envelope * 0.15 // Very quiet (15% volume)
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer

      // Low-pass filter to keep it subtle and papery
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 3000

      source.connect(filter)
      filter.connect(ctx.destination)
      source.start()

      // Cleanup
      setTimeout(() => {
        source.disconnect()
        filter.disconnect()
      }, 200)
    } catch {
      // AudioContext not supported or blocked — silently fail
    }
  }, [])

  return playRustle
}
