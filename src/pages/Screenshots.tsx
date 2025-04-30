
import { useState } from "react";
import ScreenshotViewer, { Screenshot } from "@/components/ScreenshotViewer";

// Dummy data for screenshots
const dummyScreenshots: Screenshot[] = [
  {
    id: "ss1",
    taskId: "task1",
    taskTitle: "Create Landing Page Design",
    timestamp: new Date("2025-04-30T09:15:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=Landing+Page+Design+Screenshot",
  },
  {
    id: "ss2",
    taskId: "task1",
    taskTitle: "Create Landing Page Design",
    timestamp: new Date("2025-04-30T09:18:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=Landing+Page+Design+Screenshot+2",
  },
  {
    id: "ss3",
    taskId: "task2",
    taskTitle: "Implement API Integration",
    timestamp: new Date("2025-04-29T14:30:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=API+Integration+Screenshot",
  },
  {
    id: "ss4",
    taskId: "task2",
    taskTitle: "Implement API Integration",
    timestamp: new Date("2025-04-29T14:33:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=API+Integration+Screenshot+2",
  },
  {
    id: "ss5",
    taskId: "task3",
    taskTitle: "Fix Navigation Bug",
    timestamp: new Date("2025-04-28T11:15:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=Navigation+Bug+Screenshot",
  },
  {
    id: "ss6",
    taskId: "task3",
    taskTitle: "Fix Navigation Bug",
    timestamp: new Date("2025-04-28T11:18:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=Navigation+Bug+Screenshot+2",
  },
  {
    id: "ss7",
    taskId: "task4",
    taskTitle: "Write User Documentation",
    timestamp: new Date("2025-04-27T15:45:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=Documentation+Screenshot",
  },
  {
    id: "ss8",
    taskId: "task4",
    taskTitle: "Write User Documentation",
    timestamp: new Date("2025-04-27T15:48:00"),
    imageUrl: "https://placehold.co/640x360/e9ecef/495057?text=Documentation+Screenshot+2",
  },
];

const Screenshots = () => {
  const [screenshots] = useState<Screenshot[]>(dummyScreenshots);
  
  return (
    <div className="h-full">
      <ScreenshotViewer screenshots={screenshots} />
    </div>
  );
};

export default Screenshots;
