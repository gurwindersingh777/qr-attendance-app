import { sessionApi } from "@/api/session"
import { subjectApi } from "@/api/subject"
import type { Subject } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader2, Play } from "lucide-react"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "@/lib/utils"
import { StartSessionInput, startSessionSchema } from "@/schemas/sesssion.schema"
import { getLocation } from "@/utils/getLocation"

const DURATIONS = [
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
]

interface Props {
  defaultSubjectId?: string
}

export default function StartSessionDialog({ defaultSubjectId }: Props) {
  const [open, setOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: subjectsData } = useQuery({
    queryKey: ['subject', 'teacher'],
    queryFn: () => subjectApi.getSubjects(),
    enabled: open,
  })

  const subjects: Subject[] = subjectsData?.data ?? []

  const { setValue, handleSubmit, formState: { errors } } = useForm<StartSessionInput>({
    resolver: zodResolver(startSessionSchema),
    defaultValues: {
      subjectId: defaultSubjectId ?? '',
      durationMinutes: 60,
    }
  })

  const { mutate: start, isPending } = useMutation({
    mutationFn: (data: StartSessionInput) => sessionApi.start(data),
    onSuccess: (res) => {
      const sessionId = res.data?._id
      queryClient.invalidateQueries({ queryKey: ['sessions', 'active'] })
      toast.success('Session started!')
      setOpen(false)
      navigate(`/teacher/session/${sessionId}`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.message || "Something went wrong")
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsGettingLocation(true)
      const location = await getLocation()
      start({ ...data, location: location, })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to access location")
    } finally {
      setIsGettingLocation(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Start session
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Start attendance session</DialogTitle>
          <DialogDescription>
            A QR code will be generated and rotated every 30 seconds.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select
              defaultValue={defaultSubjectId}
              onValueChange={(v) => setValue('subjectId', v, { shouldValidate: true })}
            >
              <SelectTrigger className={cn(errors.subjectId && 'border-red-400')}>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.subjectName} — {s.subjectCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subjectId && (
              <p className="text-xs text-red-500">{errors.subjectId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Select
              defaultValue="60"
              onValueChange={(v) =>
                setValue('durationMinutes', parseInt(v), { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={String(d.value)}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm"
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              disabled={isPending || isGettingLocation}
            >
              {isPending || isGettingLocation ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  {isGettingLocation ? "Getting location..." : "Starting..."}
                </>
              ) : (
                "Start session"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>

    </Dialog>
  )
}
