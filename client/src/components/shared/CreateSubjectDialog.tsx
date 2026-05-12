import { subjectApi } from "@/api/subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { CreateSubjectInput, createSubjectSchema } from "@/schemas/subject.schema";


export default function CreateSubjectDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateSubjectInput>({
    resolver: zodResolver(createSubjectSchema)
  })

  const { mutate: create, isPending } = useMutation({
    mutationFn: (data: CreateSubjectInput) => subjectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', 'teacher'] })
      toast.success('Subject created!')
      reset()
      setOpen(false)
    },
    onError: (error: any) => {
      toast.success(error?.response?.data.message || "something went wrong")
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-700">
          <Plus className="w-4 h-4 mr-1.5" />
          New subject
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create subject</DialogTitle>
          <DialogDescription>
            Students will enroll using the subject code you set here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => create(data))} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="subjectName">Subject name</Label>
            <Input
              id="subjectName"
              placeholder="Computer Networks"
              {...register('subjectName')}
              className={cn('text-sm ', errors.subjectName && 'border-red-400')}
            />
            {errors.subjectName && (
              <p className="text-xs text-red-500">{errors.subjectName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subjectCode">Subject code</Label>
            <Input
              id="subjectCode"
              placeholder="CN101"
              className={cn('text-sm uppercase tracking-widest', errors.subjectCode && 'border-red-400')}
              {...register('subjectCode')}
            />
            {errors.subjectCode && (
              <p className="text-xs text-red-500">{errors.subjectCode.message}</p>
            )}
            <p className="text-xs text-slate-400">
              Students use this code to enroll. Keep it short and memorable.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm"
              onClick={() => { reset(); setOpen(false) }}>
              Cancel
            </Button>
            <Button type="submit" size="sm"
              className="bg-slate-900 hover:bg-slate-700" disabled={isPending}>
              {isPending
                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Creating...</>
                : 'Create subject'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
