import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Label } from "../ui/label"
import { KeyRound, Loader2 } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { MarkAttendanceInput, markAttendanceSchema } from "@/schemas/sesssion.schema"
import { getLocation } from "@/utils/getLocation"
import { useState } from "react"
import toast from "react-hot-toast"

interface Props {
  onSubmit: (data: MarkAttendanceInput) => void
  isPending: boolean
}

export default function ManualTokenEntry({ onSubmit, isPending }: Props) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MarkAttendanceInput>({
    resolver: zodResolver(markAttendanceSchema)
  })

  const submit = async (data: MarkAttendanceInput) => {
    try {
      setIsGettingLocation(true)
      const location = await getLocation()
      onSubmit({ manualCode: data.manualCode, location })
      reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to access location")
    } finally {
      setIsGettingLocation(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-3"
    >

      <div className="space-y-1.5">

        <Label
          htmlFor="manualCode"
          className="text-sm text-slate-600 flex items-center gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5" />
          Enter Code manually
        </Label>

        <div className="flex gap-2">

          <Input
            id="manualCode"
            placeholder="Enter 6-character code"
            autoComplete="off"
            autoCapitalize="characters"
            {...register("manualCode")}
            className={cn(
              "uppercase tracking-widest text-sm md:text-xs font-mono",
              errors.manualCode ? "border-red-400" : ""
            )}
          />

          <Button
            type="submit"
            size="sm"
            disabled={isPending || isGettingLocation}
            className="bg-slate-900 hover:bg-slate-700 shrink-0"
          >
            {isPending || isGettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {errors.manualCode && (
          <p className="text-xs text-red-500">
            {errors.manualCode.message}
          </p>
        )}
      </div>
    </form>
  )
}