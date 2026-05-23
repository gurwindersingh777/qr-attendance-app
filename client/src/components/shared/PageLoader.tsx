import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[75vh]">
      <Loader2 className=" animate-spin" />
    </div>
  )
}
