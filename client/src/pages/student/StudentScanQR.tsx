import { sessionApi } from "@/api/session"
import ManualTokenEntry from "@/components/shared/ManualTokenEntry"
import { Button } from "@/components/ui/button"
import { useQRScanner } from "@/hooks/useQRScanner"
import { MarkAttendanceInput } from "@/schemas/sesssion.schema"
import { getLocation } from "@/utils/getLocation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Camera, CameraOff, CheckCircle2, Loader2, RefreshCw, ScanLine } from "lucide-react"
import { useCallback, useState } from "react"
import toast from "react-hot-toast"

type ScanState = "idle" | "scanning" | "success" | "error"

export default function StudentScanQR() {
  const queryClient = useQueryClient()

  const [cameraActive, setCameraActive] = useState(false)
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [lastMessage, setLastMessage] = useState("")
  const [lastScannedToken, setLastScannedToken] = useState("")

  const { mutate: markAttendance, isPending } = useMutation({
    mutationFn: (data: MarkAttendanceInput) =>
      sessionApi.attendance(data),

    onSuccess: () => {
      setScanState("success")
      setLastMessage("Attendance marked successfully!")
      setCameraActive(false)
      queryClient.invalidateQueries({ queryKey: ["attendance", "summary"] })
      toast.success("Attendance marked!")
    },
    onError: (err: any) => {
      setScanState("error")
      const msg = err?.response?.data?.message || "Failed to mark attendance"
      setLastMessage(msg)
    }
  })

  const handleScan = useCallback(
    async (scannedValue: string) => {
      if (isPending) return
      try {
        const parsed = JSON.parse(scannedValue)
        if (!parsed.token) throw new Error();

        const location = await getLocation()
        markAttendance({ token: parsed.token, location })
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Something went wrong"
        toast.error(msg)
        setScanState("error")
        setLastMessage(msg)
      }
    },
    [isPending, markAttendance]
  )

  const { SCANNER_ID, isStarting, cameraError } = useQRScanner({ onScan: handleScan, enabled: cameraActive })

  const handleReset = () => {
    setScanState("idle")
    setLastMessage("")
    setLastScannedToken("")
    setCameraActive(false)
  }

  return (
    <div className="max-w-md mx-auto space-y-5 w-full">

      <div>
        <h2 className="text-base font-semibold text-slate-900">Mark attendance</h2>
        <p className="text-sm text-slate-500 mt-0.5">Scan the QR code shown by your teacher</p>
      </div>

      {scanState === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center text-center gap-3">

          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>

          <div>
            <p className="font-semibold text-green-800">Attendance marked!</p>
            <p className="text-sm text-green-600 mt-0.5">Your attendance has been recorded successfully.</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="mt-1 border-green-200 text-green-700 hover:bg-green-100"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Scan another
          </Button>
        </div>
      )}

      {scanState !== "success" && (
        <>

          {scanState === "error" && lastMessage && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">

              <p className="text-sm text-red-700">{lastMessage}</p>
              <button
                onClick={() => {
                  setScanState("idle")
                  setLastScannedToken("")
                }}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                Try again
              </button>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            <div className="p-4 border-b border-gray-50 flex items-center justify-between">

              <span className="text-sm text-slate-600 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Camera scanner
              </span>

              <Button
                size="sm"
                variant={cameraActive ? "outline" : "default"}
                onClick={() => {
                  setCameraActive((prev) => !prev)
                  setScanState("idle")
                  setLastScannedToken("")
                }}
                disabled={isStarting}
                className={
                  cameraActive
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "bg-slate-900 hover:bg-slate-700"
                }
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Starting...
                  </>
                ) : cameraActive ? (
                  <>
                    <CameraOff className="w-3.5 h-3.5 mr-1.5" />
                    Stop camera
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    Start camera
                  </>
                )}
              </Button>
            </div>

            <div className="relative bg-black">

              <div id={SCANNER_ID} className="w-full" />

              {cameraActive && !isStarting && !cameraError && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">

                  <div className="relative w-52 h-52">

                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-sm" />

                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-sm" />

                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-sm" />

                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-sm" />

                    <div className="absolute left-2 right-2 top-1/2 h-px bg-green-400 opacity-80 animate-pulse" />
                  </div>
                </div>
              )}

              {!cameraActive && !isStarting && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">

                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center">
                    <ScanLine className="w-7 h-7 text-slate-400" />
                  </div>

                  <p className="text-sm text-slate-400">
                    Press Start camera to scan
                  </p>
                </div>
              )}

              {isStarting && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">

                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />

                  <p className="text-sm text-slate-400">
                    Starting camera...
                  </p>
                </div>
              )}
            </div>

            {cameraActive && !cameraError && !isStarting && (
              <div className="px-4 py-2.5 bg-slate-950 flex items-center gap-2">

                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />

                <span className="text-xs text-slate-400">
                  Point camera at QR code
                </span>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">

              <p className="text-sm font-medium text-amber-800 mb-0.5">
                Camera unavailable
              </p>

              <p className="text-xs text-amber-600">
                {cameraError}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-slate-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">

            <ManualTokenEntry
              onSubmit={markAttendance}
              isPending={isPending}
            />

            <p className="text-xs text-slate-400 mt-3">
              Your teacher will display a 6-character code on screen.
              Type it above if you cannot scan the QR code.
            </p>
          </div>
        </>
      )}
    </div>
  )
}