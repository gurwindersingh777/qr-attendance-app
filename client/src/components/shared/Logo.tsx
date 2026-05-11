import { QrCode } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
        <QrCode className="w-4 h-4 text-white" />
      </div>
      <span className="font-semibold text-slate-900 text-sm">
        QR Attendance <br /> <span className="text-xs text-neutral-500 font-light">App</span> 
      </span>
    </div>
  )
}