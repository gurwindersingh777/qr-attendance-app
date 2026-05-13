import { subjectApi } from "@/api/subject"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader2, Plus } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { EnrollFormInput, enrollSchema } from "@/schemas/subject.schema"

export default function EnrollDialog() {

  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EnrollFormInput>({ resolver: zodResolver(enrollSchema) })

  const { mutate: enroll, isPending } = useMutation({
    mutationFn: (data: EnrollFormInput) => subjectApi.enroll(data.subjectCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "student"] })
      queryClient.invalidateQueries({ queryKey: ["attendance", "summary"] })
      toast.success("Enroll successfully!")
      reset()
      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data.message || "Something went wrong")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-700">
          <Plus className="w-4 h-4 mr-1.5" />
          Enroll in subject
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Enroll in a subject</DialogTitle>
          <DialogDescription>
            Ask your teacher for the subject code and enter it below.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => enroll(data))}
          className="space-y-4 mt-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="subjectCode">Subject code</Label>
            <Input
              id="subjectCode"
              placeholder="e.g. CN101"
              autoComplete="off"
              autoFocus
              {...register('subjectCode')}
              className={cn(
                'uppercase tracking-widest',
                errors.subjectCode ? 'border-red-400' : ''
              )}
            />
            {errors.subjectCode && (
              <p className="text-xs text-red-500">
                {errors.subjectCode.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { reset(); setOpen(false) }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-slate-900 hover:bg-slate-700"
              disabled={isPending}
            >
              {isPending ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Enrolling...</>
              ) : (
                'Enroll'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
