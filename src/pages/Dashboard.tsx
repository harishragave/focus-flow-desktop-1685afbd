
import { useState } from "react";
import TaskList, { Task } from "@/components/TaskList";
import TaskDetail from "@/components/TaskDetail";
import TaskTimer from "@/components/TaskTimer";
import { useToast } from "@/hooks/use-toast";

// Dummy data for tasks
const dummyTasks: Task[] = [
  {
    id: "task1",
    title: "Create Landing Page Design",
    description: "Design the landing page mockup for the new marketing campaign.",
    priority: "high",
    dueDate: "2025-05-05",
    estimatedTime: 120, // 2 hours
    subtasks: [
      { id: "sub1-1", title: "Research design trends", completed: true },
      { id: "sub1-2", title: "Create wireframe", completed: true },
      { id: "sub1-3", title: "Design high fidelity mockup", completed: false },
      { id: "sub1-4", title: "Prepare for review", completed: false },
    ],
  },
  {
    id: "task2",
    title: "Implement API Integration",
    description: "Connect the frontend to the new payment API endpoints.",
    priority: "medium",
    dueDate: "2025-05-10",
    estimatedTime: 180, // 3 hours
    subtasks: [
      { id: "sub2-1", title: "Review API documentation", completed: true },
      { id: "sub2-2", title: "Create API service", completed: false },
      { id: "sub2-3", title: "Implement error handling", completed: false },
      { id: "sub2-4", title: "Write tests", completed: false },
    ],
  },
  {
    id: "task3",
    title: "Fix Navigation Bug",
    description: "Fix the issue with dropdown navigation not working on mobile devices.",
    priority: "low",
    dueDate: "2025-05-03",
    estimatedTime: 60, // 1 hour
    subtasks: [
      { id: "sub3-1", title: "Reproduce the bug", completed: true },
      { id: "sub3-2", title: "Debug the issue", completed: false },
      { id: "sub3-3", title: "Test fix on mobile devices", completed: false },
    ],
  },
  {
    id: "task4",
    title: "Write User Documentation",
    description: "Create user guide documentation for the new feature set launching next week.",
    priority: "medium",
    dueDate: "2025-05-12",
    estimatedTime: 240, // 4 hours
    subtasks: [
      { id: "sub4-1", title: "Outline main sections", completed: true },
      { id: "sub4-2", title: "Write first draft", completed: false },
      { id: "sub4-3", title: "Add screenshots", completed: false },
      { id: "sub4-4", title: "Review with team", completed: false },
      { id: "sub4-5", title: "Finalize and publish", completed: false },
    ],
  },
];

const Dashboard = () => {
  const [tasks] = useState<Task[]>(dummyTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const { toast } = useToast();
  
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;
  const activeTask = tasks.find((task) => task.id === activeTaskId) || null;
  
  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task.id);
  };
  
  const handleStartTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setIsPaused(false);
    setIsOnBreak(false);
    toast({
      title: "Task Started",
      description: "Timer is now running for this task",
    });
  };
  
  const handlePauseTask = (taskId: string) => {
    setIsPaused(true);
    toast({
      title: "Task Paused",
      description: "Timer has been paused",
    });
  };
  
  const handleResumeTask = (taskId: string) => {
    setIsPaused(false);
    toast({
      title: "Task Resumed",
      description: "Timer has been resumed",
    });
  };
  
  const handleCompleteTask = (taskId: string) => {
    setActiveTaskId(null);
    setIsPaused(false);
    setIsOnBreak(false);
    toast({
      title: "Task Completed",
      description: "Great job! Task has been completed",
    });
  };
  
  const handleTakeBreak = (taskId: string) => {
    setIsOnBreak(true);
    toast({
      title: "Break Started",
      description: "Enjoy your 5 minute break",
    });
  };
  
  const handleEndBreak = () => {
    setIsOnBreak(false);
    toast({
      title: "Break Ended",
      description: "Break time is over, returning to task",
    });
  };
  
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <TaskList
          tasks={tasks}
          onSelectTask={handleSelectTask}
          selectedTaskId={selectedTaskId}
        />
        <TaskDetail
          task={selectedTask}
          onStartTask={handleStartTask}
          onPauseTask={handlePauseTask}
          onCompleteTask={handleCompleteTask}
          onTakeBreak={handleTakeBreak}
          currentTaskId={activeTaskId}
          isPaused={isPaused}
          isOnBreak={isOnBreak}
        />
      </div>
      
      {activeTask && (
        <div className="flex-none h-80">
          <TaskTimer
            taskTitle={activeTask.title}
            isRunning={activeTaskId !== null}
            isPaused={isPaused}
            isOnBreak={isOnBreak}
            onPause={() => handlePauseTask(activeTask.id)}
            onResume={() => handleResumeTask(activeTask.id)}
            onComplete={() => handleCompleteTask(activeTask.id)}
            onBreak={() => handleTakeBreak(activeTask.id)}
            onEndBreak={handleEndBreak}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
