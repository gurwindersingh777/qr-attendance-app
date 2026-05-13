import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"

interface UseQRScannerProps {
  onScan: (token: string) => void
  enabled: Boolean
}

export function useQRScanner({ onScan, enabled }: UseQRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const SCANNER_ID = "qr-scanner-container"

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true

    const startScanner = async () => {
      setIsStarting(true)
      setCameraError(null)

      try {
        const scanner = new Html5Qrcode(SCANNER_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false
        })
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 5, qrbox: 220, aspectRatio: 1 },
          (decodedText) => {
            if (isMounted) { onScan(decodedText) }
          },
          () => { }
        )
      } catch (err: any) {
        if (isMounted) {
          if (err?.message?.includes('Permission')) {
            setCameraError('Camera permission denied. Please allow camera access in your browser settings.')
          } else if (err?.message?.includes('No cameras')) {
            setCameraError('No camera found on this device.')
          } else {
            setCameraError('Could not start camera. Use manual entry below.')
          }
        }
      } finally {
        if (isMounted) setIsStarting(false)
      }
    }

    startScanner()

    return () => {
      isMounted: false
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear()
            scannerRef.current = null
          })
      }
    }
  }, [enabled])
  return { SCANNER_ID, isStarting, cameraError }
}