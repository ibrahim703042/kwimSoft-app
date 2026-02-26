import {
  NotificationDropdown as SharedNotificationDropdown,
  type Notification,
} from "@kwim/shared-ui";

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New employee added",
    message: "John Doe has been added to the system",
    type: "info",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Leave request approved",
    message: "Your leave request has been approved",
    type: "success",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    title: "Attendance warning",
    message: "5 employees have not clocked in today",
    type: "warning",
    time: "1 hour ago",
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
