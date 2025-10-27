import { DemoCard } from "@/components/demo-card";
import { Button } from "../ui/button";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export function NotificationsDemo() {
  const notifyFromJS = async () => {
    // Do you have permission to send a notification?
    let permissionGranted = await isPermissionGranted();

    // If not we need to request it
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }

    // Once permission has been granted we can send the notification
    if (permissionGranted) {
      sendNotification({ title: "Tauri", body: "Tauri is awesome!" });
    }
  };

  return (
    <DemoCard
      number={9}
      title="Notifications"
      description="Send notifications from JS or Rust"
    >
      <div className="w-full flex gap-2 flex-wrap">
        <Button className="flex-1" onClick={notifyFromJS}>
          Send Notification from JS
        </Button>
        {/*<Button className="flex-1">Send Notification from Rust</Button>*/}
      </div>
    </DemoCard>
  );
}
