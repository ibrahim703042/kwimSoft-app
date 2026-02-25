import {
  NotificationDropdown as SharedNotificationDropdown,
  type Notification,
} from "@kwim/shared-ui";

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New user registered",
    message: "John Doe has created an account",
    type: "info",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Task completed",
    message: "Export report has been generated",
    type: "success",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    title: "System warning",
    message: "Storage space is running low",
    type: "warning",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    title: "Payment failed",
    message: "Invoice #1234 payment failed",
    type: "error",
    time: "2 hours ago",
    read: true,
  },
];

const NotificationDropdown = () => {
  return (
    <SharedNotificationDropdown
      notifications={mockNotifications}
      onViewAll={() => console.log("View all notifications")}
    />
  );
};

export default NotificationDropdown;
