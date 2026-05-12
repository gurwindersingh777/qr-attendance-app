import { notificationApi } from "@/api/notification"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Bell } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Notification } from "@/types"
import { formatDate } from "@/utils/formatDate"

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: unreadCountData } = useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 30000
  })

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll(),
    enabled: open
  })

  const { mutate: markRead } = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const { mutate: markAllRead } = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const unreadCount = unreadCountData?.data ?? 0
  const notifications: Notification[] = notificationsData?.data ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[calc(100vw-6rem)] sm:w-80 p-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-medium text-sm text-slate-900">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <span className="text-sm text-slate-400">Loading...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 gap-1">
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="text-sm text-slate-400">No notifications</span>
            </div>
          ) : (
            notifications.map((notification, idx) => (
              <div key={notification._id}>
                <div
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  onClick={() => {
                    if (!notification.isRead) markRead(notification._id)
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1.5 shrink-0">
                      {!notification.isRead ? (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      ) : (
                        <div className="w-2 h-2 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-snug">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          {formatDate(notification.createdAt)}
                        </span>
                        {notification.type === 'low_attendance' && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            Low attendance
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {idx < notifications.length - 1 && <Separator />}
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
