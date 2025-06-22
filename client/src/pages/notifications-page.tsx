import { useNotifications, Notification } from "@/context/notification-context";
import { formatDistanceToNow, format } from "date-fns";
import { Calendar, Info, CheckCircle2, Trash2, Check, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  const { notifications, markAsRead, deleteNotification, isLoading } = useNotifications();
  
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const getIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "confirmation":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Card key={notification.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2">{getIcon(notification.type)}</div>
            <CardTitle className="text-base">{notification.title}</CardTitle>
          </div>
          <CardDescription>
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{notification.message}</p>
        <div className="text-xs text-gray-500 mb-4">
          {format(new Date(notification.createdAt), "PPP 'at' p")}
        </div>
        <div className="flex justify-between items-center">
          {notification.sessionId && (
            <Link href={`/mentor-sessions/${notification.sessionId}`}>
              <Button variant="link" className="text-sm px-0 text-primary hover:underline">
                View Session
              </Button>
            </Link>
          )}
          <div className="flex gap-2">
            {!notification.isRead && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => markAsRead(notification.id)}
                className="text-blue-500 border-blue-500 hover:bg-blue-50"
              >
                <Check className="h-4 w-4 mr-1" /> Mark as read
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => deleteNotification(notification.id)}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6">
          <Link href="/">
            <Button 
              variant="outline" 
              className="mb-6 border-green-medium text-green-dark hover:bg-green-pale hover:border-green-dark"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          
          {isLoading ? (
            <div className="text-center py-8">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Info className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>You don't have any notifications.</p>
            </div>
          ) : (
            <Tabs defaultValue="unread" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="unread">
                  Unread {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}
                </TabsTrigger>
                <TabsTrigger value="all">All Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="unread">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>You've read all your notifications!</p>
                  </div>
                ) : (
                  unreadNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="all">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}