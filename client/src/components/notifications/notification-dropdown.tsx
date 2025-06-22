import { useNotifications, Notification } from "@/context/notification-context";
import { formatDistanceToNow } from "date-fns";
import { Calendar, BellRing, CheckCircle2, Info } from "lucide-react";
import { Link } from "wouter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  const getIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "confirmation":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div 
      className={`p-3 border-b last:border-b-0 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
      onClick={() => !notification.isRead && markAsRead(notification.id)}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{notification.title}</div>
          <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
          <div className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative flex items-center justify-center p-2">
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          <Link href="/notifications">
            <a className="text-xs text-primary hover:underline">View all</a>
          </Link>
        </div>
        
        <ScrollArea className="max-h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}